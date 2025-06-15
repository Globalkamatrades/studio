
"use client";

import type { FC, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Download, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import SectionCard from '@/components/ui/section-card';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPE = ".sql";

const SqlFileSelector: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    setError(null);
    setSuccessMessage(null);

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(ACCEPTED_FILE_TYPE)) {
      setError(`Invalid file type. Please select a ${ACCEPTED_FILE_TYPE} file.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      return;
    }

    setSelectedFile(file);
    setSuccessMessage(`File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  const handleDownload = () => {
    if (!selectedFile) {
      setError("No file selected to download.");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccessMessage(`"${selectedFile.name}" download initiated.`);
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <SectionCard title="SQL File Utility" icon={<Database className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Select a SQL file (max 20MB) to make it available for download.
      </p>
      
      <div className="space-y-4">
        <Label htmlFor="sql-file-input" className="sr-only">SQL File Input</Label>
        <Input
          id="sql-file-input"
          type="file"
          accept={ACCEPTED_FILE_TYPE}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden" 
        />
        <Button 
          onClick={handleSelectFileClick} 
          variant="outline" 
          className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
        >
          <FileUp size={20} className="mr-2" />
          Select SQL File
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && !error && (
           <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {selectedFile && !error && (
          <Button 
            onClick={handleDownload} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download size={20} className="mr-2" />
            Download Selected SQL File
          </Button>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Ensure the SQL file is not larger than 20MB. Accepted format: .sql
      </p>
    </SectionCard>
  );
};

export default SqlFileSelector;
