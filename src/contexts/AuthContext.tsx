import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ProjectOwner, Collaborator, UserType } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: UserType) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockProjectOwner: ProjectOwner = {
  id: 'owner-1',
  email: 'owner@buildmate.com',
  name: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  userType: 'project_owner',
  bio: 'Tech Lead passionate about building innovative products. Looking for talented collaborators to bring ideas to life.',
  location: 'San Francisco, CA',
  github: 'sarahchen',
  linkedin: 'sarahchen',
  company: 'Stripe',
  projectsPosted: 5,
  successfulMatches: 12,
  createdAt: new Date('2024-01-15'),
};

const mockCollaborator: Collaborator = {
  id: 'collab-1',
  email: 'dev@buildmate.com',
  name: 'Alex Thompson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  userType: 'collaborator',
  bio: 'Full-stack developer with 5+ years of experience. Love working on challenging projects with great teams.',
  location: 'New York, NY',
  github: 'alexthompson',
  linkedin: 'alexthompson',
  portfolio: 'https://alexthompson.dev',
  roles: ['fullstack', 'backend'],
  skills: [
    { name: 'TypeScript', icon: '📘', category: 'frontend' },
    { name: 'React', icon: '⚛️', category: 'frontend' },
    { name: 'Node.js', icon: '🟢', category: 'backend' },
    { name: 'PostgreSQL', icon: '🐘', category: 'database' },
  ],
  experienceLevel: 'advanced',
  availability: 'part-time',
  preferredTimeline: ['3-6 months', '6+ months'],
  projectsJoined: 8,
  completedProjects: 6,
  matchesReceived: 24,
  createdAt: new Date('2024-02-01'),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('buildmate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - check email to determine user type
    let loggedInUser: User;
    if (email.includes('owner')) {
      loggedInUser = mockProjectOwner;
    } else {
      loggedInUser = mockCollaborator;
    }
    
    setUser(loggedInUser);
    localStorage.setItem('buildmate_user', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string, userType: UserType) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = userType === 'project_owner' 
      ? {
          ...mockProjectOwner,
          id: `owner-${Date.now()}`,
          email,
          name,
          projectsPosted: 0,
          successfulMatches: 0,
        } as ProjectOwner
      : {
          ...mockCollaborator,
          id: `collab-${Date.now()}`,
          email,
          name,
          projectsJoined: 0,
          completedProjects: 0,
          matchesReceived: 0,
        } as Collaborator;
    
    setUser(newUser);
    localStorage.setItem('buildmate_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('buildmate_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('buildmate_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
