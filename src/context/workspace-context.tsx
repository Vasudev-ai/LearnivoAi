
"use client";

import React, { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from "@/firebase";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export type Asset = {
  id: string;
  type: string;
  name: string;
  content: any;
  createdAt: any; // Can be Date or FieldValue
  folderId?: string; // Optional folder ID
};

export type Folder = {
  id: string;
  name: string;
  description: string;
  createdAt: any; // Can be Date or FieldValue
  assets: Asset[]; // Assets are now nested
};

interface WorkspaceState {
  folders: Folder[];
  assets: Asset[]; // This will hold all assets for easy lookup
  isFoldersLoading: boolean;
  isAssetsLoading: boolean;
  addFolder: (name: string, description: string) => Promise<string | null>;
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => Promise<string | null>;
}

const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, isUserLoading, isProfileLoading } = useUser();
  const firestore = useFirestore();

  const foldersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "userProfiles", user.uid, "folders"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const assetsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "userProfiles", user.uid, "assets"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: foldersData, isLoading: isFoldersLoading } = useCollection<Omit<Folder, 'assets'>>(foldersQuery);
  const { data: assetsData, isLoading: isAssetsLoading } = useCollection<Asset>(assetsQuery);
  
  const addFolder = useCallback(async (name: string, description: string) => {
    if (!firestore || !user) return null;
    const foldersCol = collection(firestore, "userProfiles", user.uid, "folders");
    const newDocRef = await addDoc(foldersCol, {
      name,
      description,
      createdAt: serverTimestamp(),
    });
    return newDocRef.id;
  }, [firestore, user]);

  const addAsset = useCallback(async (asset: Omit<Asset, "id" | "createdAt">): Promise<string | null> => {
    if (!firestore || !user) return null;
    
    // Auto-create a folder for the asset type if it doesn't exist
    const assetTypeFolderName = asset.type.endsWith('s') ? asset.type : `${asset.type}s`;
    const existingFolders = foldersData || [];
    let folder = existingFolders.find(f => f.name === assetTypeFolderName);
    let folderId = folder?.id;

    if (!folderId) {
      const newFolderId = await addFolder(assetTypeFolderName, `All generated ${asset.type}s`);
      if (!newFolderId) return null;
      folderId = newFolderId;
    }
    
    const assetsCol = collection(firestore, "userProfiles", user.uid, "assets");
    const newDocRef = await addDoc(assetsCol, {
      ...asset,
      folderId: folderId,
      createdAt: serverTimestamp(),
    });
    return newDocRef.id;
  }, [firestore, user, foldersData, addFolder]);

  const foldersWithAssets = useMemo(() => {
    if (!foldersData || !assetsData) return [];
    
    const assetMap = (assetsData || []).reduce((acc, asset) => {
        const folderId = asset.folderId || 'unorganized';
        if (!acc[folderId]) {
            acc[folderId] = [];
        }
        acc[folderId].push(asset);
        return acc;
    }, {} as Record<string, Asset[]>);

    return foldersData.map(folder => ({
        ...folder,
        assets: assetMap[folder.id] || []
    }));
  }, [foldersData, assetsData]);


  const value = useMemo(
    () => ({
      folders: foldersWithAssets,
      assets: assetsData || [],
      isFoldersLoading: isFoldersLoading || isUserLoading || isProfileLoading,
      isAssetsLoading: isAssetsLoading || isUserLoading || isProfileLoading,
      addFolder,
      addAsset,
    }),
    [foldersWithAssets, assetsData, isFoldersLoading, isAssetsLoading, isUserLoading, isProfileLoading, addFolder, addAsset]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
