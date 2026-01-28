const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ProjectCategory = require('../models/ProjectCategory');
const Project = require('../models/Project');

// @route   GET api/projects/categories
// @desc    Get all project categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await ProjectCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects/categories
// @desc    Create a project category
// @access  Private (Admin/Instructor)
router.post('/categories', auth, async (req, res) => {
  if (!req.user.isAdmin && !req.user.isInstructor) {
    return res.status(403).json({ msg: 'Access denied. Admins or Instructors only.' });
  }

  const { name, icon, color } = req.body;

  try {
    const newCategory = new ProjectCategory({
      name,
      icon,
      color,
      user: req.user.id
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get all projects or filter by category
// @access  Private
router.get('/', auth, async (req, res) => {
  const { categoryId } = req.query;
  const filter = categoryId ? { categoryId } : {};

  try {
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Add a new project
// @access  Private (Admin/Instructor)
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin && !req.user.isInstructor) {
    return res.status(403).json({ msg: 'Access denied. Admins or Instructors only.' });
  }

  const { categoryId, title, difficulty, time, description, materials, steps, thumbnail } = req.body;

  try {
    const newProject = new Project({
      categoryId,
      title,
      difficulty,
      time,
      description,
      materials,
      steps,
      thumbnail,
      user: req.user.id
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
