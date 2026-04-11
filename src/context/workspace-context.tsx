
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
  deleteDoc,
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
  isSystem?: boolean; // To distinguish auto-generated folders
};

interface WorkspaceState {
  folders: Folder[];
  assets: Asset[]; // This will hold all assets for easy lookup
  isFoldersLoading: boolean;
  isAssetsLoading: boolean;
  addFolder: (name: string, description: string, isSystem?: boolean) => Promise<string | null>;
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => Promise<string | null>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  updateFolder: (folderId: string, data: Partial<Folder>) => Promise<void>;
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
  
  const addFolder = useCallback(async (name: string, description: string, isSystem: boolean = false) => {
    if (!firestore || !user) return null;
    const foldersCol = collection(firestore, "userProfiles", user.uid, "folders");
    const newDocRef = await addDoc(foldersCol, {
      name,
      description,
      isSystem,
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
      const newFolderId = await addFolder(assetTypeFolderName, `All generated ${asset.type}s`, true);
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

  const deleteFolder = useCallback(async (folderId: string) => {
    if (!firestore || !user) return;
    
    // In a real app, we might want to also delete assets inside or move them to unorganized
    // For now, let's just delete the folder
    await deleteDoc(doc(firestore, "userProfiles", user.uid, "folders", folderId));
    
    // Also mark assets in this folder as unorganized
    const assetsInFolder = assetsData?.filter(a => a.folderId === folderId) || [];
    for (const asset of assetsInFolder) {
        await updateDoc(doc(firestore, "userProfiles", user.uid, "assets", asset.id), {
            folderId: null
        });
    }
  }, [firestore, user, assetsData]);

  const deleteAsset = useCallback(async (assetId: string) => {
    if (!firestore || !user) return;
    await deleteDoc(doc(firestore, "userProfiles", user.uid, "assets", assetId));
  }, [firestore, user]);

  const updateFolder = useCallback(async (folderId: string, data: Partial<Folder>) => {
    if (!firestore || !user) return;
    await updateDoc(doc(firestore, "userProfiles", user.uid, "folders", folderId), data);
  }, [firestore, user]);

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
      deleteFolder,
      deleteAsset,
      updateFolder,
    }),
    [foldersWithAssets, assetsData, isFoldersLoading, isAssetsLoading, isUserLoading, isProfileLoading, addFolder, addAsset, deleteFolder, deleteAsset, updateFolder]
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
