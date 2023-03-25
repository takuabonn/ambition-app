import { DocumentData, DocumentReference } from "firebase/firestore";

export type UserInfo = {
  uid: string;
  name: string;
  userDocRef: DocumentReference<DocumentData>;
  avatar_image_url: string;
};
