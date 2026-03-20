"use client";

import Image from "next/image";
import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Building,
  Edit,
  GraduationCap,
  Book,
  Star,
  Mail,
  Calendar,
  MapPin,
  Award,
  Clock,
  FileText,
  Sparkles,
  User,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SpotlightCard } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentCreditLogs, CreditLogEntry, getToolIcon, getToolLink } from "@/lib/credit-service";
import { Zap, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const { profile, isProfileLoading } = useUser();
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [recentActivity, setRecentActivity] = useState<CreditLogEntry[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const defaultCover = PlaceHolderImages.find((img) => img.id === "hero-image");
    setCoverUrl(profile?.coverUrl || defaultCover?.imageUrl);
  }, [profile]);

  useEffect(() => {
    if (profile?.id) {
      setLoadingActivity(true);
      getRecentCreditLogs(profile.id, 5).then((logs) => {
        setRecentActivity(logs);
        setLoadingActivity(false);
      });
    }
  }, [profile?.id]);

  const isTeacher = profile?.role === "Teacher";

  // Profile Hero Skeleton
  const ProfileHeroSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6">
        <div className="flex items-end gap-6 -mt-20">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          <div className="flex-1 space-y-2 pb-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Stats Card Skeleton
  const StatsCardSkeleton = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      {/* Hero Section with Cover */}
      <AnimatePresence mode="wait">
        {isProfileLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfileHeroSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SpotlightCard className="overflow-hidden border-0">
          {/* Cover Image */}
          <div className="relative h-56 w-full overflow-hidden">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt="Profile cover"
                fill
                className="object-cover"
                data-ai-hint="abstract background"
                unoptimized={coverUrl.startsWith("blob:") ? true : undefined}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-lime-500/20 via-lime-500/5 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              {/* Avatar & Name */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-16 sm:-mt-20">
                <div className="relative">
                  <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background shadow-2xl ring-2 ring-lime-500/20">
                    {profile?.profilePicture && (
                      <AvatarImage src={profile.profilePicture} />
                    )}
                    <AvatarFallback className="text-3xl sm:text-4xl bg-gradient-to-br from-lime-500/20 to-lime-500/5 text-lime-500">
                      {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-lime-500 border-4 border-background flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold font-headline">
                    {profile?.name || "User Name"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">
                      {profile?.instituteName || "Institution not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-lime-500/10 text-lime-500 border-lime-500/20"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isTeacher ? "Teacher" : "Student"}
                    </Badge>
                    {isTeacher && profile?.subjects && (
                      <Badge variant="outline" className="text-xs">
                        {profile.subjects}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="outline"
                className="shrink-0 border-lime-500/20 hover:bg-lime-500/10 hover:border-lime-500/40"
                asChild
              >
                <Link href="/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid - Teachers Only */}
      {isTeacher && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: "Lessons", value: "24", icon: FileText },
            { label: "Quizzes", value: "12", icon: Award },
            { label: "Students", value: "156", icon: GraduationCap },
            { label: "Hours Saved", value: "48", icon: Clock },
          ].map((stat, index) => (
            <SpotlightCard key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-lime-500/10">
                  <stat.icon className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - About & Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* About Section */}
          <SpotlightCard>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-lime-500" />
                <CardTitle className="font-headline text-xl">About</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {isTeacher
                  ? `Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching ${
                      profile?.subjects || "various subjects"
                    }. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.`
                  : `Enthusiastic and curious learner, currently enrolled in ${
                      profile?.class || "a class"
                    } and exploring the world of ${
                      profile?.stream || "academics"
                    }. Passionate about discovering new concepts and using AI tools to accelerate learning.`}
              </p>
            </CardContent>
          </SpotlightCard>

          {/* Usage Stats Section */}
          <SpotlightCard>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-lime-500" />
                <CardTitle className="font-headline text-xl">
                  Usage Overview
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-lime-500/10 flex items-center justify-center">
                      <Award className="h-4 w-4 text-lime-500" />
                    </div>
                    <span className="text-sm font-medium">AI Tools Used</span>
                  </div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-lime-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-lime-500" />
                    </div>
                    <span className="text-sm font-medium">Time Saved</span>
                  </div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-lime-500/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-lime-500" />
                    </div>
                    <span className="text-sm font-medium">Resources</span>
                  </div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground mt-1">Created</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-lime-500/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-lime-500" />
                    </div>
                    <span className="text-sm font-medium">AI Tokens</span>
                  </div>
                  <p className="text-2xl font-bold">2.4k</p>
                  <p className="text-xs text-muted-foreground mt-1">Processed</p>
                </div>
              </div>
            </CardContent>
          </SpotlightCard>

          {/* Recent Activity Section */}
          <SpotlightCard>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-lime-500" />
                  <CardTitle className="font-headline text-xl">
                    Recent Activity
                  </CardTitle>
                </div>
                {recentActivity.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {recentActivity.length} recent
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <Link
                      key={activity.id}
                      href={getToolLink(activity.toolName)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {getToolIcon(activity.toolName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.toolName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Zap className="h-3 w-3" />
                          <span className="font-medium">-{activity.creditsUsed}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs">Start using AI tools to see your history here</p>
                </div>
              )}
            </CardContent>
          </SpotlightCard>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Details Card */}
          <SpotlightCard>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-lime-500" />
                <CardTitle className="font-headline text-xl">Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Institution */}
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Institution</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.instituteName || "Not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Role-specific Details */}
              {isTeacher ? (
                <>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Subjects</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.subjects || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.experience || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Qualification</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.qualification || "Not specified"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Class</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.class || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Book className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Stream</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.stream || "Not specified"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Account Info */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.email || "Not available"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-lime-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">March 2026</p>
                </div>
              </div>
            </CardContent>
          </SpotlightCard>

          {/* Quick Actions */}
          <SpotlightCard className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {isTeacher ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-lime-500/20 hover:bg-lime-500/10"
                    asChild
                  >
                    <Link href="/lesson-planner">
                      <FileText className="h-4 w-4" />
                      Create Lesson Plan
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-lime-500/20 hover:bg-lime-500/10"
                    asChild
                  >
                    <Link href="/quiz-generator">
                      <Award className="h-4 w-4" />
                      Generate Quiz
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-lime-500/20 hover:bg-lime-500/10"
                  asChild
                >
                  <Link href="/knowledge-base">
                    <Book className="h-4 w-4" />
                    Ask AI Assistant
                  </Link>
                </Button>
              )}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
