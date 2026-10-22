import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Inquiry } from '../types';

const COLLECTION_NAME = 'inquiries';

export async function submitInquiry(data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const inquiryId = 'inq-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const path = `${COLLECTION_NAME}/${inquiryId}`;

  const item: Inquiry = {
    ...data,
    id: inquiryId,
    status: 'nuevo',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, inquiryId), item);
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export function subscribeToInquiries(
  onUpdate: (inquiries: Inquiry[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      onUpdate(list);
    },
    (error) => {
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

export async function updateInquiryStatus(id: string, status: 'nuevo' | 'atendido' | 'archivado'): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
