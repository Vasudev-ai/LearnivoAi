import { adminDb } from './firebase-admin';
import { USAGE_COLLECTION } from './usage-service';

export async function getAdminAnalytics() {
  try {
    // 1. Fetch Aggregated Stats (Optimized: Single Document Read)
    const statsDoc = await adminDb.collection('system_stats').doc('global').get();
    const stats = statsDoc.exists ? statsDoc.data() : {
      totalTokens: 0,
      totalCredits: 0,
      totalRequests: 0,
      toolUsage: {}
    };

    // 2. Fetch Recent Logs (Limited to 20 for cost/performance)
    const logsSnapshot = await adminDb.collection(USAGE_COLLECTION)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const recentLogs = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
      };
    });

    return {
      stats,
      recentLogs
    };
  } catch (error: any) {
    console.error('[AdminService] Error fetching analytics:', error);
    return {
      stats: { totalTokens: 0, totalCredits: 0, totalRequests: 0, toolUsage: {} },
      recentLogs: []
    };
  }
}
