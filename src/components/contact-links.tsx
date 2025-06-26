
"use client";

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { useState, useTransition, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";
import SectionCard from '@/components/ui/section-card';
import { Mail, Send, MessageSquare, Twitter, Phone, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const ContactLinks: FC = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const SERVICE_ID = 'service_lpt3qnc';
  const TEMPLATE_ID = 'template_jqyu3xd';
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleRecaptchaChange = (value: string | null) => {
    setIsVerified(!!value);
  };

  const onSubmit = (data: FormData) => {
    if (PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        toast({
          title: "Setup Required",
          description: "EmailJS is not fully configured. Please update the Public Key in src/components/contact-links.tsx.",
          variant: "destructive",
        });
        return;
    }
    
    if (!isVerified) {
      toast({
        title: "Please complete the reCAPTCHA",
        description: "You must prove you are not a robot before sending the message.",
        variant: "destructive",
      });
      return;
    }

    const templateParams = {
        name: data.name,
        email: data.email,
        message: data.message,
    };

    startTransition(() => {
        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We'll get back to you shortly.",
            variant: "success",
          });
          form.reset();
          recaptchaRef.current?.reset();
          setIsVerified(false);
        })
        .catch((err) => {
          console.error('FAILED...', err);
          toast({
            title: "Error Sending Message",
            description: "Something went wrong. Please try again or use another contact method.",
            variant: "destructive",
          });
        });
    });
  };

  const contacts = [
    { href: "https://t.me/ecoho_gold_chat", icon: <Send size={24} />, label: "Telegram", handle: "Join Community" },
    { href: "https://wa.me/27655335608", icon: <MessageSquare size={24} />, label: "WhatsApp", handle: "+27 65 533 5608" },
    { href: "https://x.com/Ecoho_Gold", icon: <Twitter size={24} />, label: "Twitter", handle: "@Ecoho_Gold" },
  ];

  return (
    <SectionCard title="Contact Us" icon={<Phone className="text-primary h-8 w-8" />}>
        <p className="mb-6 text-lg">
            Have questions or want to get involved? Send us a message directly or reach out through one of our channels.
        </p>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-4">
                <h3 className="font-headline text-xl text-card-foreground">Send a Direct Message</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                <Input placeholder="John Doe" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Email (for replies)</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Your message here..." {...field} rows={5} disabled={isPending}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        
                        {RECAPTCHA_SITE_KEY && (
                          <div className="flex justify-center pt-2">
                             <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleRecaptchaChange}
                                theme="dark"
                              />
                          </div>
                        )}

                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                            {isPending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Mail size={20} className="mr-2" />)}
                            {isPending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </Form>
                 {PUBLIC_KEY === 'YOUR_PUBLIC_KEY' && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Action Required: Activate Contact Form</AlertTitle>
                        <AlertDescription>
                          To make this form work, get your <strong>Public Key</strong> from your EmailJS account dashboard. Then, open the file <code>src/components/contact-links.tsx</code> and replace the placeholder value for `YOUR_PUBLIC_KEY`.
                        </AlertDescription>
                    </Alert>
                )}
                 {!RECAPTCHA_SITE_KEY && (
                    <Alert variant="destructive" className="mt-4">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Action Required: Activate Spam Protection</AlertTitle>
                        <AlertDescription>
                          The reCAPTCHA Site Key is missing. Please add it to your <code>.env</code> file as <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> to enable the contact form.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-xl text-card-foreground">Other Channels</h3>
                <ul className="space-y-2">
                    {contacts.map((contact) => (
                    <ContactLinkItem key={contact.label} {...contact} />
                    ))}
                </ul>
                <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertTitle>Direct Email</AlertTitle>
                    <AlertDescription>
                    For official inquiries, you can also email us at <a href="mailto:Akhona@kamaincprofile.com" className="font-semibold text-primary hover:underline">Akhona@kamaincprofile.com</a>.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    </SectionCard>
  );
};

export default ContactLinks;
