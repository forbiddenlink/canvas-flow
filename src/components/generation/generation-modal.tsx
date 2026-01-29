"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Download, PlusCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface GenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

type Model = "flux-pro" | "flux-dev" | "sdxl";

interface GenerationResult {
  imageUrl: string;
  prompt: string;
  model: string;
}

type GenerationStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled";

export function GenerationModal({
  open,
  onOpenChange,
  onImageGenerated,
}: GenerationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState<Model>("flux-pro");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Progress tracking state
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup on unmount or modal close
  useEffect(() => {
    if (!open) {
      // Clear polling when modal closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  }, [open]);

  const pollStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/generate/status?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to check status");
      }

      const data = await response.json();
      setStatus(data.status);
      setProgress(data.progress);

      // Update estimated time based on elapsed time
      if (startTimeRef.current && data.progress > 0 && data.progress < 100) {
        const elapsed = Date.now() - startTimeRef.current;
        const estimated = (elapsed / data.progress) * (100 - data.progress);
        setEstimatedTime(Math.round(estimated / 1000)); // Convert to seconds
      }

      if (data.status === "succeeded" && data.imageUrl) {
        // Success! Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setGeneratedImage({
          imageUrl: data.imageUrl,
          prompt,
          model,
        });
        setIsGenerating(false);
        setProgress(100);
        setEstimatedTime(null);
      } else if (data.status === "failed") {
        // Failed
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setError(data.error || "Generation failed");
        setIsGenerating(false);
        setProgress(0);
        setEstimatedTime(null);
      } else if (data.status === "canceled") {
        // Canceled
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        setIsGenerating(false);
        setProgress(0);
        setEstimatedTime(null);
      }
    } catch (err) {
      console.error("Status polling error:", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setProgress(0);
    setStatus("starting");
    setPredictionId(null);
    setEstimatedTime(30); // Initial estimate: 30 seconds
    startTimeRef.current = Date.now();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();
      setPredictionId(data.predictionId);

      // Start polling for status updates
      pollingIntervalRef.current = setInterval(() => {
        pollStatus(data.predictionId);
      }, 1000); // Poll every second

      // Initial poll
      pollStatus(data.predictionId);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
      setIsGenerating(false);
      setProgress(0);
      setEstimatedTime(null);
    }
  };

  const handleCancel = async () => {
    if (!predictionId) return;

    try {
      const response = await fetch("/api/generate/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ predictionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel generation");
      }

      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      setIsGenerating(false);
      setProgress(0);
      setStatus("canceled");
      setEstimatedTime(null);
      setError("Generation canceled");
    } catch (err) {
      console.error("Cancel error:", err);
      setError(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  const handleUseInCanvas = () => {
    if (generatedImage && onImageGenerated) {
      onImageGenerated(generatedImage.imageUrl);
      onOpenChange(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage.imageUrl;
      link.download = `pixelforge-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "starting":
        return "Starting generation...";
      case "processing":
        return "Generating image...";
      case "succeeded":
        return "Complete!";
      case "failed":
        return "Failed";
      case "canceled":
        return "Canceled";
      default:
        return "Preparing...";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Image Generation
          </DialogTitle>
          <DialogDescription>
            Generate stunning images with AI. Enter a detailed prompt and select your preferred model.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt *</Label>
            <Textarea
              id="prompt"
              placeholder="A serene mountain landscape at sunset with vibrant orange and purple skies..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              {prompt.length} characters
            </p>
          </div>

          {/* Negative Prompt */}
          <div className="space-y-2">
            <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
            <Textarea
              id="negative-prompt"
              placeholder="blurry, low quality, distorted, ugly..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-[60px] resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={model}
              onValueChange={(value) => setModel(value as Model)}
              disabled={isGenerating}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flux-pro">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Flux Pro</span>
                    <span className="text-xs text-muted-foreground">
                      Highest quality, best for detailed images
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="flux-dev">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Flux Dev</span>
                    <span className="text-xs text-muted-foreground">
                      Fast and creative, great for experiments
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="sdxl">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">SDXL</span>
                    <span className="text-xs text-muted-foreground">
                      Stable Diffusion XL, reliable quality
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Progress Indicator */}
          {isGenerating && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{getStatusText()}</span>
                {estimatedTime !== null && estimatedTime > 0 && (
                  <span className="text-muted-foreground">
                    ~{estimatedTime}s remaining
                  </span>
                )}
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isGenerating ? (
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex-1"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Image
              </Button>
            ) : (
              <Button
                onClick={handleCancel}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Generation
              </Button>
            )}
          </div>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-medium text-sm">Generated Image</h3>
              <div className="relative rounded-lg overflow-hidden bg-muted w-full aspect-square">
                <Image
                  src={generatedImage.imageUrl}
                  alt={generatedImage.prompt}
                  fill
                  className="object-contain"
                  unoptimized // Required for external URLs from Replicate
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUseInCanvas}
                  className="flex-1"
                  size="lg"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Use in Canvas
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
