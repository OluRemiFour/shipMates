import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Users, 
  Eye, 
  Clock, 
  Edit, 
  Trash2,
  Archive
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RoleBadge } from './RoleBadge';
import { Role } from '@/types/project';

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  roles: Role[];
  applicants: number;
  views: number;
  createdAt: Date; // Changed from string to Date object
  techStack: string[];
}

const mockProjects: ProjectItem[] = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    description: 'Building an intelligent code review tool that uses GPT-4 to provide contextual feedback on pull requests.',
    status: 'active',
    roles: ['backend', 'fullstack'],
    applicants: 12,
    views: 234,
    createdAt: new Date('2024-01-15T00:00:00Z'), // Stored as Date object
    techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
  },
  {
    id: '2',
    title: 'Real-Time Collaborative Design Tool',
    description: 'Building a Figma competitor with focus on developer handoff and real-time collaboration.',
    status: 'active',
    roles: ['frontend', 'designer'],
    applicants: 8,
    views: 156,
    createdAt: new Date('2024-01-20T00:00:00Z'), // Stored as Date object
    techStack: ['React', 'WebGL', 'Node.js', 'Redis'],
  },
  {
    id: '3',
    title: 'Mobile Fitness Tracking App',
    description: 'Creating a comprehensive fitness app with AI-powered workout recommendations.',
    status: 'draft',
    roles: ['mobile', 'fullstack'],
    applicants: 0,
    views: 0,
    createdAt: new Date('2024-01-25T00:00:00Z'), // Stored as Date object
    techStack: ['React Native', 'Firebase', 'GraphQL'],
  },
];

export function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  const filteredProjects = projects.filter(p => 
    filter === 'all' ? true : p.status === filter
  );

  const statusCounts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    draft: projects.filter(p => p.status === 'draft').length,
    archived: projects.filter(p => p.status === 'archived').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            My Projects
          </h1>
          <p className="text-gray-400 font-sans">
            Manage your projects and track applicants
          </p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'draft', 'archived'] as const).map((status) => (
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

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="glass-panel rounded-xl p-6 gradient-border hover:translate-y-[-2px] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-bold text-white">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      project.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : project.status === 'draft'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 font-sans text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a1f2e] border-white/10">
                    <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Roles */}
              <div className="flex items-center gap-2 mb-4">
                {project.roles.map((role) => (
                  <RoleBadge key={role} role={role} />
                ))}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                  <Users className="w-4 h-4" />
                  <span>{project.applicants} applicants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                  <Eye className="w-4 h-4" />
                  <span>{project.views} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                  <Clock className="w-4 h-4" />
                  {/* Display formatted date from Date object */}
                  <span>
                    {project.createdAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="ml-auto">
                  <Link to={`/dashboard/projects/${project.id}/applicants`}>
                    <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:text-white hover:border-white/40 font-sans">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-gray-400 font-sans text-lg mb-2">
              No {filter !== 'all' ? filter : ''} projects found
            </p>
            <p className="text-gray-500 font-sans text-sm mb-6">
              Create your first project to start finding collaborators
            </p>
            <Link to="/dashboard/projects/new">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}