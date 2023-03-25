import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { serverDB } from "../../firebase/server";

export const countUpOnSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document("ambitions/{ambitionID}/supportedUsers/{supportedUserID}")
  .onCreate(async (snap, context) => {
    const batch = serverDB.batch();
    batch.update(serverDB.doc(`ambitions/${context.params.ambitionID}`), {
      support_count: admin.firestore.FieldValue.increment(1),
    });
    await batch.commit();
  });

export const countDownOnunSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document("ambitions/{ambitionID}/supportedUsers/{supportedUserID}")
  .onDelete(async (snap, context) => {
    const batch = serverDB.batch();
    batch.update(serverDB.doc(`ambitions/${context.params.ambitionID}`), {
      support_count: admin.firestore.FieldValue.increment(-1),
    });
    await batch.commit();
  });
