'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BarChart3, Bot, Database, GraduationCap, Loader2, Send, User, BrainCircuit } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { processQuery } from './actions';

type AgentName = 'aura' | 'nexus' | 'wise';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: AgentName;
}

const agents = [
  {
    id: 'aura',
    name: 'Aura',
    specialty: 'Knowledge Curation',
    description: 'Specializes in product info, rates, and policies.',
    icon: Database,
  },
  {
    id: 'nexus',
    name: 'Nexus',
    specialty: 'Financial Analysis',
    description: 'Provides financial insights, reports, and trends.',
    icon: BarChart3,
  },
  {
    id: 'wise',
    name: 'Wise',
    specialty: 'Financial Education',
    description: 'Mentors on financial management and business.',
    icon: GraduationCap,
  },
];

const exampleQueries = [
    "What's the fee for instant payments?",
    "Analyze my sales for the last 6 months",
    "How do I calculate profit margin?",
    "How does cash flow work?",
];

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'assistant',
            content: 'Welcome! How can I assist you today? Feel free to ask me anything or try one of the examples below.',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAgent, setActiveAgent] = useState<AgentName | null>(null);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setActiveAgent(null);

        try {
            const { agentName, response } = await processQuery(input);
            const agentMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: response, agentName: agentName as AgentName };
            setActiveAgent(agentName as AgentName);
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            const errorMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (query: string) => {
        setInput(query);
    };
    
    const AgentIcon = ({ agentName }: { agentName?: AgentName }) => {
        const agent = agents.find(a => a.id === agentName);
        if (agent) {
            return <agent.icon className="h-6 w-6 text-primary" />;
        }
        return <Bot className="h-6 w-6 text-primary" />;
    };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[320px_1fr]">
      <aside className="hidden flex-col border-r bg-card p-6 md:flex">
        <div className="flex items-center gap-3">
            <BrainCircuit className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Your intelligent agent system.</p>

        <div className="mt-8 flex flex-1 flex-col gap-6">
          <h2 className="text-lg font-semibold">Our Agents</h2>
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-start gap-4">
              <Avatar className={cn(
                "h-10 w-10 border-2 border-transparent transition-all",
                activeAgent === agent.id && "border-gold"
              )}>
                <AvatarFallback className="bg-secondary">
                    <agent.icon className={cn("h-5 w-5 text-muted-foreground", activeAgent === agent.id && "text-gold")}/>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={cn(
                    "font-semibold transition-colors",
                    activeAgent === agent.id && "text-gold animate-pulse"
                )}>
                    {agent.name}
                </p>
                <p className="text-sm text-muted-foreground">{agent.specialty}</p>
                <p className="mt-1 text-xs text-muted-foreground/80">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex flex-col">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 md:p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex items-start gap-4 animate-in fade-in",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                {message.role === 'assistant' && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-secondary">
                        <AgentIcon agentName={message.agentName} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                    "max-w-md rounded-xl p-4 whitespace-pre-wrap",
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
                )}>
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'assistant' && message.agentName && (
                        <div className="mt-3 flex items-center justify-end gap-2">
                             <span className="text-xs text-muted-foreground">Confidence: High</span>
                        </div>
                    )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className='bg-primary/20'>
                        <User className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t bg-card p-4 md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
                {exampleQueries.map((query, i) => (
                    <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => handleExampleClick(query)}>
                        {query}
                    </Button>
                ))}
            </div>
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question about your finances, products, or business management..."
              className="min-h-[60px] resize-none pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
