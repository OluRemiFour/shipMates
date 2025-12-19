import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Clock,
  User,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Star,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MatchScoreRing } from './MatchScoreRing';
import { RoleBadge } from './RoleBadge';
import { useToast } from '@/components/ui/use-toast';
import { mockApplications } from '@/data/mockApplications';
import { Application } from '@/types/project';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ApplicationReviewPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(
    mockApplications.find(a => a.id === applicationId) || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplication(prev => prev ? { ...prev, status: 'accepted', reviewedAt: new Date().toISOString() } : null);
    setIsProcessing(false);
    toast({
      title: "Application Accepted! 🎉",
      description: "The applicant has been notified and added to your project team.",
      duration: 5000,
    });
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplication(prev => prev ? { ...prev, status: 'rejected', reviewedAt: new Date().toISOString() } : null);
    setIsProcessing(false);
    setShowRejectDialog(false);
    toast({
      title: "Application Declined",
      description: "The applicant has been notified of your decision.",
      duration: 5000,
    });
  };

  if (!application) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Application Not Found</h2>
            <p className="text-gray-400 font-sans mb-6">This application doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard/applicants')} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applicants
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-mono">
            Pending Review
          </span>
        );
      case 'accepted':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-mono">
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-mono">
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to applicants
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-panel rounded-xl p-8 gradient-border">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={application.applicantAvatar} alt={application.applicantName} />
                <AvatarFallback className="text-2xl">{application.applicantName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                      {application.applicantName}
                    </h1>
                    <div className="flex items-center gap-3">
                      <RoleBadge role={application.applicantRole} />
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                  <MatchScoreRing score={application.matchScore} size={80} />
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Applied {formatDate(application.appliedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>For: {application.projectTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Message */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-display font-bold text-white mb-4">Application Message</h2>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-gray-300 font-sans leading-relaxed whitespace-pre-wrap">
                {application.message || "No message provided."}
              </p>
            </div>
          </div>

          {/* Match Reasoning */}
          {application.matchReasons && (
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-display font-bold text-white">AI Match Analysis</h2>
              </div>
              <div className="space-y-3">
                {application.matchReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
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
          )}

          {/* Applicant Profile */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-display font-bold text-white mb-4">Profile Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 font-sans mb-2">Experience</h3>
                <p className="text-white font-sans">5+ years in software development</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-sans mb-2">Availability</h3>
                <p className="text-white font-sans">Part-time (20 hrs/week)</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-sans mb-2">Location</h3>
                <p className="text-white font-sans">San Francisco, CA (PST)</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-sans mb-2">Projects Completed</h3>
                <p className="text-white font-sans">12 projects on BuildMate</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm text-gray-400 font-sans mb-3">Links</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                  <Globe className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="glass-panel rounded-xl p-6 gradient-border sticky top-6">
            {application.status === 'pending' ? (
              <>
                <h3 className="text-lg font-display font-bold text-white mb-4">Review Application</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 font-sans font-semibold"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Accept Application
                  </Button>
                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline Application
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  application.status === 'accepted' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {application.status === 'accepted' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  Application {application.status === 'accepted' ? 'Accepted' : 'Declined'}
                </h3>
                <p className="text-gray-400 font-sans text-sm mb-4">
                  {application.status === 'accepted'
                    ? 'This applicant has been added to your project team.'
                    : 'This applicant has been notified of your decision.'}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            )}
          </div>

          {/* Other Applicants */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-display font-bold text-white mb-4">Other Applicants</h3>
            <div className="space-y-3">
              {mockApplications
                .filter(a => a.id !== application.id && a.projectId === application.projectId)
                .slice(0, 3)
                .map(a => (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/dashboard/applicants/${a.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={a.applicantAvatar} alt={a.applicantName} />
                      <AvatarFallback>{a.applicantName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-white text-sm truncate">{a.applicantName}</p>
                      <p className="text-xs text-gray-400 font-mono">{a.matchScore}% match</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      a.status === 'pending' ? 'bg-amber-400' :
                      a.status === 'accepted' ? 'bg-emerald-400' : 'bg-red-400'
                    }`} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold text-white">
              Decline Application
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-sans">
              Optionally provide feedback to help the applicant improve.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Share constructive feedback (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowRejectDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
