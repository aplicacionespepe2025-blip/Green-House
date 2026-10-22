import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserPlant } from '../types';

const LOCAL_STORAGE_KEY = 'vivero_mi_jardin_local';

export function getLocalGarden(): UserPlant[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalGarden(items: UserPlant[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local garden:', e);
  }
}

export function subscribeToUserGarden(
  userId: string | null,
  onUpdate: (plants: UserPlant[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!userId) {
    // Guest user uses localStorage
    onUpdate(getLocalGarden());
    const interval = setInterval(() => {
      onUpdate(getLocalGarden());
    }, 2000);
    return () => clearInterval(interval);
  }

  const subCol = collection(db, 'users', userId, 'garden');
  const unsubscribe = onSnapshot(
    subCol,
    (snapshot) => {
      const list: UserPlant[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as UserPlant);
      });
      // Merge with any local storage items if first time
      const local = getLocalGarden();
      if (list.length === 0 && local.length > 0) {
        local.forEach((item) => {
          setDoc(doc(db, 'users', userId, 'garden', item.id), item).catch(console.error);
        });
        onUpdate(local);
      } else {
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Garden snapshot note, using local:', error.message);
      onUpdate(getLocalGarden());
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.GET, `users/${userId}/garden`);
        } catch (e) {
          onError(e as Error);
        }
      }
    }
  );

  return unsubscribe;
}

export async function addPlantToGarden(
  userId: string | null,
  item: Omit<UserPlant, 'id' | 'addedAt'>
): Promise<string> {
  const id = 'myplant-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const newItem: UserPlant = {
    ...item,
    id,
    addedAt: new Date().toISOString(),
  };

  if (!userId) {
    const local = getLocalGarden();
    local.push(newItem);
    saveLocalGarden(local);
    return id;
  }

  const path = `users/${userId}/garden/${id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'garden', id), newItem);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function waterPlantRecord(userId: string | null, plantRecordId: string): Promise<void> {
  const today = new Date().toISOString();

  if (!userId) {
    const local = getLocalGarden();
    const updated = local.map((p) => (p.id === plantRecordId ? { ...p, lastWatered: today } : p));
    saveLocalGarden(updated);
    return;
  }

  const path = `users/${userId}/garden/${plantRecordId}`;
  try {
    await updateDoc(doc(db, 'users', userId, 'garden', plantRecordId), {
      lastWatered: today,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function removePlantFromGarden(userId: string | null, plantRecordId: string): Promise<void> {
  if (!userId) {
    const local = getLocalGarden().filter((p) => p.id !== plantRecordId);
    saveLocalGarden(local);
    return;
  }

  const path = `users/${userId}/garden/${plantRecordId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'garden', plantRecordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
