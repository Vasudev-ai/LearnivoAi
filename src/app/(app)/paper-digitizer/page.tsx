"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { digitizePaperAction } from "@/app/actions/digitize-paper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, FileText, FileDown, ScanLine, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { DigitizePaperOutput } from "@/ai/flows/digitize-paper-flow";
import { useWorkspace } from "@/context/workspace-context";
import { htmlToText } from "html-to-text";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUser } from "@/firebase";
import { FeedbackCard } from "@/components/feedback-card";
import { AILoading } from "@/components/ai-loading";
import { SpotlightCard } from "@/components/shared";
import { useStreaming } from "@/hooks/use-streaming";
import { PaperDigitizerStreaming } from "@/components/streaming";
import { useCreditCheck } from "@/hooks/use-credit-check";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  isProcessed: boolean;
}

export default function PaperDigitizerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ content: string, assetId: string | null} | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const { addAsset } = useWorkspace();
  const { profile } = useUser();

  const {
    phase,
    overallProgress,
    initializeSections,
    startStreaming,
    isStreaming,
    isComplete,
  } = useStreaming();

  const { checkAndDeduct, InsufficientModal } = useCreditCheck();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      isProcessed: false,
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const processFiles = async () => {
    const hasCredits = await checkAndDeduct("Paper Digitizer");
    if (!hasCredits) return;

    const filesToProcess = files.filter(f => !f.isProcessed);
    if (filesToProcess.length === 0) {
      toast({ title: "No new files to process." });
      return;
    }

    setIsLoading(true);

    initializeSections(["digitizing"]);
    const sectionSequence = [{ id: "digitizing", delay: 3000, content: "Digitizing..." }];
    await startStreaming(sectionSequence);

    let currentContent = result?.content || "";
    let finalAssetId: string | null = null;

    for (const uploadedFile of filesToProcess) {
      try {
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile.file);
        });

        const response = await digitizePaperAction({
          photoDataUri: fileData,
          existingContent: currentContent,
        });

        currentContent = response.formattedContent;
        
        // This is a temporary state for UI. It will be overwritten in the final state update.
        setResult({ content: currentContent, assetId: null });

        // Mark file as processed
        setFiles(prevFiles => prevFiles.map(f => f.id === uploadedFile.id ? { ...f, isProcessed: true } : f));
        
      } catch (error) {
        console.error(error);
        toast({
          title: "Something went wrong",
          description: `Failed to digitize ${uploadedFile.file.name}. Please try again.`,
          variant: "destructive",
        });
        // Stop processing on error
        break;
      }
    }
    
    if (currentContent) {
        finalAssetId = await addAsset({
            type: "Digitized Paper",
            name: response.title || `Digitized Paper - ${new Date().toLocaleString()}`,
            content: { formattedContent: currentContent },
        });
        if (profile?.autoSave && finalAssetId) {
            toast({
                title: "Auto-Saved!",
                description: "Digitized paper saved to your workspace.",
            });
        }
    }

    setResult({ content: currentContent, assetId: finalAssetId });
    setIsLoading(false);
  };
  
  const exportAsTxt = () => {
    if (!result?.content) return;
    const text = htmlToText(result.content, { wordwrap: 130 });
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "digitized-paper.txt");
  };

  const exportAsDocx = async () => {
    if (!result?.content) return;
    // @ts-ignore
    const htmlDocx = (await import('html-docx-js/dist/html-docx')).default;
    const content = `<!DOCTYPE html><html><body>${result.content}</body></html>`;
    const fileData = htmlDocx.asBlob(content);
    saveAs(fileData, 'digitized-paper.docx');
  };

  const exportAsPdf = () => {
    if (!result?.content) return;
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          let width = pdfWidth;
          let height = width / ratio;
          if (height > pdfHeight) {
              height = pdfHeight;
              width = height * ratio;
          }
          let position = 0;
          pdf.addImage(imgData, 'PNG', 0, position, width, height);
          let heightLeft = canvas.height * (pdfWidth / canvas.width) - pdfHeight;
          
          while (heightLeft > 0) {
            position = -pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            heightLeft -= pdfHeight;
          }
          pdf.save("digitized-paper.pdf");
        });
    }
  };

  return (
    <>
      {InsufficientModal}
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <SpotlightCard className="sticky top-6">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Paper Digitizer</CardTitle>
            <CardDescription>
              Upload handwritten paper pages one by one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                    {isDragActive ? "Drop files here..." : "Click or drag to add pages"}
                    </p>
                </div>
              </div>
            
            <div className="space-y-2">
              <Label>Uploaded Pages</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {files.map((uploadedFile, index) => (
                  <div key={uploadedFile.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                    <div className="flex items-center gap-3">
                      <Image src={uploadedFile.preview} alt={uploadedFile.file.name} width={40} height={40} className="object-cover rounded-sm aspect-square"/>
                      <span className="text-sm font-medium truncate flex-1">{index + 1}. {uploadedFile.file.name}</span>
                       {uploadedFile.isProcessed && <Badge variant="secondary">Processed</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(uploadedFile.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {files.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No pages uploaded yet.</p>
                )}
              </div>
            </div>

            <Button onClick={processFiles} className="w-full" disabled={isLoading || files.filter(f => !f.isProcessed).length === 0}>
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
                ) : (
                <>
                    <ScanLine className="mr-2 h-4 w-4" />
                    Digitize Page by Page
                </>
                )}
            </Button>
          </CardContent>
        </SpotlightCard>
      </div>

      <div className="lg:col-span-2">
        <SpotlightCard className="min-h-[calc(100vh-10rem)]">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-2xl">
                    Digitized Result
                    </CardTitle>
                    <CardDescription>
                    Your AI-formatted question paper will be built here.
                    </CardDescription>
                </div>
                {result?.content && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportAsTxt}><FileText className="mr-2 h-4 w-4" /> TXT</Button>
                        <Button variant="outline" onClick={exportAsDocx}>DOCX</Button>
                        <Button variant="outline" onClick={exportAsPdf}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
                    </div>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && isStreaming && (
              <PaperDigitizerStreaming
                overallProgress={overallProgress}
                fileName={files[0]?.file.name || "document.jpg"}
              />
            )}
            {isLoading && !isStreaming && !result?.content && (
              <div className="flex h-96 items-center justify-center">
                <AILoading toolName="paper-digitizer" />
              </div>
            )}
            {result?.content && (
              <div id="pdf-content" className="prose prose-sm max-w-none rounded-md border bg-muted p-4 dark:prose-invert" dangerouslySetInnerHTML={{ __html: result.content }} />
            )}
            {!isLoading && !result?.content && (
              <div className="flex h-96 flex-col items-center justify-center text-center text-muted-foreground">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="font-semibold">
                  Turn physical papers into digital assets.
                </p>
                <p>
                  Upload an image of a question paper to get started.
                </p>
              </div>
            )}
          </CardContent>
          {result && result.assetId && (
            <CardFooter>
                <FeedbackCard assetId={result.assetId} assetType="Digitized Paper" />
            </CardFooter>
          )}
        </SpotlightCard>
      </div>
    </div>
    </>
  );
}
