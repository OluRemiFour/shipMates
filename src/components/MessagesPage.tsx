import { useState } from 'react';
import { Send, Search, MoreVertical } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
  project?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      role: 'Tech Lead @ Stripe',
    },
    lastMessage: 'Great! Looking forward to our call tomorrow.',
    timestamp: '2 min ago',
    unread: 2,
    project: 'AI-Powered Code Review Assistant',
  },
  {
    id: '2',
    participant: {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      role: 'Founder @ DeSocial',
    },
    lastMessage: 'Can you share your GitHub profile?',
    timestamp: '1 hour ago',
    unread: 0,
    project: 'Decentralized Social Platform',
  },
  {
    id: '3',
    participant: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      role: 'CTO @ DesignFlow',
    },
    lastMessage: 'Thanks for your interest in the project!',
    timestamp: '3 hours ago',
    unread: 0,
    project: 'Real-Time Collaborative Design Tool',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I saw your application for the AI Code Review project. Your experience looks great!",
    sender: 'them',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: "Thank you! I'm really excited about this project. The tech stack aligns perfectly with my experience.",
    sender: 'me',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    text: "That's great to hear. Would you be available for a quick call tomorrow to discuss the project in more detail?",
    sender: 'them',
    timestamp: '10:35 AM',
  },
  {
    id: '4',
    text: "Absolutely! I'm free anytime after 2 PM. What time works best for you?",
    sender: 'me',
    timestamp: '10:38 AM',
  },
  {
    id: '5',
    text: "Let's do 3 PM. I'll send you a calendar invite.",
    sender: 'them',
    timestamp: '10:40 AM',
  },
  {
    id: '6',
    text: "Great! Looking forward to our call tomorrow.",
    sender: 'them',
    timestamp: '10:41 AM',
  },
];

export function MessagesPage() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [messages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.project?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    setNewMessage('');
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Conversations List */}
        <div className="w-80 glass-panel rounded-xl flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-display font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left ${
                  selectedConversation?.id === conversation.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                    <AvatarFallback>{conversation.participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs text-white flex items-center justify-center font-mono">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-sans font-medium text-white truncate">
                      {conversation.participant.name}
                    </p>
                    <span className="text-xs text-gray-500 font-mono">{conversation.timestamp}</span>
                  </div>
                  {conversation.project && (
                    <p className="text-xs text-cyan-400 font-sans truncate mb-1">
                      {conversation.project}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 font-sans truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 glass-panel rounded-xl flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                  <AvatarFallback>{selectedConversation.participant.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-sans font-medium text-white">
                    {selectedConversation.participant.name}
                  </p>
                  <p className="text-xs text-gray-400 font-sans">
                    {selectedConversation.participant.role}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Project Context */}
            {selectedConversation.project && (
              <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
                <p className="text-xs text-cyan-400 font-sans">
                  Discussing: <span className="font-medium">{selectedConversation.project}</span>
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'me'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    <p className="text-sm font-sans">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'me' ? 'text-white/60' : 'text-gray-500'
                    } font-mono`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-sans"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 glass-panel rounded-xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 font-sans text-lg mb-2">
                Select a conversation
              </p>
              <p className="text-gray-500 font-sans text-sm">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
