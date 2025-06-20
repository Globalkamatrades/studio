
"use client";

import type { FC } from 'react';
// Removed useState, useTransition, summarizeWhitepaperAction, useToast, Alert related imports as they are no longer used.
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { FileText, Eye } from 'lucide-react'; // Replaced DownloadCloud with Eye for "View" action

const WhitepaperSection: FC = () => {
  const whitepaperAppPageUrl = "/whitepaper"; // Link to the new in-app whitepaper page

  return (
    <SectionCard title="Whitepaper" icon={<FileText className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Dive deep into the Ecoho Gold vision, tokenomics, and roadmap by viewing our official whitepaper.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ButtonLink
          href={whitepaperAppPageUrl}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          icon={<Eye size={20} />} // Changed icon to Eye
        >
          View Whitepaper
        </ButtonLink>
        {/* AI Summarization button and logic removed */}
      </div>
      {/* Error and summary display logic removed */}
    </SectionCard>
  );
};

export default WhitepaperSection;
```