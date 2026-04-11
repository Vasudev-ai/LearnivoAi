"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useWorkspace } from "@/context/workspace-context";
import {
  Folder,
  PlusCircle,
  Clock,
  Notebook,
  FolderOpen,
  ChevronRight,
  FolderTree,
  Search,
  Grid,
  List,
  SortAsc,
  Filter,
  MoreVertical,
  Trash2,
  Edit3,
  Share2,
  Download,
  FileText,
  Presentation,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import type { Asset, Folder as FolderType } from "@/context/workspace-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AssetViewer, getIconForAssetType } from "@/components/asset-viewer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { SpotlightCard } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  StatsGridSkeleton,
  AssetGridSkeleton,
  SidebarSkeleton,
} from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspacePage() {
  const { folders, assets, addFolder, deleteFolder, deleteAsset, isFoldersLoading, isAssetsLoading } = useWorkspace();
  const { profile } = useUser();
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>('folder-sahayak-assets');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSahayakAssetsOpen, setIsSahayakAssetsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Categorize folders
  const systemFolders = useMemo(() => {
    return folders.filter(f => 
      f.isSystem || 
      ['Math Solutions', 'Digitized Papers', 'Quiz Results', 'Quizs', 'Storys', 'Lesson Plans'].includes(f.name)
    ).sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });
  }, [folders, sortBy]);

  const myFolders = useMemo(() => {
    return folders.filter(f => !systemFolders.find(sf => sf.id === f.id))
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
  }, [folders, systemFolders, sortBy]);

  const currentFolder =
    folders.find((f) => f.id === currentFolderId) ||
    (currentFolderId === 'folder-sahayak-assets'
      ? {
          id: 'folder-sahayak-assets',
          name: 'Sahayak Assets',
          description: 'Default folder for all auto-saved assets, organized by type.',
          createdAt: new Date(),
        }
      : null);

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    const displayAssets = assets.filter((asset) => asset.folderId === currentFolderId);

    if (!searchQuery) return displayAssets;

    return displayAssets.filter((asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolder, currentFolderId, assets, searchQuery]);

  const handleCreateFolder = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    addFolder(name, description);
    setIsFolderDialogOpen(false);
  }, [addFolder]);

  const handleFolderClick = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    setSearchQuery("");
  }, []);

  const handleBreadcrumbClick = useCallback(() => {
    setCurrentFolderId('folder-sahayak-assets');
    setSearchQuery("");
  }, []);

  const handleAssetClick = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  // Stats for header
  const totalAssets = assets.length;
  const totalFolders = folders.length;

  const renderContent = () => {
    if (isFoldersLoading || isAssetsLoading) {
      return <AssetGridSkeleton count={6} />;
    }

    if (!currentFolder) {
      return (
        <EmptyState
          icon={Notebook}
          title="Welcome to your Workspace"
          description="Your AI assistant is ready to help you organize all your content."
        />
      );
    }

    if (currentFolder.id === 'folder-sahayak-assets') {
      return systemFolders.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {systemFolders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
<SpotlightCard
                  className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/30"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-all">
                          <FolderOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{folder.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {folder.assets?.length || 0} items
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="Get Started"
          description="Your AI assistant is ready to help you generate content. Start with any tool and your assets will appear here."
        />
      );
    }

    return filteredAssets.length > 0 ? (
      viewMode === "grid" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredAssets.map((asset: Asset, index: number) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <SpotlightCard
                  className="group cursor-pointer overflow-hidden"
                  onClick={() => handleAssetClick(asset)}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        {getIconForAssetType(asset.type, "h-6 w-6 text-primary")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {asset.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1.5 text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteAsset(asset.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {asset.createdAt?.toDate &&
                          formatDistanceToNow(asset.createdAt.toDate(), {
                            addSuffix: true,
                          })}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          {filteredAssets.map((asset: Asset, index: number) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group"
            >
              <SpotlightCard
                className="cursor-pointer"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {getIconForAssetType(asset.type, "h-5 w-5 text-primary")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.type}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {asset.createdAt?.toDate &&
                      formatDistanceToNow(asset.createdAt.toDate(), {
                        addSuffix: true,
                      })}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )
    ) : searchQuery ? (
      <EmptyState
        icon={Search}
        title="No results found"
        description="Try a different search term."
      />
    ) : (
      <EmptyState
        icon={Notebook}
        title="Ready to Create"
        description="Your AI assistant is here to help. Generate some content and it will appear here."
      />
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                </div>
                My Workspace
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage all your generated content
              </p>
            </div>
            <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">Create New Folder</DialogTitle>
                  <DialogDescription>Organize your assets into custom folders.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFolder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Folder Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Grade 8 Science" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="A brief description of this folder's content."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Create Folder
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAssets}</p>
                  <p className="text-xs text-muted-foreground">Total Assets</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalFolders}</p>
                  <p className="text-xs text-muted-foreground">Folders</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{[...new Set(assets.map(a => a.type))].length}</p>
                  <p className="text-xs text-muted-foreground">Asset Types</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Today</p>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <SpotlightCard className="h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-primary" />
                    Folders
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SortAsc className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("name")}>
                        Sort by Name {sortBy === "name" && "✓"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("date")}>
                        Sort by Date {sortBy === "date" && "✓"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent ref={sidebarRef} className="p-2 pt-0">
                <div className="flex flex-col gap-1">
                  {myFolders.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        My Folders
                      </div>
                      {myFolders.map((folder) => (
                        <div key={folder.id} className="group flex items-center gap-1">
                          <Button
                            variant={currentFolderId === folder.id ? "secondary" : "ghost"}
                            className={cn(
                              "flex-1 justify-start gap-3 h-auto py-2",
                              currentFolderId === folder.id && "bg-primary/10 text-primary hover:bg-primary/20"
                            )}
                            onClick={() => handleFolderClick(folder.id)}
                          >
                            <Folder className="h-4 w-4 shrink-0" />
                            <span className="truncate">{folder.name}</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteFolder(folder.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </>
                  )}

                  <Separator className="my-2" />

                  <Collapsible open={isSahayakAssetsOpen} onOpenChange={setIsSahayakAssetsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={currentFolderId === 'folder-sahayak-assets' ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          currentFolderId === 'folder-sahayak-assets' && "bg-primary/10 text-primary"
                        )}
                        onClick={() => handleFolderClick('folder-sahayak-assets')}
                      >
                        <LayoutGrid className="h-4 w-4 shrink-0" />
                        <span className="truncate flex-1 text-left">Sahayak Assets</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform",
                            isSahayakAssetsOpen && "rotate-90"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 py-1 pl-4">
                      {systemFolders.map((folder) => (
                        <div key={folder.id} className="group flex items-center gap-1">
                          <Button
                            variant={currentFolderId === folder.id ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "flex-1 justify-start gap-2 text-sm",
                              currentFolderId === folder.id && "bg-primary/10 text-primary"
                            )}
                            onClick={() => handleFolderClick(folder.id)}
                          >
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="truncate">{folder.name}</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteFolder(folder.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </SpotlightCard>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3"
          >
            <SpotlightCard className="h-full">
              <CardContent className="p-6">
                {currentFolder && (
                  <>
                    {/* Breadcrumb & Actions */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <Breadcrumb>
                          <BreadcrumbList>
                            <BreadcrumbItem>
                              <BreadcrumbLink onClick={handleBreadcrumbClick} className="cursor-pointer hover:text-primary">
                                Sahayak Assets
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            {currentFolder.id !== 'folder-sahayak-assets' && (
                              <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                  <BreadcrumbPage className="text-primary font-medium">
                                    {currentFolder.name}
                                  </BreadcrumbPage>
                                </BreadcrumbItem>
                              </>
                            )}
                          </BreadcrumbList>
                        </Breadcrumb>
                        
                        {currentFolder.id !== 'folder-sahayak-assets' && (
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search assets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-48"
                              />
                            </div>
                            <div className="flex items-center gap-1 border rounded-lg p-1">
                              <Button
                                variant={viewMode === "grid" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setViewMode("grid")}
                              >
                                <Grid className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={viewMode === "list" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setViewMode("list")}
                              >
                                <List className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{currentFolder.description}</p>
                    </div>

                    {/* Content */}
                    {renderContent()}
                  </>
                )}
              </CardContent>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>

      <AssetViewer
        asset={selectedAsset}
        open={!!selectedAsset}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedAsset(null);
          }
        }}
      />
    </>
  );
}
