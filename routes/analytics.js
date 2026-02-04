const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const mongoose = require('mongoose');

// @route   GET /api/analytics
// @desc    Get user's personalized analytics with timeframe filtering
router.get('/', auth, async (req, res) => {
  try {
    let userId = req.user.id;
    const { timeframe = 'week', userId: requestedUserId } = req.query;

    // If admin is requesting a specific user's analytics
    if (requestedUserId && req.user.isAdmin) {
        userId = requestedUserId;
    }
    
    let startDate = new Date();
    let groupings = 7;
    let format = 'day'; // 'day' or 'hour'

    if (timeframe === 'today') {
        startDate.setHours(startDate.getHours() - 24);
        groupings = 8; // 3-hour blocks
        format = 'hour';
    } else if (timeframe === 'month') {
        startDate.setDate(startDate.getDate() - 30);
        groupings = 30;
    } else {
        startDate.setDate(startDate.getDate() - 7);
    }

    const activities = await Activity.find({
      user: userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Initialize studyData based on timeframe
    let studyData = [];
    if (timeframe === 'today') {
        for (let i = 0; i < 8; i++) {
            const h = new Date(startDate.getTime() + i * 3 * 3600000).getHours();
            studyData.push({ label: `${h}:00`, hours: 0, points: 0 });
        }
    } else {
        const days = timeframe === 'month' ? 30 : 7;
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate.getTime() + i * 86400000);
            studyData.push({ 
                label: d.toLocaleDateString('en-US', { weekday: 'short' }), 
                date: d.toISOString().split('T')[0],
                hours: 0, 
                points: 0 
            });
        }
    }

    let totalPoints = 0;
    let totalHours = 0;
    let quizCount = 0;
    let totalScore = 0;

    activities.forEach(act => {
      // Summary Metrics
      if (act.type === 'lesson' || act.type === 'assignment') {
          totalPoints += act.points || 0;
          if (act.score) {
              totalScore += act.score;
              quizCount++;
          }
      } else if (act.type === 'focus') {
          totalHours += (act.duration || 0) / 60;
      }

      // Chart Data
      let target;
      if (timeframe === 'today') {
          const hoursSinceStart = (act.createdAt - startDate) / 3600000;
          const bucket = Math.floor(hoursSinceStart / 3);
          target = studyData[bucket];
      } else {
          const dateStr = act.createdAt.toISOString().split('T')[0];
          target = studyData.find(d => d.date === dateStr);
      }

      if (target) {
          if (act.type === 'lesson' || act.type === 'assignment') {
              target.points += act.points || 0;
          } else if (act.type === 'focus') {
              target.hours += (act.duration || 0) / 60;
          }
      }
    });

    // 2. Skill Matrix
    const courses = await Course.find({ user: userId });
    
    // 3. Recent Quests (Top 3 Recent Assignments + Modules)
    const recentAssignments = await Assignment.find({ 
        user: userId, 
        status: { $ne: 'Completed' } 
    }).sort({ createdAt: -1 }).limit(3);

    let recentModules = [];
    courses.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3).forEach(course => {
        const uncompleted = course.subCourses.find(m => !m.isCompleted);
        if (uncompleted) {
            recentModules.push({
                id: uncompleted.id,
                title: uncompleted.title,
                category: course.title,
                icon: course.category === 'AI' ? '🧠' : course.category === 'Robotics' ? '🤖' : '💻',
                difficulty: 'REGULAR',
                reward: '250 XP',
                estimatedTime: uncompleted.duration || '45m',
                type: 'module',
                createdAt: course.updatedAt // Use course update time as proxy
            });
        }
    });

    const transformedAssignments = recentAssignments.map(a => ({
        id: a.id || a._id,
        title: a.title,
        category: a.subject,
        icon: '🎯',
        difficulty: a.priority.toUpperCase(),
        reward: `${a.points} XP`,
        estimatedTime: '30m',
        type: 'assignment',
        createdAt: a.createdAt
    }));

    const recentQuests = [...transformedAssignments, ...recentModules]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3);

    const skillMatrix = courses.map(course => {
      const totalModules = course.subCourses.length;
      const completedModules = course.subCourses.filter(m => m.isCompleted).length;
      const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
      let color = 'bg-indigo-500';
      if (course.category === 'Robotics') color = 'bg-cyan-400';
      if (course.category === 'AI') color = 'bg-violet-500';
      if (course.category === 'Science') color = 'bg-emerald-400';
      return { skill: course.title, level: percentage, color };
    });

    // 3. Recent Completed Activities (What they actually did)
    const recentActivities = await Activity.find({ 
        user: userId,
        type: { $in: ['quiz', 'lesson', 'game', 'assignment'] }
    }).sort({ createdAt: -1 }).limit(10);

    const transformedActivities = recentActivities.map(act => ({
        id: act._id,
        title: act.title,
        category: act.category || act.type,
        icon: act.type === 'quiz' ? '📝' : act.type === 'game' ? '🎮' : act.type === 'lesson' ? '📚' : '🎯',
        reward: act.points,
        createdAt: act.createdAt
    }));

    // 4. Lifetime Stats (Global)
    const lifetimeStats = await Activity.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: {
          _id: null,
          totalPoints: { $sum: "$points" },
          totalDuration: { $sum: "$duration" },
          count: { $sum: 1 }
      }}
    ]);

    const globalStats = lifetimeStats[0] || { totalPoints: 0, totalDuration: 0, count: 0 };
    
    // Calculate total completed courses
    // A course is completed if all its subCourses are completed? Or just progress?
    // Using simple count filter for now or existing 'progress' logic if available.
    // Course model has 'progress' number. Let's assume progress=100 is complete.
    const completedCoursesCount = await Course.countDocuments({ user: userId, progress: 100 });

    res.json({
      studyData,
      skillMatrix,
      recentActivities: transformedActivities,
      recentQuests,
      summary: {
          gpa: quizCount > 0 ? (totalScore / quizCount / 25).toFixed(2) : "0.00",
          labHours: Math.round(totalHours),
          techChamp: Math.min(100, Math.round((totalPoints / 500) * 100)),
          efficiency: quizCount > 0 ? Math.round(totalScore / quizCount) : 0
      },
      lifetime: {
          totalPoints: globalStats.totalPoints,
          totalHours: Math.round((globalStats.totalDuration || 0) / 60),
          totalActivities: globalStats.count,
          completedCourses: completedCoursesCount
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/analytics/log
// @desc    Log any learning activity (lesson, quiz, game, etc.)
router.post('/log', auth, async (req, res) => {
    try {
        const { type, title, category, points, duration, score } = req.body;
        const activity = new Activity({
            user: req.user.id,
            type,
            title,
            category,
            points: points || 10,
            duration: duration || 0,
            score: score || 0
        });
        await activity.save();

        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
