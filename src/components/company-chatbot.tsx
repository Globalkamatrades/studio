"use client";

import type { FC } from 'react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionCard from '@/components/ui/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Sparkles, Loader2, User } from 'lucide-react';
import { askCompanyChatbotAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  question: z.string().min(3, { message: "Question must be at least 3 characters." }),
});

type FormData = z.infer<typeof formSchema>;

interface ConversationTurn {
    speaker: 'user' | 'bot';
    text: string;
}

const CompanyChatbot: FC = () => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);

    const userTurn: ConversationTurn = { speaker: 'user', text: data.question };
    setConversation(prev => [...prev, userTurn]);
    
    form.reset();

    startTransition(async () => {
      const formData = new FormData();
      formData.append('question', data.question);
      
      const result = await askCompanyChatbotAction(formData);

      if (result.answer) {
        const botTurn: ConversationTurn = { speaker: 'bot', text: result.answer };
        setConversation(prev => [...prev, botTurn]);
      } else {
        let errorMessage = result.error || "Failed to get a response.";
        if (result.fieldErrors) {
            const fieldErrorMessages = Object.values(result.fieldErrors).flat().join(' ');
            errorMessage = `${errorMessage} ${fieldErrorMessages}`;
        }
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setConversation(prev => prev.slice(0, -1));
      }
    });
  };

  return (
    <SectionCard title="Ask Our AI Assistant" icon={<Bot className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Have a question about Ecoho Gold? Ask our AI assistant for a quick answer.
      </p>

      <div className="space-y-4 mb-6 p-4 border rounded-lg bg-card/50 min-h-[150px] max-h-[400px] overflow-y-auto shadow-inner">
        {conversation.length === 0 && !isPending && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Ask a question to start the conversation.</p>
            </div>
        )}
        {conversation.map((turn, index) => (
            <div key={index} className={`flex items-start gap-3 ${turn.speaker === 'user' ? 'justify-end' : ''}`}>
                {turn.speaker === 'bot' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                    </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${turn.speaker === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm whitespace-pre-wrap">{turn.text}</p>
                </div>
                 {turn.speaker === 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                )}
            </div>
        ))}
         {isPending && (
            <div className="flex items-center gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </div>
         )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="e.g., What is the total supply of ECOHO?" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles size={20} />
            )}
            <span className="sr-only">Ask</span>
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </SectionCard>
  );
};

export default CompanyChatbot;
