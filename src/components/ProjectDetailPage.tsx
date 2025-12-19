import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MatchScoreRing } from './MatchScoreRing';
import { RoleBadge } from './RoleBadge';
import { TechStackConstellation } from './TechStackConstellation';
import { useToast } from '@/components/ui/use-toast';
import { mockProjects } from '@/data/mockProjects';
import { Project } from '@/types/project';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const found = mockProjects.find(p => p.id === projectId);
      setProject(found || null);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApplying(false);
    setShowApplyDialog(false);
    setProject(prev => prev ? { ...prev, isInterested: true } : null);
    toast({
      title: "Application Submitted! ✨",
      description: "The project owner will review your application and get back to you soon.",
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-sans">Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Project Not Found</h2>
            <p className="text-gray-400 font-sans mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard/discover')} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-panel rounded-xl p-8 gradient-border">
            <div className="flex items-start gap-6">
              <MatchScoreRing score={project.matchScore} size={100} />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-3">
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      {project.roles.map(role => (
                        <RoleBadge key={role} role={role} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? 'text-amber-400' : 'text-gray-400 hover:text-white'}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-300 font-sans leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{project.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{project.currentMembers}/{project.teamSize} members</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    {project.experienceLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-display font-bold text-white mb-4">Tech Stack</h2>
            <TechStackConstellation techStack={project.techStack} />
          </div>

          {/* Match Reasoning */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-display font-bold text-white">Why You're a Match</h2>
            </div>
            <div className="space-y-3">
              {project.matchReasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  style={{
                    animation: `scale-in 0.3s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {reason.type === 'strength' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`font-sans ${reason.type === 'strength' ? 'text-gray-200' : 'text-gray-400'}`}>
                    {reason.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements & Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-display font-bold text-white mb-4">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  {project.experienceLevel} level experience required
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Available for {project.timeline} commitment
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Proficiency in listed tech stack
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Strong communication skills
                </li>
              </ul>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-display font-bold text-white mb-4">What You'll Get</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  Real-world project experience
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  Portfolio-worthy work
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  Network with industry professionals
                </li>
                <li className="flex items-start gap-2 text-gray-300 font-sans text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  Potential equity/compensation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <div className="glass-panel rounded-xl p-6 gradient-border sticky top-6">
            {project.isInterested ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">Application Sent!</h3>
                <p className="text-gray-400 font-sans text-sm mb-4">
                  Your application is being reviewed. You'll be notified when there's an update.
                </p>
                <Link to="/dashboard/messages">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-display font-bold text-white mb-2">Interested in this project?</h3>
                <p className="text-gray-400 font-sans text-sm mb-4">
                  Express your interest and the project owner will review your profile.
                </p>
                <Button
                  onClick={() => setShowApplyDialog(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Express Interest
                </Button>
              </>
            )}
          </div>

          {/* Posted By */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-display font-bold text-white mb-4">Posted By</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={project.postedBy.avatar} alt={project.postedBy.name} />
                <AvatarFallback>{project.postedBy.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-display font-bold text-white">{project.postedBy.name}</p>
                <p className="text-sm text-gray-400 font-sans">{project.postedBy.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span className="font-sans">5 projects posted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="font-sans">12 successful matches</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="font-sans">Member since Jan 2023</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/5">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>

          {/* Similar Projects */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-display font-bold text-white mb-4">Similar Projects</h3>
            <div className="space-y-4">
              {mockProjects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map(p => (
                  <Link
                    key={p.id}
                    to={`/dashboard/project/${p.id}`}
                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MatchScoreRing score={p.matchScore} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-white text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.timeline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold text-white">
              Express Interest
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-sans">
              Send a message to the project owner explaining why you'd be a great fit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Tell them about your relevant experience, what excites you about this project, and your availability..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
            />
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Your profile and match score will be shared automatically.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowApplyDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplying || !applicationMessage.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Send Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
