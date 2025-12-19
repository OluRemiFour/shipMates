import { Link } from 'react-router-dom';
import { 
  Search, 
  FolderKanban, 
  TrendingUp, 
  Star,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { MatchScoreRing } from './MatchScoreRing';
import { RoleBadge } from './RoleBadge';
import { Collaborator } from '@/types/user';

const mockMatches = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    matchScore: 92,
    roles: ['backend', 'fullstack'] as const,
    company: 'Stripe',
    timeline: '3-6 months',
    postedBy: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
  },
  {
    id: '2',
    title: 'Open Source Developer Analytics',
    matchScore: 95,
    roles: ['fullstack', 'backend'] as const,
    company: 'GitHub',
    timeline: '3-6 months',
    postedBy: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    },
  },
  {
    id: '3',
    title: 'Decentralized Social Platform',
    matchScore: 88,
    roles: ['frontend', 'fullstack'] as const,
    company: 'DeSocial',
    timeline: '6+ months',
    postedBy: {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
  },
];

const mockApplications = [
  {
    id: '1',
    project: 'Real-Time Collaborative Design Tool',
    status: 'pending',
    appliedAt: '2 days ago',
  },
  {
    id: '2',
    project: 'Mobile Fitness Tracking App',
    status: 'accepted',
    appliedAt: '1 week ago',
  },
  {
    id: '3',
    project: 'E-commerce Platform',
    status: 'rejected',
    appliedAt: '2 weeks ago',
  },
];

export function CollaboratorDashboard() {
  const { user } = useAuth();
  const collaborator = user as Collaborator;

  const stats = [
    { 
      label: 'Match Score', 
      value: '92%', 
      icon: Star,
      color: 'cyan',
      subtext: 'Based on your profile'
    },
    { 
      label: 'Projects Joined', 
      value: collaborator?.projectsJoined || 8, 
      icon: FolderKanban,
      color: 'purple',
      subtext: '+2 this month'
    },
    { 
      label: 'Completed', 
      value: collaborator?.completedProjects || 6, 
      icon: CheckCircle2,
      color: 'emerald',
      subtext: '75% completion rate'
    },
    { 
      label: 'Matches Received', 
      value: collaborator?.matchesReceived || 24, 
      icon: TrendingUp,
      color: 'amber',
      subtext: '+5 this week'
    },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Welcome back, {collaborator?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 font-sans">
          You have <span className="text-cyan-400 font-semibold">3 new matches</span> waiting for you.
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
            </div>
            <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400 font-sans">{stat.label}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Top Matches For You</h2>
            <Link to="/dashboard/discover">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 font-sans">
                Discover More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockMatches.map((match) => (
              <div 
                key={match.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
              >
                <MatchScoreRing score={match.matchScore} size={60} strokeWidth={4} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {match.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {match.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                    <span>{match.company}</span>
                    <span>•</span>
                    <span>{match.timeline}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </Button>
              </div>
            ))}
          </div>

          <Link to="/dashboard/discover" className="block mt-4">
            <Button variant="outline" className="w-full border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 font-sans">
              <Search className="w-4 h-4 mr-2" />
              Browse All Projects
            </Button>
          </Link>
        </div>

        {/* Applications */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Your Applications</h2>
            <Link to="/dashboard/applications">
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 font-sans">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {mockApplications.map((app) => (
              <div key={app.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-white font-sans">{app.project}</p>
                  <span className={`flex items-center gap-1 text-xs font-mono ${
                    app.status === 'accepted' 
                      ? 'text-emerald-400'
                      : app.status === 'rejected'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}>
                    {app.status === 'accepted' && <CheckCircle2 className="w-3 h-3" />}
                    {app.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                    {app.status === 'pending' && <Clock className="w-3 h-3" />}
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-sans">Applied {app.appliedAt}</p>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-sans font-semibold text-gray-300 mb-3">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {collaborator?.skills?.slice(0, 4).map((skill) => (
                <span 
                  key={skill.name}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-mono"
                >
                  {skill.icon} {skill.name}
                </span>
              ))}
              {(collaborator?.skills?.length || 0) > 4 && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
                  +{(collaborator?.skills?.length || 0) - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
