import { useEffect, useState } from 'react';
import { storageEvents } from '@/lib/storage-events';

/**
 * Hook para sincronizar componentes con cambios en localStorage
 */
export function useStorageSync<T>(
  key: 'users' | 'forum_posts' | 'forum_comments' | 'forum_categories' | 'news',
  getData: () => T
) {
  const [data, setData] = useState<T>(getData());

  useEffect(() => {
    const unsubscribe = storageEvents.subscribe(key, () => {
      setData(getData());
    });

    return unsubscribe;
  }, [key, getData]);

  return data;
}
