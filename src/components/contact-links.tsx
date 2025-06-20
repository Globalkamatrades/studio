
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Mail, Send, MessageSquare, Twitter, Phone } from 'lucide-react'; // Using Phone for WhatsApp temporarily

interface ContactLinkItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  handle: string;
}

const ContactLinkItem: FC<ContactLinkItemProps> = ({ href, icon, label, handle }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <span className="text-primary group-hover:scale-110 transition-transform">{icon}</span>
      <div>
        <span className="font-semibold text-card-foreground">{label}:</span>{' '}
        <span className="text-primary group-hover:underline">{handle}</span>
      </div>
    </a>
  </li>
);

const ContactLinks: FC = () => {
  const contacts = [
    { href: "mailto:Akhona@kamaincprofile.com", icon: <Mail size={24} />, label: "Email", handle: "Akhona@kamaincprofile.com" },
    { href: "https://t.me/ecoho_gold_chat", icon: <Send size={24} />, label: "Telegram", handle: "Join Community" },
    { href: "https://wa.me/27655335608", icon: <MessageSquare size={24} />, label: "WhatsApp", handle: "+27 65 533 5608" }, // Using MessageSquare as generic chat
    { href: "https://x.com/Ecoho_Gold", icon: <Twitter size={24} />, label: "Twitter", handle: "@Ecoho_Gold" },
  ];

  return (
    <SectionCard title="Contact Us" icon={<Phone className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Have questions or want to get involved? Reach out to us through any of the channels below. We're excited to connect with you!
      </p>
      <ul className="space-y-2">
        {contacts.map((contact) => (
          <ContactLinkItem key={contact.label} {...contact} />
        ))}
      </ul>
    </SectionCard>
  );
};

export default ContactLinks;
```