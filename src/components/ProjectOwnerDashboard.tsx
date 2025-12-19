import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Github
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProjectOwner } from '@/types/user';
import { TechPulseWidget } from './TechPulseWidget';

const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    status: 'active',
    applicants: 12,
    views: 234,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Real-Time Collaborative Design Tool',
    status: 'active',
    applicants: 8,
    views: 156,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Mobile Fitness Tracking App',
    status: 'draft',
    applicants: 0,
    views: 0,
    createdAt: '2024-01-25',
  },
];

const mockApplicants = [
  {
    id: '1',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    role: 'Fullstack Developer',
    matchScore: 92,
    project: 'AI-Powered Code Review Assistant',
    appliedAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    role: 'Frontend Developer',
    matchScore: 88,
    project: 'Real-Time Collaborative Design Tool',
    appliedAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    role: 'Backend Developer',
    matchScore: 85,
    project: 'AI-Powered Code Review Assistant',
    appliedAt: '1 day ago',
  },
];

export function ProjectOwnerDashboard() {
  const { user } = useAuth();
  const owner = user as ProjectOwner;

  const stats = [
    { 
      label: 'Active Projects', 
      value: owner?.projectsPosted || 3, 
      icon: FolderKanban,
      color: 'cyan',
      change: '+2 this month'
    },
    { 
      label: 'Total Applicants', 
      value: 24, 
      icon: Users,
      color: 'purple',
      change: '+8 this week'
    },
    { 
      label: 'Successful Matches', 
      value: owner?.successfulMatches || 12, 
      icon: CheckCircle2,
      color: 'emerald',
      change: '+3 this month'
    },
    { 
      label: 'Profile Views', 
      value: 456, 
      icon: Eye,
      color: 'amber',
      change: '+12% vs last week'
    },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Welcome back, {owner?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 font-sans">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-xl p-6 gradient-border">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-emerald-400 font-mono">{stat.change}</span>
            </div>
            <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400 font-sans">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Your Projects</h2>
            <Link to="/dashboard/projects">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 font-sans">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-sans font-medium text-white mb-1">{project.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.applicants} applicants
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {project.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.createdAt}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono ${
                  project.status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>

          <Link to="/dashboard/projects/new" className="block mt-4">
            <Button variant="outline" className="w-full border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 font-sans">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </Link>
        </div>

        {/* Recent Applicants */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Recent Applicants</h2>
            <Link to="/dashboard/applicants">
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 font-sans">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={applicant.avatar} alt={applicant.name} />
                  <AvatarFallback>{applicant.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white font-sans truncate">{applicant.name}</p>
                    <span className="text-xs font-mono text-emerald-400">{applicant.matchScore}%</span>
                  </div>
                  <p className="text-xs text-gray-400 font-sans">{applicant.role}</p>
                  <p className="text-xs text-gray-500 font-sans mt-1 truncate">{applicant.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
