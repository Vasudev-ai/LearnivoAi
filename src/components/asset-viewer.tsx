
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GanttChart,
  HelpCircle,
  Scale,
  GraduationCap,
  BrainCircuit,
  Mail,
  FileText,
  Target,
  ListChecks,
  Paperclip,
  ClipboardCheck,
  Link as LinkIcon,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CheckCircle2,
  ScanLine,
  Layers,
  BookText,
  View,
  Calculator,
} from "lucide-react";
import Image from "next/image";
import type { Asset } from "@/context/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizResult } from "@/components/quiz-result";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const getIconForAssetType = (type: string, className?: string) => {
  switch (type) {
    case "Lesson Plan":
      return <GanttChart className={className} />;
    case "Quiz":
      return <HelpCircle className={className} />;
    case "Rubric":
      return <Scale className={className} />;
    case "Debate Topic":
      return <GraduationCap className={className} />;
    case "Hyper-Local Content":
      return <BrainCircuit className={className} />;
    case "Parent Communication":
      return <Mail className={className} />;
    case "Quiz Result":
      return <CheckCircle2 className={className} />;
    case "Digitized Paper":
        return <ScanLine className={className} />;
    case "Visual Aid":
        return <Layers className={className} />;
    case "Story":
        return <BookText className={className} />;
    case "Math Solution":
        return <Calculator className={className} />;
    default:
      return <FileText className={className} />;
  }
};

