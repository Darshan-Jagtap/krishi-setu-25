import React, { useState, useCallback } from "react";
import { Upload, Image, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "upload-zone relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300",
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            "group"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
              "bg-gradient-card shadow-soft group-hover:shadow-card group-hover:scale-110",
              isDragging && "scale-110 shadow-glow-primary"
            )}>
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-semibold text-foreground">
                Upload Seed Image
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Drag and drop your seed image here, or click to browse. 
                Supports JPG, PNG, and WebP formats.
              </p>
            </div>

            <Button variant="hero" size="lg" className="mt-2 pointer-events-none">
              <Image className="w-5 h-5" />
              Choose Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-elevated animate-scale-in">
          <img
            src={preview}
            alt="Seed preview"
            className="w-full h-64 md:h-80 object-cover"
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-primary-foreground">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <p className="text-lg font-medium">Analyzing seed quality...</p>
              </div>
            </div>
          )}
          
          {!isAnalyzing && (
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-soft flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
