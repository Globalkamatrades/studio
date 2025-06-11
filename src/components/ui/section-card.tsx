import type { FC, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  actions?: ReactNode; // For buttons or links in the header
}

const SectionCard: FC<SectionCardProps> = ({ title, icon, children, className, titleClassName, contentClassName, actions }) => {
  return (
    <Card className={cn("shadow-xl transition-all hover:shadow-2xl", className)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className={cn("font-headline text-2xl md:text-3xl text-card-foreground border-b-2 border-primary pb-2", titleClassName)}>
              {title}
            </CardTitle>
          </div>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn("text-card-foreground/90 leading-relaxed", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
