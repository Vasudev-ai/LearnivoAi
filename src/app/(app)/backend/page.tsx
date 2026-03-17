
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { getAnalyticsAction, updateUserCreditsAction } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Users, 
  Zap, 
  ShieldAlert, 
  Search, 
  RefreshCcw,
  BarChart3,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BackendDashboard() {
  const { profile, user } = useUser();
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = profile?.email === "suryatutor48@gmail.com";

  const fetchData = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      const analytics = await getAnalyticsAction(profile.email);
      setData(analytics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !data && !refreshing) {
      fetchData();
    }
  }, [profile?.email, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          This area is restricted to administrators only. Your attempt has been logged.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Backend</h1>
          <p className="text-muted-foreground">Monitor system usage and user credits.</p>
        </div>
        <Button onClick={fetchData} disabled={refreshing} variant="outline" className="gap-2">
          <RefreshCcw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Reload Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-sidebar/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Used across all tools</p>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total system "burn"</p>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Last 100 generations</p>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.topUsers.length}</div>
            <p className="text-xs text-muted-foreground">Top contributors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Users Table */}
        <Card className="bg-sidebar/50 border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Credits Management
            </CardTitle>
            <CardDescription>Top 10 users by current credit balance.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.topUsers.map((u: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <div>{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">{u.role}</td>
                      <td className="px-6 py-4 text-right font-mono text-primary">{u.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="bg-sidebar/50 border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent System Activity
            </CardTitle>
            <CardDescription>Real-time audit of the last 10 requests.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Tool</th>
                    <th className="px-6 py-3">Tokens</th>
                    <th className="px-6 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.recentLogs.slice(0, 10).map((log: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{log.toolName}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-muted-foreground">In: {log.inputTokens}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">Out: {log.outputTokens}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs">
                        {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function needed for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
