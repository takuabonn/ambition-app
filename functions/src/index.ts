import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { serverDB } from "../../firebase/server";

export const countUpOnSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document(
    "users/{userID}/myAmbitions/{ambitionID}/supportedUsers/{supportedUserID}"
  )
  .onCreate(async (snap, context) => {
    const batch = serverDB.batch();
    const myAmbitionRef = serverDB
      .collection("users")
      .doc(context.params.userID)
      .collection("myAmbitions")
      .doc(context.params.ambitionID);

    batch.update(myAmbitionRef, {
      support_count: admin.firestore.FieldValue.increment(1),
    });

    const querySnapshot = await serverDB
      .collectionGroup("supportedAmbitions")
      .where("ambition_id", "==", context.params.ambitionID)
      .get();

    querySnapshot.docs.forEach((docSnapshot) => {
      batch.update(docSnapshot.ref, {
        support_count: admin.firestore.FieldValue.increment(1),
      });
    });

    await batch.commit();
  });

export const countDownOnunSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document(
    "users/{userID}/myAmbitions/{ambitionID}/supportedUsers/{supportedUserID}"
  )
  .onDelete(async (snap, context) => {
    const batch = serverDB.batch();
    const myAmbitionRef = serverDB
      .collection("users")
      .doc(context.params.userID)
      .collection("myAmbitions")
      .doc(context.params.ambitionID);

    batch.update(myAmbitionRef, {
      support_count: admin.firestore.FieldValue.increment(-1),
    });

    const querySnapshot = await serverDB
      .collectionGroup("supportedAmbitions")
      .where("ambition_id", "==", context.params.ambitionID)
      .get();

    querySnapshot.docs.forEach((docSnapshot) => {
      batch.update(docSnapshot.ref, {
        support_count: admin.firestore.FieldValue.increment(-1),
      });
    });
    await batch.commit();
  });
