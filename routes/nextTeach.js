const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NextTeachVideo = require('../models/NextTeachVideo');

// @route   GET api/next-teach
// @desc    Get all next-teach videos
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const videos = await NextTeachVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/next-teach
// @desc    Add a new next-teach video
// @access  Private (Admin/School Admin)
router.post('/', auth, async (req, res) => {
  const { title, youtubeUrl, videoId, thumbnail, grade, subject, channel, duration } = req.body;

  try {
    const newVideo = new NextTeachVideo({
      title,
      youtubeUrl,
      videoId,
      thumbnail,
      grade,
      subject,
      channel,
      duration,
      user: req.user.id
    });

    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
