import { DAILY_CREDITS, MAX_CREDITS } from './credit-service';

export interface DefaultUserProfile {
  id?: string;
  email: string;
  name: string;
  role: 'Teacher' | 'Student';
  hasCompletedOnboarding: boolean;
  profilePicture?: string;
  autoSave: boolean;
  credits: number;
  credits_daily: number;
  credits_monthly: number;
  credits_lastDailyReset: string;
  creativityLevel: 'precise' | 'balanced' | 'creative';
  defaultLanguage: string;
  defaultGrade: string;
  isPremium: boolean;
  subscriptionPlan: 'free' | 'premium';
}

export function getDefaultUserProfile(
  email: string,
  name: string,
  role: 'Teacher' | 'Student',
  profilePicture?: string
): DefaultUserProfile {
  return {
    email,
    name,
    role,
    hasCompletedOnboarding: false,
    ...(profilePicture ? { profilePicture } : {}),
    autoSave: true,
    credits: DAILY_CREDITS,
    credits_daily: DAILY_CREDITS,
    credits_monthly: MAX_CREDITS,
    credits_lastDailyReset: new Date().toISOString(),
    creativityLevel: 'balanced',
    defaultLanguage: 'English',
    defaultGrade: '',
    isPremium: false,
    subscriptionPlan: 'free',
  };
}
