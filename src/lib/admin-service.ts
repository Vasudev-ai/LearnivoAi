
import { adminDb } from './firebase-admin';

export interface UsageSummary {
  totalTokens: number;
  totalCredits: number;
  totalRequests: number;
  toolsDistribution: Record<string, number>;
  topUsers: { email: string; credits: number; name: string }[];
}

/**
 * Fetches all usage logs and aggregates them for the dashboard.
 * In a real-scale app, you'd use aggregation queries or scheduled tasks,
 * but for a personalized dashboard, this is efficient.
 */
export async function getAdminAnalytics() {
  try {
    const logsSnapshot = await adminDb.collection('usage_logs')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const stats = {
      totalTokens: 0,
      totalCredits: 0,
      totalRequests: logsSnapshot.size,
      toolUsage: {} as Record<string, number>,
    };

    logs.forEach((log: any) => {
      stats.totalTokens += log.totalTokens || 0;
      stats.totalCredits += log.creditsUsed || 0;
      const tool = log.toolName || 'Unknown';
      stats.toolUsage[tool] = (stats.toolUsage[tool] || 0) + 1;
    });

    const usersSnapshot = await adminDb.collection('userProfiles')
      .orderBy('credits', 'desc')
      .limit(10)
      .get();

    const topUsers = usersSnapshot.docs.map(doc => ({
      name: doc.data().name,
      email: doc.data().email,
      credits: doc.data().credits || 0,
      role: doc.data().role,
    }));

    return {
      recentLogs: logs,
      stats,
      topUsers
    };
  } catch (error) {
    console.error('[AdminService] Error fetching analytics:', error);
    throw error;
  }
}
