import { db } from "../firebase/client";
import {
  collection,
  collectionGroup,
  doc,
  DocumentChange,
  DocumentData,
  FirestoreDataConverter,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  startAfter,
  startAt,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Ambition,
  ambitionConverter,
  StateAmbition,
  SupportedAmbition,
} from "types/AmbitionType";
import { AuthContext } from "@/auth/AuthProvider";
import { ListType } from "types/AmbitionListType";
import { UserInfo } from "types/UserTypes";

const sleep = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

const convertToAmbition = async (change: DocumentChange<DocumentData>) => {
  const data = change.doc.data() as Ambition;
  const userRef = await getDoc(data.author);
  const userName: string = userRef.data()?.name;
  const avatarImagePath: string = userRef.data()?.avatar_image_url;

  const supportedAmbitionDocSnap = await getDoc(
    doc(db, data.author.path, "supportedAmbitions", data.id)
  );
  return {
    ...data,
    created_at: data.created_at?.toDate(),
    user_name: userName,
    is_supported_ambition: supportedAmbitionDocSnap.exists(),
    avatar_image_path: avatarImagePath,
  };
};

const convertToMyAmbition = async (
  change: DocumentChange<DocumentData>,
  userInfo: UserInfo | null
) => {
  const data = change.doc.data() as Ambition;
  const supportedAmbitionDocSnap = await getDoc(
    doc(db, data.author.path, "supportedAmbitions", data.id)
  );
  return {
    ...data,
    created_at: data.created_at?.toDate(),
    user_name: userInfo!.name,
    is_supported_ambition: supportedAmbitionDocSnap.exists(),
    avatar_image_path: userInfo!.avatar_image_url,
  };
};

const convertToSupportedAmbition = async (
  change: DocumentChange<DocumentData>
) => {
  const data = change.doc.data() as SupportedAmbition;

  const ambitionDocSnapshot = await getDoc(doc(db, "ambitions", data.id));

  const ambition = ambitionDocSnapshot.data() as Ambition;

  const userRef = await getDoc(ambition.author);
  const user = userRef.data();
  const userName: string = user?.name;
  const avatarImagePath: string = user?.avatar_image_url;

  return {
    ...ambition,
    id: data.id,
    created_at: data.created_at?.toDate(),
    user_name: userName,
    is_supported_ambition: true,
    avatar_image_path: avatarImagePath,
  };
};

export const useInfiniteSnapshotListener = (
  ambitionQuery: Query<DocumentData>,
  listType: ListType
) => {
  const now = new Date();
  const { userInfo } = useContext(AuthContext);

  const unsubscribes = useRef<Unsubscribe[]>([]);
  const [ambitionList, setAmbitionList] = useState<StateAmbition[] | []>([]);

  const onSnapshotFun = useCallback(
    async (
      snapshot: QuerySnapshot<Ambition> | QuerySnapshot<SupportedAmbition>,
      pasted: number
    ) => {
      let added: StateAmbition[] = [];
      let modified: StateAmbition[] = [];
      let deleted: StateAmbition[] = [];
      for (let change of snapshot.docChanges()) {
        let target: StateAmbition | undefined = undefined;
        switch (listType) {
          case "All_AMBITION":
            target = await convertToAmbition(change);
            console.log("all");
            break;
          case "MY_AMBITION":
            target = await convertToMyAmbition(change, userInfo);
            console.log("my");
            break;
          case "SUPPORTED_AMBITION":
            target = await convertToSupportedAmbition(change);
        }

        if (target !== undefined) {
          if (change.type === "added") {
            console.log(target);
            added.push(target);
          } else if (change.type === "modified") {
            modified.push(target);
          } else if (change.type === "removed") {
            deleted.push(target);
          }
        }
      }
      if (added.length > 0) {
        // 追加時
        console.log(added);
        if (pasted === 1) {
          setAmbitionList((prev: StateAmbition[]) => [...prev, ...added]);
        } else {
          setAmbitionList((prev: StateAmbition[]) => [...added, ...prev]);
        }
      }
      if (modified.length > 0 && deleted.length === 0) {
        console.log(modified);
        // 変更時
        setAmbitionList((prev) => {
          return prev.map((ambition) => {
            const found = modified.find(
              (modifiedAmbition) => modifiedAmbition.id === ambition.id
            );
            if (found) {
              return found;
            }
            return ambition;
          });
        });
      }
      if (deleted.length > 0) {
        // 削除
        setAmbitionList((prev) => {
          return prev.filter((ambition) => {
            return !deleted.find(
              (targetValue) => targetValue.id === ambition.id
            );
          });
        });
      }
    },
    []
  );

  // 未来の野望の読み込み
  const registLatestAmbitionListener = useCallback(() => {
    return onSnapshot(
      query(
        ambitionQuery,
        orderBy("created_at", "asc"),
        startAfter(now)
      ).withConverter(ambitionConverter),
      (querySnapshot) => {
        onSnapshotFun(querySnapshot, 0);
      }
    );
  }, [onSnapshotFun]);

  //過去の野望の読み込み
  const registPastAmbitionListener = useCallback(
    (startAfterDate: Date) => {
      return onSnapshot(
        query(
          ambitionQuery,
          orderBy("created_at", "desc"),
          startAfter(startAfterDate),
          limit(10)
        ).withConverter(ambitionConverter),
        (querySnapshot) => {
          onSnapshotFun(querySnapshot, 1);
        }
      );
    },
    [onSnapshotFun]
  );

  // 初回ロード
  const initRead = useCallback(() => {
    console.log(userInfo);
    // 現時刻よりも古いデータをあらかじめ数件読み込む
    unsubscribes.current.push(registPastAmbitionListener(now));
    // 未来の野望の読み込み
    unsubscribes.current.push(registLatestAmbitionListener());
  }, [registPastAmbitionListener, registLatestAmbitionListener]);

  // スクロール時、追加購読するためのリスナー
  const readMore = useCallback(async () => {
    let lastMessageDate: Date | undefined = undefined;
    if (ambitionList.length) {
      lastMessageDate = ambitionList[ambitionList.length - 1].created_at;
      console.log(lastMessageDate);
    }
    if (lastMessageDate !== undefined) {
      await sleep(2.0);
      unsubscribes.current.push(registPastAmbitionListener(lastMessageDate));
    }
  }, [registPastAmbitionListener, ambitionList]);

  // 登録解除(Unmount時に解除）
  const clear = useCallback(() => {
    for (const unsubscribe of unsubscribes.current) {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    return () => {
      // console.log("clear");
      clear();
    };
  }, [clear]);

  return {
    initRead,
    readMore,
    ambitionList,
  };
};
