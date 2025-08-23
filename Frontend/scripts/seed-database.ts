// scripts/seed-database.ts
// Run this script to populate your MongoDB with sample data
// Usage: npx ts-node scripts/seed-database.ts

import { MongoClient } from 'mongodb'
import { Developer, Sprint, Activity, SkillProgress, Squad } from '../lib/models/types'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set')
  console.log('Please check your .env.local file and make sure MONGODB_URI is defined')
  process.exit(1)
}

console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'))

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI as string)
  
  try {
    console.log('Attempting to connect to MongoDB...')
    await client.connect()
    console.log('Connected to MongoDB successfully!')
    
    const db = client.db('breakin')
    
    // Clear existing collections
    await db.collection('developers').deleteMany({})
    await db.collection('sprints').deleteMany({})
    await db.collection('activities').deleteMany({})
    await db.collection('skill_progress').deleteMany({})
    await db.collection('squads').deleteMany({})
    
    console.log('Cleared existing data')
    
    // Seed developers
    const developers: Omit<Developer, '_id'>[] = [
      {
        user_id: 'demo-user-1',
        codename: 'ReactNinja_2024',
        email: 'demo@example.com',
        reputation: 4.9,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        sprint_history: 12,
        success_rate: 94,
        growth_delta: '+23%',
        status: 'Available',
        last_sprint: 'E-commerce Platform',
        mentor_endorsements: 3,
        team_rating: 4.8,
        avatar_url: '/placeholder-user.jpg',
        total_earnings: '$18,500',
        skill_badges: 8,
        current_streak: 6,
        level: 'Intermediate',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-2',
        codename: 'FullStackPro',
        email: 'fullstack@example.com',
        reputation: 4.7,
        skills: ['Python', 'Django', 'React', 'PostgreSQL'],
        sprint_history: 8,
        success_rate: 91,
        growth_delta: '+18%',
        status: 'In Sprint',
        last_sprint: 'FinTech Dashboard',
        mentor_endorsements: 2,
        team_rating: 4.6,
        avatar_url: '/placeholder-user.jpg',
        total_earnings: '$12,300',
        skill_badges: 6,
        current_streak: 4,
        level: 'Intermediate',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-3',
        codename: 'CloudArchitect',
        email: 'cloud@example.com',
        reputation: 4.8,
        skills: ['AWS', 'Kubernetes', 'Go', 'Terraform'],
        sprint_history: 15,
        success_rate: 96,
        growth_delta: '+31%',
        status: 'Available',
        last_sprint: 'Microservices Migration',
        mentor_endorsements: 4,
        team_rating: 4.9,
        avatar_url: '/placeholder-user.jpg',
        total_earnings: '$25,700',
        skill_badges: 12,
        current_streak: 8,
        level: 'Senior',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    await db.collection('developers').insertMany(developers)
    console.log('Seeded developers')
    
    // Seed sprints
    const sprints: Omit<Sprint, '_id'>[] = [
      {
        title: 'E-commerce Platform',
        company: 'TechCorp',
        difficulty: 'Intermediate',
        duration: '5 days',
        team_size: 4,
        technologies: ['React', 'Node.js', 'PostgreSQL'],
        description: 'Build a complete e-commerce platform with payment integration',
        reward: '$2,500',
        applications: 24,
        spots_left: 2,
        start_date: 'March 15',
        mentor: 'Sarah Chen',
        rating: 4.8,
        status: 'Open',
        participants: [],
        progress: 0,
        days_remaining: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Mobile Banking App',
        company: 'FinanceFlow',
        difficulty: 'Advanced',
        duration: '7 days',
        team_size: 3,
        technologies: ['React Native', 'Python', 'AWS'],
        description: 'Develop a secure mobile banking application with biometric authentication',
        reward: '$3,500',
        applications: 18,
        spots_left: 1,
        start_date: 'March 20',
        mentor: 'Alex Rodriguez',
        rating: 4.9,
        status: 'Open',
        participants: [],
        progress: 0,
        days_remaining: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'AI Content Generator',
        company: 'ContentAI',
        difficulty: 'Expert',
        duration: '10 days',
        team_size: 5,
        technologies: ['Python', 'TensorFlow', 'React', 'Docker'],
        description: 'Create an AI-powered content generation platform with ML models',
        reward: '$5,000',
        applications: 32,
        spots_left: 3,
        start_date: 'March 25',
        mentor: 'Dr. Emily Watson',
        rating: 4.7,
        status: 'Open',
        participants: [],
        progress: 0,
        days_remaining: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'SaaS Dashboard',
        company: 'DashCorp',
        difficulty: 'Intermediate',
        duration: '5 days',
        team_size: 4,
        technologies: ['React', 'TypeScript', 'Node.js'],
        description: 'Building a comprehensive analytics dashboard',
        reward: '$2,500',
        applications: 15,
        spots_left: 0,
        start_date: 'March 10',
        mentor: 'John Smith',
        rating: 4.7,
        status: 'Active',
        participants: ['demo-user-1'],
        progress: 78,
        days_remaining: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    await db.collection('sprints').insertMany(sprints)
    console.log('Seeded sprints')
    
    // Seed activities
    const activities: Omit<Activity, '_id'>[] = [
      {
        user_id: 'demo-user-1',
        type: 'sprint_completed',
        title: "Completed 'SaaS Dashboard' sprint",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        rating: 4.9,
        reward: '$2,000',
        created_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        type: 'skill_earned',
        title: "Earned 'React Expert' badge",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        badge: 'React Expert',
        created_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        type: 'mentor_feedback',
        title: "Received mentor endorsement from John Smith",
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        feedback: 'Excellent problem-solving skills and team collaboration',
        created_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        type: 'interview_request',
        title: "Interview request from TechCorp",
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        company: 'TechCorp',
        created_at: new Date()
      }
    ]
    
    await db.collection('activities').insertMany(activities)
    console.log('Seeded activities')
    
    // Seed skill progress
    const skillProgress: Omit<SkillProgress, '_id'>[] = [
      {
        user_id: 'demo-user-1',
        skill: 'React',
        level: 85,
        badge: 'Expert',
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        skill: 'Node.js',
        level: 78,
        badge: 'Advanced',
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        skill: 'Python',
        level: 72,
        badge: 'Intermediate',
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        skill: 'AWS',
        level: 65,
        badge: 'Intermediate',
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        skill: 'TypeScript',
        level: 88,
        badge: 'Expert',
        updated_at: new Date()
      },
      {
        user_id: 'demo-user-1',
        skill: 'Docker',
        level: 55,
        badge: 'Beginner',
        updated_at: new Date()
      }
    ]
    
    await db.collection('skill_progress').insertMany(skillProgress)
    console.log('Seeded skill progress')
    
    // Seed squads
    const squads: Omit<Squad, '_id'>[] = [
      {
        name: 'The React Rangers',
        members: 4,
        completed_sprints: 6,
        success_rate: 95,
        specialties: ['Frontend', 'React', 'TypeScript', 'UI/UX'],
        last_project: 'SaaS Dashboard',
        team_dynamics: {
          collaboration: 4.8,
          delivery: 4.9,
          code_quality: 4.7
        },
        member_ids: ['demo-user-1', 'demo-user-2'],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Backend Builders',
        members: 3,
        completed_sprints: 8,
        success_rate: 92,
        specialties: ['Node.js', 'Python', 'Databases', 'APIs'],
        last_project: 'Payment System',
        team_dynamics: {
          collaboration: 4.6,
          delivery: 4.8,
          code_quality: 4.9
        },
        member_ids: ['demo-user-3'],
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    await db.collection('squads').insertMany(squads)
    console.log('Seeded squads')
    
    // Create indexes for better performance
    await db.collection('developers').createIndex({ user_id: 1 })
    await db.collection('activities').createIndex({ user_id: 1, time: -1 })
    await db.collection('skill_progress').createIndex({ user_id: 1, skill: 1 })
    await db.collection('sprints').createIndex({ status: 1, spots_left: 1 })
    
    console.log('Created indexes')
    console.log('Database seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

if (require.main === module) {
  seedDatabase()
}