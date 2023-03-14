import * as admin from "firebase-admin";
import { Transaction } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { serverDB } from "../../firebase/server";

export const countUpOnSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document(
    "users/{userID}/myAmbitions/{ambitionID}/supportedUsers/{supportedUserID}"
  )
  .onCreate((snap, context) => {
    serverDB.runTransaction(async (transaction: Transaction) => {
      const myAmbitionRef = serverDB
        .collection("users")
        .doc(context.params.userID)
        .collection("myAmbitions")
        .doc(context.params.ambitionID);

      await transaction.update(myAmbitionRef, {
        support_count: admin.firestore.FieldValue.increment(1),
      });

      const querySnapshot = await serverDB
        .collection("users")
        .doc(context.params.userID)
        .collection("suppotedAmbitions")
        .where("ambition_id", "==", context.params.ambitionID)
        .get();
      querySnapshot.docs.forEach(async (docSnapshot) => {
        await transaction.update(docSnapshot.ref, {
          support_count: admin.firestore.FieldValue.increment(1),
        });
      });
    });
  });

export const countDownOnunSupportAmbition = functions
  .region("asia-northeast1")
  .firestore.document(
    "users/{userID}/myAmbitions/{ambitionID}/supportedUsers/{supportedUserID}"
  )
  .onDelete((snap, context) => {
    serverDB.runTransaction(async (transaction: Transaction) => {
      const myAmbitionRef = serverDB
        .collection("users")
        .doc(context.params.userID)
        .collection("myAmbitions")
        .doc(context.params.ambitionID);

      await transaction.update(myAmbitionRef, {
        support_count: admin.firestore.FieldValue.increment(-1),
      });

      const querySnapshot = await serverDB
        .collection("users")
        .doc(context.params.userID)
        .collection("suppotedAmbitions")
        .where("ambition_id", "==", context.params.ambitionID)
        .get();

      querySnapshot.docs.forEach(async (docSnapshot) => {
        await transaction.update(docSnapshot.ref, {
          support_count: admin.firestore.FieldValue.increment(-1),
        });
      });
    });
  });
