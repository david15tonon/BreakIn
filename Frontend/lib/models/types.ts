// lib/models/types.ts
import { ObjectId } from 'mongodb'

export interface Developer {
  _id?: ObjectId
  user_id?: string // Supabase user ID
  codename: string
  email?: string
  reputation: number
  skills: string[]
  sprint_history: number
  success_rate: number
  growth_delta: string
  status: 'Available' | 'In Sprint' | 'Interviewing'
  last_sprint?: string
  mentor_endorsements: number
  team_rating: number
  avatar_url?: string
  total_earnings: string
  skill_badges: number
  current_streak: number
  level: string
  created_at: Date
  updated_at: Date
}

export interface Sprint {
  _id?: ObjectId
  title: string
  company: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  duration: string
  team_size: number
  technologies: string[]
  description: string
  reward: string
  applications: number
  spots_left: number
  start_date: string
  mentor: string
  rating: number
  status: 'Open' | 'Active' | 'Completed' | 'Cancelled'
  participants?: string[] // Developer IDs
  progress?: number
  days_remaining?: number
  created_at: Date
  updated_at: Date
}

export interface Squad {
  _id?: ObjectId
  name: string
  members: number
  completed_sprints: number
  success_rate: number
  specialties: string[]
  last_project: string
  team_dynamics: {
    collaboration: number
    delivery: number
    code_quality: number
  }
  member_ids: string[] // Developer IDs
  created_at: Date
  updated_at: Date
}

export interface Activity {
  _id?: ObjectId
  user_id: string
  type: 'sprint_completed' | 'skill_earned' | 'mentor_feedback' | 'interview_request'
  title: string
  time: Date
  rating?: number
  reward?: string
  badge?: string
  feedback?: string
  company?: string
  created_at: Date
}

export interface SkillProgress {
  _id?: ObjectId
  user_id: string
  skill: string
  level: number
  badge: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  updated_at: Date
}

export interface Company {
  _id?: ObjectId
  name: string
  industry: string
  size: string
  hiring_preferences: {
    tech_stack: string[]
    seniority_levels: string[]
    cultural_fit: string[]
    location_preference: string
  }
  active_sprints: string[] // Sprint IDs
  hired_developers: string[] // Developer IDs
  success_metrics: {
    hiring_cost_savings: string
    time_to_hire: number
    match_accuracy: number
    retention_rate: number
  }
  created_at: Date
  updated_at: Date
}