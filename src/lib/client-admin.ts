import type { UserProfile } from '@/firebase/provider';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "suryatutor48@gmail.com";

export function isAdmin(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return profile.email === ADMIN_EMAIL;
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}
