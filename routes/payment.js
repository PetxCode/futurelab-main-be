const express = require('express');
const router = express.Router();
const https = require('https');
const auth = require('../middleware/auth');
const User = require('../models/User');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// Plan definitions — amounts in kobo (₦ × 100)
const PLANS = {
  '3months': { name: 'FutureLab 3-Month Plan (20k)', amount: 2000000, interval: 'quarterly' },
  '6months': { name: 'FutureLab 6-Month Plan (35k)', amount: 3500000, interval: 'biannually' },
  '1year':   { name: 'FutureLab 1-Year Plan (60k)',  amount: 6000000, interval: 'annually' },
};

// Cache plan codes after first creation so we don't recreate on every request
const planCodeCache = {};

// ── Helper: call Paystack REST API ─────────────────────────────────────────
function paystackRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Ensure a Paystack plan exists for the given plan key ───────────────────
async function ensurePlanCode(planKey) {
  if (planCodeCache[planKey]) return planCodeCache[planKey];

  const def = PLANS[planKey];

  // List existing plans and look for a matching one
  const list = await paystackRequest('GET', '/plan');
  if (list.status && list.data) {
    const existing = list.data.find((p) => p.name === def.name);
    if (existing) {
      planCodeCache[planKey] = existing.plan_code;
      return existing.plan_code;
    }
  }

  // Create the plan
  const created = await paystackRequest('POST', '/plan', {
    name: def.name,
    amount: def.amount,
    interval: def.interval,
  });

  if (!created.status) {
    throw new Error(`Paystack plan creation failed: ${created.message}`);
  }

  planCodeCache[planKey] = created.data.plan_code;
  return planCodeCache[planKey];
}

// ── POST /api/payment/initialize ───────────────────────────────────────────
// Initializes a Paystack transaction tied to a subscription plan.
// Returns authorization_url for redirect.
router.post('/initialize', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const planCode = await ensurePlanCode(plan);

    const callback_url = `${process.env.APP_URL || 'http://localhost:3000'}/payment/verify`;

    const result = await paystackRequest('POST', '/transaction/initialize', {
      email: user.email,
      amount: PLANS[plan].amount,
      plan: planCode,
      callback_url,
      metadata: {
        userId: user._id.toString(),
        planKey: plan,
        custom_fields: [
          { display_name: 'Full Name', variable_name: 'fullName', value: user.fullName },
          { display_name: 'Plan', variable_name: 'plan', value: plan },
        ],
      },
    });

    if (!result.status) {
      return res.status(500).json({ message: result.message || 'Payment initialization failed' });
    }

    // Mark subscription as pending
    user.subscription = { ...user.subscription, plan, status: 'pending' };
    await user.save();

    res.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
      access_code: result.data.access_code,
    });
  } catch (err) {
    console.error('Payment init error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// ── POST /api/payment/initialize-new (GUEST CHECKOUT) ───────────────────────
// Initializes transaction before user is created in the DB.
router.post('/initialize-new', async (req, res) => {
  try {
    const { email, plan } = req.body;
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const planCode = await ensurePlanCode(plan);

    const callback_url = `${process.env.APP_URL || 'http://localhost:3000'}?payment_type=signup`;

    const result = await paystackRequest('POST', '/transaction/initialize', {
      email,
      amount: PLANS[plan].amount,
      plan: planCode,
      callback_url,
      metadata: { planKey: plan, isSignup: true },
    });

    if (!result.status) {
      return res.status(500).json({ message: result.message || 'Payment initialization failed' });
    }

    res.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
      access_code: result.data.access_code,
    });
  } catch (err) {
    console.error('Payment init error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// ── GET /api/payment/verify/:reference ────────────────────────────────────
// Called after Paystack redirect. Verifies payment and activates subscription.
router.get('/verify/:reference', auth, async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await paystackRequest('GET', `/transaction/verify/${reference}`);

    if (!result.status || result.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment not successful', detail: result.data?.gateway_response });
    }

    const { metadata, customer, plan_object } = result.data;
    const planKey = metadata?.planKey;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compute next billing date based on plan
    const now = new Date();
    const nextBillingMap = { '3months': 3, '6months': 6, '1year': 12 };
    const monthsToAdd = nextBillingMap[planKey] || 1;
    const nextBillingDate = new Date(now.setMonth(now.getMonth() + monthsToAdd));

    user.subscription = {
      plan: planKey,
      status: 'active',
      paystackCustomerCode: customer?.customer_code || null,
      paystackSubscriptionCode: result.data.subscription_code || null,
      nextBillingDate,
    };
    await user.save();

    res.json({ message: 'Subscription activated', subscription: user.subscription });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// ── POST /api/payment/webhook ──────────────────────────────────────────────
// Receives Paystack webhook events for auto-renewal tracking.
router.post('/webhook', async (req, res) => {
  const crypto = require('crypto');
  // express.json() already parsed the body; re-serialize to verify HMAC
  const rawBody = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Unauthorized');
  }

  const { event: evType, data } = req.body;

  try {
    if (evType === 'charge.success' && data.plan) {
      // Recurring charge succeeded — extend subscription
      const email = data.customer?.email;
      if (!email) return res.sendStatus(200);

      const user = await User.findOne({ email });
      if (!user) return res.sendStatus(200);

      const planKey = user.subscription?.plan;
      const monthsMap = { '3months': 3, '6months': 6, '1year': 12 };
      const months = monthsMap[planKey] || 1;
      const next = new Date();
      next.setMonth(next.getMonth() + months);

      user.subscription.status = 'active';
      user.subscription.nextBillingDate = next;
      user.subscription.paystackSubscriptionCode = data.subscription_code || user.subscription.paystackSubscriptionCode;
      await user.save();
    }

    if (evType === 'subscription.disable') {
      const email = data.customer?.email;
      if (email) {
        await User.findOneAndUpdate(
          { email },
          { 'subscription.status': 'inactive' }
        );
      }
    }

    if (evType === 'invoice.payment_failed') {
      const email = data.customer?.email;
      if (email) {
        await User.findOneAndUpdate(
          { email },
          { 'subscription.status': 'inactive' }
        );
      }
    }
  } catch (err) {
    console.error('Webhook error:', err);
  }

  res.sendStatus(200);
});

// ── GET /api/payment/status ────────────────────────────────────────────────
// Returns the current user's subscription status.
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription schoolName');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ subscription: user.subscription, schoolName: user.schoolName });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
