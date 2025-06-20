"use client";

import type { FC } from 'react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionCard from '@/components/ui/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Newspaper, Sparkles, Loader2, Users } from 'lucide-react';
import { generateCommunitySpotlightArticleAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const formSchema = z.object({
  topic: z.string().min(5, { message: "Topic must be at least 5 characters." }),
  communityName: z.string().min(3, { message: "Community name must be at least 3 characters." }).default("ECOHO Community"),
  spotlightMemberName: z.string().optional(),
  recentAchievements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GeneratedArticle {
  title: string;
  content: string;
}

const CommunitySpotlightForm: FC = () => {
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      communityName: "ECOHO Community",
      spotlightMemberName: "",
      recentAchievements: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setGeneratedArticle(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('topic', data.topic);
      formData.append('communityName', data.communityName);
      if (data.spotlightMemberName) formData.append('spotlightMemberName', data.spotlightMemberName);
      if (data.recentAchievements) formData.append('recentAchievements', data.recentAchievements);
      
      const result = await generateCommunitySpotlightArticleAction(formData);
      if (result.title && result.content) {
        setGeneratedArticle({ title: result.title, content: result.content });
        toast({
          title: "Article Generated",
          description: "Community spotlight article created successfully.",
        });
      } else {
        let errorMessage = result.error || "Failed to generate article.";
        if (result.fieldErrors) {
            const fieldErrorMessages = Object.values(result.fieldErrors).flat().join(' ');
            errorMessage = `${errorMessage} ${fieldErrorMessages}`;
        }
        setError(errorMessage);
        toast({
          title: "Error Generating Article",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <SectionCard title="AI Community Spotlight Generator" icon={<Users className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Generate engaging news articles to highlight community achievements and incentivize participation.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Recent Project Milestones" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="communityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spotlightMemberName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spotlight Member Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recentAchievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recent Achievements (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe their recent contributions or achievements." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles size={20} className="mr-2" />
            )}
            {isPending ? 'Generating Article...' : 'Generate Article with AI'}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedArticle && (
        <div className="mt-8 p-6 border border-primary/30 rounded-lg bg-card/50 shadow-inner">
          <h3 className="font-headline text-2xl mb-2 text-primary flex items-center gap-2">
            <Newspaper size={28} /> Generated Article
          </h3>
          <h4 className="font-headline text-xl font-semibold mt-4 mb-2 text-card-foreground">{generatedArticle.title}</h4>
          <div className="text-card-foreground/90 whitespace-pre-line leading-relaxed prose prose-sm max-w-none">
            {generatedArticle.content.split('\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default CommunitySpotlightForm;
```