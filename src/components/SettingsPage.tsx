import { useState } from 'react';
import { Camera, Save, Github, Linkedin, Globe } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Collaborator, ProjectOwner } from '@/types/user';
import { RoleBadge } from './RoleBadge';
import { Role } from '@/types/project';

const roleOptions: Role[] = ['frontend', 'backend', 'fullstack', 'designer', 'mobile', 'product'];

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  
  // Collaborator-specific
  const collaborator = user?.userType === 'collaborator' ? user as Collaborator : null;
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(collaborator?.roles || []);
  const [availability, setAvailability] = useState(collaborator?.availability || 'flexible');

  // Project Owner-specific
  const projectOwner = user?.userType === 'project_owner' ? user as ProjectOwner : null;
  const [company, setCompany] = useState(projectOwner?.company || '');

  const toggleRole = (role: Role) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser({
      name,
      bio,
      location,
      github,
      linkedin,
      portfolio,
      ...(collaborator && { roles: selectedRoles, availability }),
      ...(projectOwner && { company }),
    });

    toast({
      title: 'Settings Saved! ✨',
      description: 'Your profile has been updated successfully.',
    });
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-400 font-sans">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="glass-panel rounded-xl p-6 gradient-border mb-6">
          <h2 className="text-lg font-display font-bold text-white mb-6">Profile</h2>
          
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-400 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-sans mb-1">Profile Photo</p>
              <p className="text-xs text-gray-500 font-sans">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300 font-sans">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 bg-white/5 border-white/10 text-white font-sans"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300 font-sans">Email</Label>
              <Input
                id="email"
                value={user?.email}
                disabled
                className="mt-1.5 bg-white/5 border-white/10 text-gray-400 font-sans"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-300 font-sans">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
              />
            </div>
            {projectOwner && (
              <div>
                <Label htmlFor="company" className="text-gray-300 font-sans">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                  className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="bio" className="text-gray-300 font-sans">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans resize-none"
            />
          </div>
        </div>

        {/* Collaborator-specific: Roles & Availability */}
        {collaborator && (
          <div className="glass-panel rounded-xl p-6 gradient-border mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-6">Skills & Availability</h2>
            
            <div className="mb-6">
              <Label className="text-gray-300 font-sans mb-3 block">Your Roles</Label>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`transition-all duration-200 ${
                      selectedRoles.includes(role) ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    <RoleBadge role={role} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300 font-sans mb-3 block">Availability</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['full-time', 'part-time', 'weekends', 'flexible'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setAvailability(option)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-sm font-sans ${
                      availability === option
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="glass-panel rounded-xl p-6 gradient-border mb-6">
          <h2 className="text-lg font-display font-bold text-white mb-6">Social Links</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="github" className="text-gray-300 font-sans flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="username"
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-gray-300 font-sans flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="username"
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
              />
            </div>
            <div>
              <Label htmlFor="portfolio" className="text-gray-300 font-sans flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Portfolio
              </Label>
              <Input
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yoursite.com"
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-sans font-semibold px-8"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
