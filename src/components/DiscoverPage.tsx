import { useState, useMemo } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ProjectCard } from './ProjectCard';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { AIAssistant } from './AIAssistant';
import { useToast } from '@/components/ui/use-toast';
import { mockProjects } from '@/data/mockProjects';
import { Project, Role, ExperienceLevel, Timeline } from '@/types/project';

export function DiscoverPage() {
  const [filters, setFilters] = useState<FilterState>({
    roles: [],
    experienceLevels: [],
    timelines: [],
  });
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const { toast } = useToast();

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (filters.roles.length > 0) {
        const hasMatchingRole = project.roles.some(role => filters.roles.includes(role));
        if (!hasMatchingRole) return false;
      }

      if (filters.experienceLevels.length > 0) {
        if (!filters.experienceLevels.includes(project.experienceLevel)) return false;
      }

      if (filters.timelines.length > 0) {
        if (!filters.timelines.includes(project.timeline)) return false;
      }

      return true;
    });
  }, [projects, filters]);

  const projectCounts = useMemo(() => {
    const byRole: Record<Role, number> = {
      frontend: 0,
      backend: 0,
      fullstack: 0,
      designer: 0,
      mobile: 0,
      product: 0,
    };

    const byExperience: Record<ExperienceLevel, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0,
    };

    const byTimeline: Record<Timeline, number> = {
      '1-3 months': 0,
      '3-6 months': 0,
      '6+ months': 0,
      'ongoing': 0,
    };

    projects.forEach(project => {
      project.roles.forEach(role => {
        byRole[role]++;
      });
      byExperience[project.experienceLevel]++;
      byTimeline[project.timeline]++;
    });

    return {
      total: filteredProjects.length,
      byRole,
      byExperience,
      byTimeline,
    };
  }, [projects, filteredProjects]);

  const handleExpressInterest = (projectId: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, isInterested: true } : p))
    );

    toast({
      title: "Interest Expressed! ✨",
      description: "The project owner will be notified. Check your inbox for updates.",
      duration: 3000,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            projectCounts={projectCounts}
          />
        </aside>

        {/* Project Feed */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Discover Projects
            </h1>
            <p className="text-gray-400 font-sans">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} match your profile
            </p>
          </div>

          <div className="space-y-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onExpressInterest={handleExpressInterest}
                  style={{
                    animation: `stagger-fade-in 0.5s ease-out ${index * 0.1}s both`,
                  }}
                />
              ))
            ) : (
              <div className="glass-panel rounded-xl p-12 text-center">
                <p className="text-gray-400 font-sans text-lg mb-2">
                  No projects match your current filters
                </p>
                <p className="text-gray-500 font-sans text-sm">
                  Try adjusting your filters to see more opportunities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </DashboardLayout>
  );
}
