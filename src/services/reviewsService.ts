import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialPlants';

const COLLECTION_NAME = 'reviews';

export function subscribeToReviews(
  onUpdate: (reviews: Review[]) => void,
  onError?: (error: Error) => void
): () => void {
  const reviewsCollection = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    reviewsCollection,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_REVIEWS);
      } else {
        const list: Review[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Review);
        });
        // Combine or show list, fallback to initial if needed
        onUpdate(list.length > 0 ? list : INITIAL_REVIEWS);
      }
    },
    (error) => {
      console.warn('Reviews snapshot notice:', error.message);
      onUpdate(INITIAL_REVIEWS);
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

export async function addReview(review: Omit<Review, 'id'>): Promise<string> {
  const reviewId = 'rev-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const path = `${COLLECTION_NAME}/${reviewId}`;

  const newReview: Review = {
    ...review,
    id: reviewId,
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, reviewId), newReview);
    return reviewId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}
