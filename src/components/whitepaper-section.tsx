"use client";

import type { FC } from 'react';
import { useState, useTransition } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Button } from '@/components/ui/button';
import { DownloadCloud, FileText, Sparkles, Loader2 } from 'lucide-react';
import { summarizeWhitepaperAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WhitepaperSection: FC = () => {
  const whitepaperUrl = "https://kamaincprofile.com/Ecoho_Gold_Whitepaper_FINAL.pdf";
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSummarize = async () => {
    setError(null);
    setSummary(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('whitepaperUrl', whitepaperUrl);
      const result = await summarizeWhitepaperAction(formData);
      if (result.summary) {
        setSummary(result.summary);
        toast({
          title: "Summary Generated",
          description: "The whitepaper summary has been successfully generated.",
        });
      } else {
        setError(result.error || "Failed to generate summary.");
        toast({
          title: "Error",
          description: result.error || "Failed to generate summary.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <SectionCard title="Whitepaper" icon={<FileText className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Dive deep into the Ecoho Gold vision, tokenomics, and roadmap by downloading our official whitepaper.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ButtonLink
          href={whitepaperUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          icon={<DownloadCloud size={20} />}
        >
          Download Whitepaper (PDF)
        </ButtonLink>
        <Button
          onClick={handleSummarize}
          disabled={isPending}
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles size={20} className="mr-2" />
          )}
          {isPending ? 'Summarizing...' : 'Summarize with AI'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {summary && (
        <div className="mt-6 p-4 border border-primary/30 rounded-lg bg-card/50 shadow-inner">
          <h3 className="font-headline text-xl mb-2 text-primary">AI Summary:</h3>
          <p className="text-card-foreground/90 whitespace-pre-line leading-relaxed">{summary}</p>
        </div>
      )}
    </SectionCard>
  );
};

export default WhitepaperSection;
