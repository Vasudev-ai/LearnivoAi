'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser as useFirebaseUser } from '@/firebase/provider';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { UserProfile } from '@/firebase/provider';

const PROFILE_QUERY_KEY = ['user-profile'] as const;

export function useCachedUser() {
  const { user, profile, isProfileLoading, profileError } = useFirebaseUser();
  const queryClient = useQueryClient();

  const queryKey = [...PROFILE_QUERY_KEY, user?.uid] as const;

  const cachedProfile = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user || !profile) return null;
      return profile;
    },
    enabled: !!profile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: profile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const firestore = useFirestore();
      if (!user || !firestore) throw new Error('User not authenticated');
      const profileRef = doc(firestore, 'userProfiles', user.uid);
      await updateDoc(profileRef, data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old: typeof profile) => {
        if (!old) return data;
        return { ...old, ...data };
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    user,
    profile: cachedProfile.data || profile,
    isProfileLoading,
    profileError,
    isProfileCached: cachedProfile.isStale === false,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
