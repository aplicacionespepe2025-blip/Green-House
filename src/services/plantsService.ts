import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Plant } from '../types';
import { INITIAL_PLANTS } from '../data/initialPlants';

const COLLECTION_NAME = 'plants';

export async function seedInitialPlantsIfEmpty(): Promise<Plant[]> {
  try {
    const plantsCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(plantsCollection);
    
    if (snapshot.empty) {
      console.log('Seeding initial 17 plants to Firestore...');
      for (const plant of INITIAL_PLANTS) {
        await setDoc(doc(db, COLLECTION_NAME, plant.id), {
          ...plant,
          updatedAt: new Date().toISOString(),
        });
      }
      return INITIAL_PLANTS;
    } else {
      const list: Plant[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Plant);
      });
      return list;
    }
  } catch (error) {
    console.warn('Could not connect or write to remote Firestore directly, falling back to local dataset:', error);
    return INITIAL_PLANTS;
  }
}

export function subscribeToPlants(
  onUpdate: (plants: Plant[]) => void,
  onError?: (error: Error) => void
): () => void {
  const plantsCollection = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    plantsCollection,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to initial plants if remote collection is empty
        onUpdate(INITIAL_PLANTS);
      } else {
        const list: Plant[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Plant);
        });
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Snapshot listener error on plants, using local plants:', error.message);
      onUpdate(INITIAL_PLANTS);
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
        } catch (e) {
          onError(e as Error);
        }
      }
    }
  );

  return unsubscribe;
}

export async function addPlant(plant: Omit<Plant, 'id'> & { id?: string }): Promise<string> {
  const plantId = plant.id || plant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Date.now().toString(36);
  const path = `${COLLECTION_NAME}/${plantId}`;
  
  const newPlant: Plant = {
    ...plant,
    id: plantId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, plantId), newPlant);
    return plantId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updatePlant(id: string, plantData: Partial<Plant>): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...plantData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function togglePlantStock(id: string, currentStock: boolean): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      inStock: !currentStock,
      stockCount: !currentStock ? 10 : 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deletePlant(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function resetCatalogToDefault(): Promise<void> {
  for (const plant of INITIAL_PLANTS) {
    await setDoc(doc(db, COLLECTION_NAME, plant.id), {
      ...plant,
      updatedAt: new Date().toISOString(),
    });
  }
}
