const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const ProjectCategory = require('../models/ProjectCategory');
const Project = require('../models/Project');
const User = require('../models/User');

const MOCK_CATEGORIES = [
  { name: 'Coding Classes', icon: '💻', color: 'bg-blue-500' },
  { name: 'ML Classes', icon: '🤖', color: 'bg-purple-500' },
  { name: 'Data Cleaning', icon: '🧹', color: 'bg-emerald-500' },
  { name: 'Robotic Classes', icon: '🦾', color: 'bg-orange-500' },
  { name: 'Moral/Ethics', icon: '⚖️', color: 'bg-rose-500' }
];

const MOCK_PROJECTS_DATA = {
  'Coding Classes': [
    {
      title: 'Number Analysis: 1-1000',
      difficulty: 'Intermediate',
      time: '2 hours',
      description: 'Master loops and conditional logic by building a tool that scans numbers from 1 to 1000 to identify even, odd, and prime numbers.',
      materials: ['Python IDE (VS Code or PyCharm)', 'Python 3.x installed', 'Basic understanding of loops'],
      steps: [
        'Initialize a loop from 1 to 1000.',
        'Use modulo operator (%) to check for even and odd numbers.',
        'Implement a nested logical check to identify prime numbers.',
        'Format the output to clearly display each category.',
        'Optimization: Stop prime checks at the square root of the number.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Interactive Console: Input & Print',
      difficulty: 'Beginner',
      time: '1 hour',
      description: 'Learn the fundamentals of user interaction by creating a script that asks questions and processes user responses in real-time.',
      materials: ['Python environment', 'Terminal or Command Prompt'],
      steps: [
        'Create variables to store user input.',
        'Use the input() function with descriptive prompts.',
        'Combine strings using f-strings for dynamic output.',
        'Add input validation to handle empty responses.',
        'Print a personalized summary based on the gathered data.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'The Digital Vault: Variable Mastery',
      difficulty: 'Beginner',
      time: '1.5 hours',
      description: 'Step into the role of a cyber-archivist. Learn to create, rename, and manipulate variables to store sensitive project data in your digital vault.',
      materials: ['Python 3.11+', 'Code editor', 'Digital "Vault" mental model'],
      steps: [
        'Declare variables for different data types (String, Integer, Float).',
        'Practice naming conventions (snake_case) for maximum readability.',
        'Use mathematical operators (+, -, *, /) to update variable values.',
        'Implement "Variable Swapping" logic without using a temporary variable.',
        'Create a dynamic profile display that updates when variable contents change.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'String Sorcery: Text Magic',
      difficulty: 'Beginner',
      time: '1 hour',
      description: 'Unlock the power of text manipulation. Learn to declare strings, concatenate them, and use escape characters to format your messages.',
      materials: ['Python 3.x', 'Basic understanding of variables'],
      steps: [
        'Declare strings using single, double, and triple quotes.',
        'Combine multiple strings using concatenation (+) and f-strings.',
        'Use escape characters like \\n (newline) and \\t (tab).',
        'Learn to find the length of a string using the len() function.',
        'Challenge: Create a multi-line "Ascii Art" welcome message for your program.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
    }
  ],
  'ML Classes': [
    {
      title: 'Emoji Sentiment Predictor',
      difficulty: 'Intermediate',
      time: '3 hours',
      description: 'Build a machine learning model that analyzes the tone of a sentence and suggests the perfect emoji to match the mood.',
      materials: ['Python', 'Scikit-learn', 'Dataset of emotional sentences'],
      steps: [
        'Collect and label a dataset of short sentences with emotions.',
        'Preprocess text data using Tokenization.',
        'Train a Naive Bayes classifier on the labeled data.',
        'Test the model with new, unseen sentences.',
        'Create a simple loop to output the predicted emoji.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Plant Disease Classifier',
      difficulty: 'Advanced',
      time: '5 hours',
      description: 'Use the power of Computer Vision to identify common diseases in house plants just from a simple photograph.',
      materials: ['Python', 'TensorFlow or PyTorch', 'PlantVillage dataset'],
      steps: [
        'Download and organize image data into categories.',
        'Apply data augmentation to increase dataset size.',
        'Fine-tune a pre-trained CNN (like MobileNet).',
        'Visualize model performance with a confusion matrix.',
        'Build a simple script to predict disease from a local image file.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1530836361253-efad5cb2fe20?auto=format&fit=crop&q=80&w=800'
    }
  ],
  'Data Cleaning': [
    {
      title: 'Mystery Sales Audit',
      difficulty: 'Beginner',
      time: '1 hour',
      description: 'Become a data detective. Your mission is to find and fix errors in a messy retail spreadsheet to save the company profit.',
      materials: ['CSV Dataset', 'Excel/Google Sheets or Pandas'],
      steps: [
        'Identify duplicate entries in the transaction list.',
        'Standardize currency formats and date styles.',
        'Handle missing values in the "Customer ID" column.',
        'Find and correct outliers (like $99,999 for a soda).',
        'Export a clean version of the data for analysis.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bbdac8a28a80?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Ocean Plastic Tracker',
      difficulty: 'Intermediate',
      time: '2 hours',
      description: 'Process global waste data to identify hotspots. Clean coordinates and normalize plastic weights from different sources.',
      materials: ['messy_ocean_data.csv', 'Python', 'Pandas'],
      steps: [
        'Merge datasets from three different research ships.',
        'Convert units (lb to kg) for consistency.',
        'Remove records with invalid latitude/longitude.',
        'Group data by country to find the top plastic contributors.',
        'Create a summary table of total mass collected per year.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800'
    }
  ],
  'Robotic Classes': [
    {
      title: 'Mars Rover Pathfinding',
      difficulty: 'Intermediate',
      time: '4 hours',
      description: 'Program a virtual rover to navigate a hazardous Martian grid. Avoid craters and reach the base using the "A*" algorithm.',
      materials: ['Grid Simulator', 'Python', 'Logic flowcharts'],
      steps: [
        'Define the grid map with obstacles and goals.',
        'Implement a custom movement function (Forward, Turn).',
        'Calculate the heuristic distance to the goal.',
        'Program a "Wait" state if the path is blocked by a storm.',
        'Visualize the rover\'s path through the obstacles.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Cargo Sort Automation',
      difficulty: 'Advanced',
      time: '6 hours',
      description: 'Design the logic for an industrial arm to sort items on a conveyor belt by weight using sensors and robotic kinematics.',
      materials: ['Robotics Simulator', 'Python', 'Kinematics Math'],
      steps: [
        'Calculate robot arm joint angles for specific targets.',
        'Read simulated sensor data (weight and color).',
        'Program the "Pickup-Move-Drop" sequence.',
        'Implement error handling for unreachable items.',
        'Optimize speed while maintaining robotic precision.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
    }
  ],
  'Moral/Ethics': [
    {
      title: 'Bias in Hiring AI',
      difficulty: 'Beginner',
      time: '1.5 hours',
      description: 'Audit a fictional AI tool designed to hire engineers. Identify hidden biases and suggest ways to make the system fairer.',
      materials: ['Case study documents', 'Ethics framework'],
      steps: [
        'Review the dataset used to train the "Best Engineer" model.',
        'Test the tool with resumes that are identical except for names.',
        'Document patterns of bias in the model\'s recommendations.',
        'Propose 3 changes to the data collection process.',
        'Write a "Fairness Statement" for the AI software.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Social Media Echo Chambers',
      difficulty: 'Intermediate',
      time: '2 hours',
      description: 'Simulate how algorithms create bubbles. Learn how to break them and design "Discovery" features that promote diverse views.',
      materials: ['Algorithm Sandbox', 'Privacy policy templates'],
      steps: [
        'Build a simple "Feed" algorithm based on user likes.',
        'Observe how quickly the feed becomes repetitive.',
        'Inject "Randomized Discovery" into the logic.',
        'Evaluate the impact on user engagement vs. exposure to new ideas.',
        'Draft a design for a "Diversity Score" UI element.'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'
    }
  ]
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/FutureLab';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    console.log(`Using admin user: ${admin.email} (${admin._id})`);

    for (const catData of MOCK_CATEGORIES) {
      let category = await ProjectCategory.findOne({ name: catData.name });
      if (!category) {
        category = new ProjectCategory({
          ...catData,
          user: admin._id
        });
        await category.save();
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category exists: ${category.name}`);
      }

      const projectsToCreate = MOCK_PROJECTS_DATA[catData.name] || [];
      for (const projData of projectsToCreate) {
        const existingProject = await Project.findOne({ title: projData.title, categoryId: category._id });
        if (!existingProject) {
          const project = new Project({
            ...projData,
            categoryId: category._id,
            user: admin._id
          });
          await project.save();
          console.log(`  Added project: ${project.title}`);
        } else {
          console.log(`  Project exists: ${projData.title}`);
        }
      }
    }

    console.log('Expansion complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
