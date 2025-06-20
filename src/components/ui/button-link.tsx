import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button'; // Assuming Button has variants

interface ButtonLinkProps extends Omit<ButtonProps, 'asChild'> {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  icon?: ReactNode;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  children,
  target,
  rel,
  className,
  variant = 'default',
  size = 'default',
  icon,
  ...props
}) => {
  return (
    <Button asChild variant={variant} size={size} className={cn("gap-2", className)} {...props}>
      <Link href={href} target={target} rel={rel}>
        {icon}
        {children}
      </Link>
    </Button>
  );
};

export default ButtonLink;
```