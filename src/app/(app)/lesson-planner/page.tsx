"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateLessonPlanAction } from "@/app/actions/generate-lesson-plan";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Loader2,
  BookText,
  Target,
  ListChecks,
  Paperclip,
  ClipboardCheck,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/context/workspace-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/firebase";
import { FeedbackCard } from "@/components/feedback-card";
import { AILoading } from "@/components/ai-loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { SpotlightCard } from "@/components/shared";


const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  grade: z.string().min(1, "Grade is required."),
  objectives: z.string().min(10, "Objectives must be at least 10 characters."),
});

type LessonPlanDay = {
  sub_topic: string;
  learning_objectives: string[];
  activities: {
    name: string;
    duration: string;
  }[];
  resources: string[];
  assessment: string;
};

type LessonPlan = {
  [day: string]: LessonPlanDay;
};

type ModalContent = {
  type: 'Activities' | 'Assessment' | 'Learning Objectives' | 'Resources';
  data: any;
  daySubTopic: string;
}

const gradeLevels = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", 
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", 
  "Grade 11", "Grade 12",
] as const;

export default function LessonPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{plan: LessonPlan, assetId: string | null} | null>(null);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const { toast } = useToast();
  const { addAsset } = useWorkspace();
  const { profile } = useUser();
  const router = useRouter();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      grade: profile?.defaultGrade || "Grade 8",
      objectives: "",
    },
  });

  useEffect(() => {
    if (profile?.defaultGrade) {
      form.setValue("grade", profile.defaultGrade);
    }
  }, [profile, form]);

  const handleGeneration = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateLessonPlanAction({
        topic: values.topic,
        grade: values.grade,
        objectives: values.objectives,
      });
      if (response && response.plan) {
        let assetId = null;
        // Even if not auto-saving, we create a temporary asset to get an ID for feedback
        assetId = await addAsset({
          type: "Lesson Plan",
          name: `Lesson Plan: ${values.topic}`,
          content: response.plan,
        });

        if (profile?.autoSave && assetId) {
            toast({
              title: "Auto-Saved!",
              description: `Lesson plan for '${values.topic}' saved to your workspace.`,
            });
        }
        setResult({ plan: response.plan, assetId });
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        description: "Failed to generate lesson plan. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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

  const handleGenerateQuiz = () => {
    if (modalContent?.type === 'Assessment') {
        const topic = modalContent.daySubTopic;
        const grade = form.getValues('grade');
        // Navigate to quiz generator with pre-filled state
        router.push(`/quiz-generator?topic=${encodeURIComponent(topic)}&grade=${encodeURIComponent(grade)}`);
    }
  }
  
  const renderModalContent = () => {
    if (!modalContent) return null;
    
    switch (modalContent.type) {
      case 'Activities':
        return (
          <div className="space-y-4">
            {modalContent.data.map((activity: { name: string; duration: string }, index: number) => (
              <div key={index}>
                <h4 className="font-semibold">{activity.name} ({activity.duration})</h4>
              </div>
            ))}
          </div>
        );
      case 'Assessment':
         return (
          <div className="space-y-4">
            <p className="text-muted-foreground">{modalContent.data}</p>
            <Button onClick={handleGenerateQuiz} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Quiz for this Topic
            </Button>
          </div>
        );
      default:
        return <p>Details will be available here.</p>;
    }
  }


  return (
    <>
      <Dialog open={!!modalContent} onOpenChange={() => setModalContent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent?.type}</DialogTitle>
            <DialogDescription>
              Detailed view and actions for this section.
            </DialogDescription>
          </DialogHeader>
          {renderModalContent()}
        </DialogContent>
      </Dialog>

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SpotlightCard className="sticky top-6">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Lesson Planner
              </CardTitle>
              <CardDescription>
                Fill in the details to generate a weekly lesson plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGeneration)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gradeLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Objectives</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Students will be able to name the planets..."
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Plan"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </SpotlightCard>
        </div>

        <div className="lg:col-span-2">
          <SpotlightCard className="min-h-[calc(100vh-10rem)]">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Generated Plan
              </CardTitle>
              <CardDescription>
                Your AI-generated weekly lesson plan will appear here. Click on cards to see details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex h-96 items-center justify-center">
                  <AILoading />
                </div>
              )}
              {result?.plan && (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="item-0"
                >
                  {Object.entries(result.plan).map(([day, details], index) => (
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
                        <SpotlightCard className="cursor-pointer" onClick={() => setModalContent({type: 'Learning Objectives', data: details.learning_objectives, daySubTopic: details.sub_topic})}>
                          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                            <Target className="h-5 w-5 text-primary" />
                            <h4 className="font-headline text-lg font-semibold">
                              Learning Objectives
                            </h4>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <ul className="space-y-2">
                              {details.learning_objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                  <span className="flex-1 text-muted-foreground">
                                    {obj}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </SpotlightCard>

                        <SpotlightCard className="cursor-pointer" onClick={() => setModalContent({type: 'Activities', data: details.activities, daySubTopic: details.sub_topic})}>
                          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                            <ListChecks className="h-5 w-5 text-primary" />
                            <h4 className="font-headline text-lg font-semibold">
                              Activities
                            </h4>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
                            {details.activities.map((act, i) => (
                              <Badge key={i} variant="outline">
                                {act.name} ({act.duration})
                              </Badge>
                            ))}
                          </CardContent>
                        </SpotlightCard>

                        <div className="grid gap-4 md:grid-cols-2">
                          <SpotlightCard className="cursor-pointer" onClick={() => setModalContent({type: 'Resources', data: details.resources, daySubTopic: details.sub_topic})}>
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                              <Paperclip className="h-5 w-5 text-primary" />
                              <h4 className="font-headline text-lg font-semibold">
                                Resources
                              </h4>
                            </CardHeader>
                            <CardContent className="space-y-2 p-4 pt-0">
                              {details.resources.map((res, i) => (
                                <div
                                  key={i}
                                  className="text-sm text-muted-foreground"
                                >
                                  {renderResource(res)}
                                </div>
                              ))}
                            </CardContent>
                          </SpotlightCard>
                          <SpotlightCard className="cursor-pointer" onClick={() => setModalContent({type: 'Assessment', data: details.assessment, daySubTopic: details.sub_topic})}>
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                              <ClipboardCheck className="h-5 w-5 text-primary" />
                              <h4 className="font-headline text-lg font-semibold">
                                Assessment
                              </h4>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground">
                                {details.assessment}
                              </p>
                            </CardContent>
                          </SpotlightCard>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {!isLoading && !result && (
                <div className="flex h-96 flex-col items-center justify-center text-center text-muted-foreground">
                  <BookText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="font-semibold">
                    Your plan is just a few clicks away.
                  </p>
                  <p>Fill out the form and click "Generate Plan".</p>
                </div>
              )}
            </CardContent>
            {result && result.assetId && (
              <CardFooter>
                  <FeedbackCard assetId={result.assetId} assetType="Lesson Plan" />
              </CardFooter>
            )}
          </SpotlightCard>
        </div>
      </div>
    </>
  );
}

    