
"use client";

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePictureUploader() {
  const [user, loading, authError] = useAuthState(auth);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please choose a file to upload.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Authentication Required", description: "You must be logged in to upload a profile picture.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        console.error("Upload error:", error);
        toast({ title: "Upload Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploading(false);
          setUploadProgress(100);
          toast({ title: "Upload Successful!", description: "Your profile picture has been updated.", variant: "success" });
          // Here you would typically save the downloadURL to the user's profile in Firestore.
          console.log('File available at', downloadURL);
          setPreviewUrl(downloadURL); // Update preview to be the final URL
        });
      }
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin" /></div>;
  }
  
  // A fallback for the avatar if the user has no image yet.
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <div className="space-y-4 text-center">
      <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
        <AvatarImage src={previewUrl || user?.photoURL || ''} alt="Profile Picture Preview" />
        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
      </Avatar>

      {!user ? (
        <Alert variant="destructive">
          <AlertTitle>Login Required</AlertTitle>
          <AlertDescription>
            Please log in to upload a profile picture. Full authentication is coming soon.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Input id="picture" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} disabled={isUploading} className="text-sm"/>
          
          {isUploading && <Progress value={uploadProgress} className="w-full" />}
          
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Picture'}
          </Button>
          <p className="text-xs text-muted-foreground">Max file size: 5MB. Formats: JPG, PNG.</p>
        </>
      )}
    </div>
  );
}
