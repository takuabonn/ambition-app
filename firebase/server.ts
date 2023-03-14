import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "../adminServiceAccount.json";
const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const serverDB = getFirestore(app);
