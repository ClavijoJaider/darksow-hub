/**
 * Sistema de eventos para sincronización en tiempo real de localStorage
 */

type StorageEventType = 'users' | 'forum_posts' | 'forum_comments' | 'forum_categories' | 'news';

class StorageEventEmitter {
  private listeners: Map<StorageEventType, Set<() => void>> = new Map();

  subscribe(eventType: StorageEventType, callback: () => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  emit(eventType: StorageEventType) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

export const storageEvents = new StorageEventEmitter();
