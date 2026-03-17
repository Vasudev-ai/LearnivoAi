
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
 * Uses a pre-aggregated stats document to save significant read costs.
 */
export async function getAdminAnalytics() {
  try {
    // 1. Fetch Aggregated Stats (1 Read vs 100s)
    const statsDoc = await adminDb.collection('system_stats').doc('global').get();
    const statsData = statsDoc.exists ? statsDoc.data() : null;

    // 2. Fetch Recent Logs (Limited to 20 for cost efficiency)
    const logsSnapshot = await adminDb.collection('usage_logs')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const stats = {
      totalTokens: statsData?.totalTokens || 0,
      totalCredits: statsData?.totalCredits || 0,
      totalRequests: statsData?.totalRequests || 0,
      toolUsage: statsData?.toolUsage || {},
    };

    let topUsers: any[] = [];
    try {
      const usersSnapshot = await adminDb.collection('userProfiles')
        .orderBy('credits', 'desc')
        .limit(10)
        .get();

      if (usersSnapshot && !usersSnapshot.empty) {
        topUsers = usersSnapshot.docs.map(doc => ({
          name: doc.data().name || 'Unknown',
          email: doc.data().email || 'No Email',
          credits: doc.data().credits || 0,
          role: doc.data().role || 'User',
        }));
      }
    } catch (e) {
      console.warn('[AdminService] UserProfiles collection might be empty or missing index:', e);
    }

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
