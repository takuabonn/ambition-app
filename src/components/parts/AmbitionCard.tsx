import { clientAuth, db } from "../../../firebase/client";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback } from "react";
import { BiHeart } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import { StateAmbition } from "types/AmbitionType";

type PropsType = {
  ambition: StateAmbition;
};
export const AmbitionCard = ({ ambition }: PropsType) => {
  const onSupport = useCallback(async (ambition: StateAmbition) => {
    const batch = writeBatch(db);
    const userId = clientAuth.currentUser!.uid;
    const userRef = doc(db, "users", userId);
    const supportedAmbitionRef = collection(
      db,
      "users",
      userId,
      "supportedAmbitions"
    );
    batch.set(doc(supportedAmbitionRef), {
      author: userRef.path,
      ambition_id: ambition.id,
      content: ambition.content,
      message_of_support: ambition.message_of_support,
      support_count: ambition.support_count,
      created_at: serverTimestamp(),
    });
    const supportedUsersRef = collection(
      db,
      "users",
      userId,
      "myAmbitions",
      ambition.id,
      "supportedUsers"
    );
    batch.set(doc(supportedUsersRef), {
      user_id: userRef.id,
      created_at: serverTimestamp(),
    });

    await batch.commit();
  }, []);

  const unSupport = useCallback(async (ambition: StateAmbition) => {
    const batch = writeBatch(db);
    const userId = clientAuth.currentUser!.uid;
    const userRef = doc(db, "users", userId);
    const supportedAmbitionSnapshot = await getDocs(
      query(
        collection(db, "users", userId, "supportedAmbitions"),
        where("ambition_id", "==", ambition.id)
      )
    );
    supportedAmbitionSnapshot.forEach((ambitionQueryDocSnapshot) => {
      batch.delete(ambitionQueryDocSnapshot.ref);
    });

    const ambitionQuery = query(
      collection(
        db,
        "users",
        userRef.id,
        "myAmbitions",
        ambition.id,
        "supportedUsers"
      ),
      where("user_id", "==", userRef.id)
    );
    const ambitionQuerySnapshot = await getDocs(ambitionQuery);
    ambitionQuerySnapshot.forEach(async (ambitionQueryDocSnapshot) => {
      batch.delete(ambitionQueryDocSnapshot.ref);
    });

    await batch.commit();
  }, []);
  return (
    <div className="w-full h-40 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto  relative mt-5">
      <p className="absolute text-center text-xl font-yuji top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        {ambition.content}
      </p>
      <p className="absolute text-center font-yuji text-xl bottom-1 right-1 pr-1">
        {ambition.user_name}
      </p>
      <p className="absolute text-center font-yuji text-lg top-1 right-1 pr-1">
        {`応援数: ${ambition.support_count}`}
      </p>
      <div className="flex absolute bottom-1 left-1">
        {ambition.is_supported_ambition ? (
          <BsHeartFill
            className="icon cursor-pointer"
            size="1.5rem"
            onClick={() => unSupport(ambition)}
          />
        ) : (
          <BiHeart
            className="icon cursor-pointer"
            size="1.5rem"
            onClick={() => onSupport(ambition)}
          />
        )}

        <p className="text-lg font-yuji ml-1">{ambition.message_of_support}</p>
      </div>
    </div>
  );
};
