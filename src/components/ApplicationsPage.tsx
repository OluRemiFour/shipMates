import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RoleBadge } from './RoleBadge';
import { Role } from '@/types/project';

interface Application {
  id: string;
  project: {
    id: string;
    title: string;
    roles: Role[];
    company: string;
    owner: {
      name: string;
      avatar: string;
    };
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  matchScore: number;
  message?: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    project: {
      id: 'p1',
      title: 'AI-Powered Code Review Assistant',
      roles: ['backend', 'fullstack'],
      company: 'Stripe',
      owner: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      },
    },
    status: 'pending',
    appliedAt: '2 days ago',
    matchScore: 92,
  },
  {
    id: '2',
    project: {
      id: 'p2',
      title: 'Real-Time Collaborative Design Tool',
      roles: ['frontend', 'designer'],
      company: 'DesignFlow',
      owner: {
        name: 'Emily Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      },
    },
    status: 'accepted',
    appliedAt: '1 week ago',
    matchScore: 88,
    message: 'Welcome to the team! Check your messages for next steps.',
  },
  {
    id: '3',
    project: {
      id: 'p3',
      title: 'E-commerce Platform for Local Artisans',
      roles: ['fullstack', 'frontend'],
      company: 'LocalCraft',
      owner: {
        name: 'Jessica Martinez',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
      },
    },
    status: 'rejected',
    appliedAt: '2 weeks ago',
    matchScore: 72,
    message: 'Thank you for your interest. We decided to go with another candidate.',
  },
  {
    id: '4',
    project: {
      id: 'p4',
      title: 'Mobile Fitness Tracking App',
      roles: ['mobile', 'fullstack'],
      company: 'FitTech',
      owner: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      },
    },
    status: 'pending',
    appliedAt: '3 days ago',
    matchScore: 78,
  },
];

export function ApplicationsPage() {
  const [applications] = useState<Application[]>(mockApplications);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const filteredApplications = applications.filter(a => 
    filter === 'all' ? true : a.status === filter
  );

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'accepted':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          My Applications
        </h1>
        <p className="text-gray-400 font-sans">
          Track the status of your project applications
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
              filter === status
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs font-mono opacity-60">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div 
              key={application.id}
              className="glass-panel rounded-xl p-6 gradient-border"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={application.project.owner.avatar} alt={application.project.owner.name} />
                  <AvatarFallback>{application.project.owner.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-display font-bold text-white mb-1">
                        {application.project.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-sans">
                        {application.project.company} • Posted by {application.project.owner.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-mono font-bold ${
                        application.matchScore >= 85 ? 'text-emerald-400' :
                        application.matchScore >= 70 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        {application.matchScore}%
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {application.project.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>

                  {application.message && (
                    <div className={`p-3 rounded-lg mb-3 ${
                      application.status === 'accepted' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20' 
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className="text-sm text-gray-300 font-sans">{application.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-xs text-gray-500 font-sans">
                      Applied {application.appliedAt}
                    </span>
                    <div className="flex gap-2">
                      {application.status === 'accepted' && (
                        <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Team
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 font-sans">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-gray-400 font-sans text-lg mb-2">
              No {filter !== 'all' ? filter : ''} applications
            </p>
            <p className="text-gray-500 font-sans text-sm">
              {filter === 'all' 
                ? 'Start exploring projects to find your next opportunity'
                : `You don't have any ${filter} applications`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
