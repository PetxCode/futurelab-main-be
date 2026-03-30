const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nextteachnow:nextteachnow@cluster0.ozfyjn7.mongodb.net/FutureLabDB?appName=Cluster0";

const trainers = [
  {
    fullName: "Peter Oti",
    email: "peter@futurelab.com",
    password: "Password123",
    isInstructor: true,
    instructorProfile: {
      bio: "Full-stack engineer and educator. Focused on empowering students to build real-world web applications and mobile apps.",
      detailedBio: "Former lead engineer at TechNexus with a passion for gamifying education. Over 5 years of experience teaching complex algorithmic thinking to children aged 8-16. Peter specializes in turning abstract concepts into tangible, fun projects.",
      specialties: ["Python", "Game", "Robotic"],
      skillset: ["Python", "C++", "JavaScript", "React Native", "ROS2"],
      monthlyRate: 20000,
      rating: 4.8,
      yearsExperience: 5,
      studentsTrainedCount: 450,
      trainingHighlights: ["Python Game Development", "Logic for Kids", "Robot Pathfinding", "Mobile App Architecture"],
      otherCriticalInfo: ["DBS Checked", "Official Python Instructor Certified", "Microsoft Certified Educator"]
    }
  },
  {
    fullName: "Dr. Sarah Chen",
    email: "sarah@futurelab.com",
    password: "Password123",
    isInstructor: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    instructorProfile: {
      bio: "PhD in Computer Science with 10+ years experience teaching kids at MIT Media Lab. Specializes in making complex algorithms feel like play.",
      detailedBio: "PhD in Computer Science from MIT with a focus on Educational Robotics. Sarah has spent over a decade researching how children learn through code. She believes in hands-on learning through exploration and problem-solving, making her sessions both academic and exhilarating.",
      specialties: ["Python", "AI/ML", "Advanced Logic"],
      skillset: ["AI/ML", "Robotics", "Data Science", "Python", "Lisp"],
      monthlyRate: 15000,
      rating: 4.9,
      yearsExperience: 12,
      studentsTrainedCount: 1200,
      trainingHighlights: ["Advanced AI/ML Concepts", "Robotics System Design", "Scientific Computing", "Algorithmic Thinking"],
      otherCriticalInfo: ["PhD in Computer Science (MIT)", "Microsoft AI Specialist Certified", "Published Author in EdTech"]
    }
  },
  {
    fullName: "Marcus \"Pixel\" Thorne",
    email: "marcus@futurelab.com",
    password: "Password123",
    isInstructor: true,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    instructorProfile: {
      bio: "Former senior developer at Epic Games. Passionate about teaching the next generation how to build worlds, not just play in them.",
      detailedBio: "Senior game developer with 8+ years at Epic Games. Marcus has worked on blockbuster titles and now brings that industry rigor to the classroom. He is dedicated to inspiring the next generation of game architects and software designers by showing them the 'magic' behind the code.",
      specialties: ["Game Design", "C#", "Robotics"],
      skillset: ["C#", "Unity", "Unreal Engine", "C++", "Shaders"],
      monthlyRate: 12000,
      rating: 4.8,
      yearsExperience: 8,
      studentsTrainedCount: 850,
      trainingHighlights: ["Unreal Engine Mastery", "JavaScript Game Performance", "Creative Storytelling with Code", "3D Logic Design"],
      otherCriticalInfo: ["Senior Level Industry Veteran", "Google Cloud Associate Certified", "Unity Certified Professional"]
    }
  },
  {
    fullName: "Aisha Bello",
    email: "aisha@futurelab.com",
    password: "Password123",
    isInstructor: true,
    avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    instructorProfile: {
      bio: "Expert in Web Development and UI/UX design. Aisha focuses on the creative side of coding, helping students build beautiful apps.",
      detailedBio: "Aisha is a renowned UI/UX designer and Frontend Engineer. She specializes in the 'Creative Coding' movement, where design meets logic. Her students don't just build functional apps; they build user-centric experiences that look stunning and perform flawlessly.",
      specialties: ["Web Dev", "Mobile Apps", "UX Design"],
      skillset: ["React", "CSS/Tailwind", "Figma", "Node.js", "Dart"],
      monthlyRate: 10000,
      rating: 5.0,
      yearsExperience: 6,
      studentsTrainedCount: 600,
      trainingHighlights: ["Modern React Frameworks", "UX Discovery for Kids", "Cross-Platform Mobile Apps", "Visual Logic Design"],
      otherCriticalInfo: ["DBS Checked", "Google Certified UX Designer", "Awwwards Winner Educator"]
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Delete existing instructors and anyone with these emails to avoid dupes
    const emails = trainers.map(t => t.email);
    await User.deleteMany({ $or: [ { isInstructor: true }, { email: { $in: emails } } ] });
    console.log('Cleared existing trainers and overlapping emails');

    for (const t of trainers) {
      const hashedPassword = await bcrypt.hash(t.password, 10);
      const user = new User({
        ...t,
        password: hashedPassword
      });
      await user.save();
      console.log(`Seeded Trainer: ${t.fullName}`);
    }

    console.log('Successfully seeded advanced trainers');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
