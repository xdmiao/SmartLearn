
const STORAGE_KEY = 'smart_learn_mastered_ids';

// 使用动态 Hostname，确保在手机端访问 IP 地址时（如 192.168.1.5）能正确请求到后端，而不是请求手机的 localhost
const API_PORT = 3002;
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${hostname}:${API_PORT}/api/mastery`;

/**
 * Database Service (Hybrid: MySQL + LocalStorage)
 * - Reads: Tries Server first (Source of Truth), falls back to LocalStorage (Cache).
 * - Writes: Updates LocalStorage immediately (Optimistic), then syncs to Server.
 */
export const dbService = {
  /**
   * Optional health check
   */
  init: async () => true,

  /**
   * Helper to parse LocalStorage safely
   */
  _getLocalIds: (): Set<string> => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) return new Set();
      const parsed = JSON.parse(item);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to parse local mastery data:", error);
      return new Set();
    }
  },

  /**
   * Helper to save to LocalStorage
   */
  _saveLocalIds: (ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  },

  /**
   * Get all mastered question IDs
   * Strategy: Try to fetch from API. If successful, update LocalStorage and return.
   * If API fails, return LocalStorage data (Offline mode).
   */
  getAllMasteredIds: async (): Promise<Set<string>> => {
    // 1. Prepare Local Data
    let ids = dbService._getLocalIds();

    // 2. Try Server Sync
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const serverIds: string[] = await response.json();
        ids = new Set(serverIds);
        // Update Local Cache with Truth from Server
        dbService._saveLocalIds(ids);
      } else {
        console.warn(`Server returned ${response.status}, using local data.`);
      }
    } catch (error) {
      console.warn("Backend unavailable, using local data (Offline Mode).");
    }

    return ids;
  },

  /**
   * Add a question to mastered list
   */
  addMastery: async (questionId: string): Promise<void> => {
    // 1. Optimistic Local Update
    const ids = dbService._getLocalIds();
    ids.add(questionId);
    dbService._saveLocalIds(ids);

    // 2. Background Server Sync
    try {
      await fetch(`${API_BASE_URL}/${questionId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.warn(`Failed to sync addMastery(${questionId}) to server`, error);
      // We don't throw here to keep the UI responsive/optimistic
    }
  },

  /**
   * Remove a question from mastered list
   */
  removeMastery: async (questionId: string): Promise<void> => {
    // 1. Optimistic Local Update
    const ids = dbService._getLocalIds();
    ids.delete(questionId);
    dbService._saveLocalIds(ids);

    // 2. Background Server Sync
    try {
      await fetch(`${API_BASE_URL}/${questionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn(`Failed to sync removeMastery(${questionId}) to server`, error);
    }
  },

  /**
   * Toggle mastery status
   */
  toggleMastery: async (questionId: string, currentStatus: boolean): Promise<boolean> => {
    if (currentStatus) {
      await dbService.removeMastery(questionId);
      return false;
    } else {
      await dbService.addMastery(questionId);
      return true;
    }
  }
};