type AssetViewerProps = {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssetViewer({ asset, open, onOpenChange }: AssetViewerProps) {
  if (!asset) return null;

  const renderContent = () => {
    switch (asset.type) {
      case "Lesson Plan":
        return <LessonPlanViewer content={asset.content} />;
      case "Quiz":
        return <QuizViewer content={asset.content} />;
      case "Rubric":
        return <RubricViewer content={asset.content} />;
      case "Debate Topic":
        return <DebateTopicViewer content={asset.content} />;
      case "Parent Communication":
        return <ParentCommunicationViewer content={asset.content} />;
      case "Hyper-Local Content":
        return <HyperLocalContentViewer content={asset.content} />;
      case "Digitized Paper":
        return <DigitizedPaperViewer content={asset.content} />;
      case "Quiz Result":
        return <QuizResultViewer content={asset.content} />;
      case "Visual Aid":
        return <VisualAidViewer content={asset.content} />;
      case "Story":
        return <StoryViewer content={asset.content} />;
      case "Math Solution":
        return <MathSolutionViewer content={asset.content} />;
      default:
        return <pre>{JSON.stringify(asset.content, null, 2)}</pre>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-3">
            {getIconForAssetType(asset.type, "h-6 w-6")}
            {asset.name}
          </DialogTitle>
          <DialogDescription>{asset.type}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

// Viewer Components for each asset type

const renderResource = (resource: string) => {
  try {
    const url = new URL(resource);
    return (
      <a
        href={url.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-primary underline hover:opacity-80"
      >
        <LinkIcon className="h-3 w-3" />
        {url.hostname}
      </a>
    );
  } catch (e) {
    return <span>{resource}</span>;
  }
};

function LessonPlanViewer({ content }: { content: any }) {
  const parsedPlan = typeof content === 'string' ? JSON.parse(content) : content;
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-0"
    >
      {Object.entries(parsedPlan).map(([day, details]: [string, any], index) => (
        <AccordionItem value={`item-${index}`} key={day}>
          <AccordionTrigger className="font-headline text-lg font-semibold capitalize hover:no-underline">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base">
                {day.replace("_", " ")}
              </Badge>
              <span>{details.sub_topic}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                <Target className="h-5 w-5 text-primary" />
                <h4 className="font-headline text-lg font-semibold">
                  Learning Objectives
                </h4>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  {details.learning_objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span className="flex-1 text-muted-foreground">{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                <ListChecks className="h-5 w-5 text-primary" />
                <h4 className="font-headline text-lg font-semibold">Activities</h4>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
                {details.activities.map((act: {name: string, duration: string}, i: number) => (
                  <Badge key={i} variant="outline">
                    {act.name} ({act.duration})
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                  <Paperclip className="h-5 w-5 text-primary" />
                  <h4 className="font-headline text-lg font-semibold">Resources</h4>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  {details.resources.map((res: string, i: number) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      {renderResource(res)}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <h4 className="font-headline text-lg font-semibold">Assessment</h4>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{details.assessment}</p>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function QuizViewer({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{content.title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {content.questions.map((q: any, index: number) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left">
              <div className="flex items-start gap-3">
                <span className="mt-1">{index + 1}.</span>
                <span>{q.questionText}</span>
                <Badge variant="outline">{q.marks} Marks</Badge>              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
              {q.questionType === "MCQ" && q.options && (
                <ul>
                  {q.options.map((opt: string, i: number) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
              <p><strong>Answer:</strong> {q.correctAnswer}</p>
              <p><strong>Explanation:</strong> {q.explanation}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function RubricViewer({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{content.title}</h2>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-bold">Criteria</TableHead>
              {content.criteria[0]?.levels.map((level: any) => (
                <TableHead key={level.level} className="font-bold">
                  {level.level}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.criteria.map((criterion: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">{criterion.criteria}</TableCell>
                {criterion.levels.map((level: any) => (
                  <TableCell key={level.level} className="text-sm">
                    {level.description}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DebateTopicViewer({ content }: { content: any }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-0"
    >
      {content.topics.map((item: any, index: number) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left font-semibold hover:no-underline">
            {item.topic}
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                  <h4 className="font-bold">For</h4>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {item.forPoints.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                  <ThumbsDown className="h-5 w-5 text-red-500" />
                  <h4 className="font-bold">Against</h4>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {item.againstPoints.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ParentCommunicationViewer({ content }: { content: any }) {
  const { toast } = useToast();

  const handleCopy = (text: string, language: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${language} draft copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-4">
       <div className="relative mt-4 rounded-md border bg-muted p-4">
         <h3 className="font-headline mb-2">English Draft</h3>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={() => handleCopy(content.emailDraft, "English")}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {content.emailDraft}
        </pre>
      </div>
       <div className="relative mt-4 rounded-md border bg-muted p-4">
        <h3 className="font-headline mb-2">Translated Draft</h3>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={() => handleCopy(content.translatedEmailDraft, "Translated")}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {content.translatedEmailDraft}
        </pre>
      </div>
    </div>
  );
}

function HyperLocalContentViewer({ content }: { content: any }) {
  return (
    <div className="prose prose-sm max-w-none rounded-md border bg-muted p-4 dark:prose-invert">
      <p>{content.content}</p>
    </div>
  );
}

function StoryViewer({ content }: { content: any }) {
  if (!content || !content.pages) {
    return <div className="text-muted-foreground">No story content to display.</div>;
  }
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {content.pages.map((page: any) => (
          <CarouselItem key={page.pageNumber}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col aspect-video items-center justify-center p-6 gap-4">
                  <div className="relative w-full h-3/5 bg-muted rounded-md">
                    {page.imageDataUri ? (
                      <Image
                        src={page.imageDataUri}
                        alt={`Illustration for page ${page.pageNumber}`}
                        layout="fill"
                        objectFit="contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No illustration for this page.</p>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-lg md:text-xl h-2/5 overflow-y-auto">{page.text}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
}


function DigitizedPaperViewer({ content }: { content: any }) {
  if (!content || !content.formattedContent) {
    return (
      <div className="text-muted-foreground">
        No content to display.
      </div>
    );
  }
  return (
    <div
      className="prose prose-sm max-w-none rounded-md border bg-muted p-4 dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content.formattedContent }}
    />
  );
}

function VisualAidViewer({ content }: { content: any }) {
  if (!content || !content.svg) {
    return (
      <div className="text-muted-foreground">
        No content to display.
      </div>
    );
  }
  return (
    <div
      className="w-full h-full p-4 rounded-lg bg-slate-800 border border-slate-700"
      dangerouslySetInnerHTML={{ __html: content.svg }}
    />
  );
}


function QuizResultViewer({ content }: { content: any }) {
  if (!content.quiz || !content.evaluation || !content.answers) {
    return <p>Incomplete result data.</p>;
  }
  return (
    <QuizResult
      quiz={content.quiz}
      evaluation={content.evaluation}
      userAnswers={content.answers}
    />
  );
}

function MathSolutionViewer({ content }: { content: any }) {
  if (!content) {
    return (
      <div className="text-muted-foreground">
        No content to display.
      </div>
    );
  }
  return (
     <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Solution</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>{content.solution}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Explanation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                 <p>{content.explanation}</p>
            </CardContent>
        </Card>
    </div>
  );
}
