import { db } from "../firebase/client";
import {
  collection,
  collectionGroup,
  doc,
  FirestoreDataConverter,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  startAt,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ambition, ambitionConverter, StateAmbition } from "types/AmbitionType";

const now = new Date();

const sleep = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

export const useInfiniteSnapshotListener = () => {
  const unsubscribes = useRef<Unsubscribe[]>([]);
  const [ambitionList, setAmbitionList] = useState<StateAmbition[] | []>([]);

  const onSnapshotFun = useCallback(
    async (snapshot: QuerySnapshot<Ambition>, pasted: number) => {
      let added: StateAmbition[] = [];
      let modified: StateAmbition[] = [];
      let deleted: StateAmbition[] = [];

      for (let change of snapshot.docChanges()) {
        const data = change.doc.data() as Ambition;
        const userRef = await getDoc(doc(db, data.auth.path));
        const userName: string = userRef.data()?.name;

        // 該当の野望が応援してる野望であれば画面でハートがfillされた状態になる
        const suppotedAmbitionSnapshot = await getCountFromServer(
          query(
            collection(db, data.auth.path, "supportedAmbitions"),
            where("ambition_id", "==", data.id)
          )
        );
        const target = {
          ...data,
          created_at: data.created_at?.toDate(),
          user_name: userName,
          is_supported_ambition: suppotedAmbitionSnapshot.data().count > 0,
        };

        if (change.type === "added") {
          added.push(target);
        } else if (change.type === "modified") {
          modified.push(target);
        } else if (change.type === "removed") {
          deleted.push(target);
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
      if (modified.length > 0) {
        // 変更時
        console.log("変更ではないでしょう");
        setAmbitionList((prev) => {
          return prev.map((mes) => {
            const found = modified.find((m) => m.id === mes.id);
            if (found) {
              return found;
            }
            return mes;
          });
        });
      }
      if (deleted.length > 0) {
        // 削除する（今回この操作は扱わない）
      }
    },
    []
  );

  // 未来（最新メッセージ）の購読リスナー
  const registLatestAmbitionListener = useCallback(() => {
    console.log("haita");
    return onSnapshot(
      query(
        collectionGroup(db, "myAmbitions"),
        orderBy("created_at", "asc"),
        startAfter(now)
      ).withConverter(ambitionConverter),
      (querySnapshot) => {
        console.log("みらい");
        onSnapshotFun(querySnapshot, 0);
      }
    );
  }, [onSnapshotFun]);

  //過去メッセージの購読リスナー
  const registPastAmbitionListener = useCallback(
    (startAfterDate: Date) => {
      console.log("haita2");
      return onSnapshot(
        query(
          collectionGroup(db, "myAmbitions"),
          orderBy("created_at", "desc"),
          startAfter(startAfterDate),
          limit(10)
        ).withConverter(ambitionConverter),
        (querySnapshot) => {
          console.log("かこ");
          onSnapshotFun(querySnapshot, 1);
        }
      );
    },
    [onSnapshotFun]
  );

  // 初回ロード
  const initRead = useCallback(() => {
    // 未来のメッセージを購読する
    unsubscribes.current.push(registLatestAmbitionListener());
    // 現時刻よりも古いデータを一定数、購読する
    unsubscribes.current.push(registPastAmbitionListener(now));
  }, [registPastAmbitionListener, registLatestAmbitionListener]);

  // スクロール時、追加購読するためのリスナー
  const readMore = useCallback(async () => {
    console.log("jj");
    let lastMessageDate: Date | undefined = undefined;
    if (ambitionList.length) {
      lastMessageDate = ambitionList[ambitionList.length - 1].created_at;
      console.log(lastMessageDate);
    }
    if (lastMessageDate !== undefined) {
      console.log(lastMessageDate, ambitionList[ambitionList.length - 1]);
      await sleep(2.0);
      unsubscribes.current.push(registPastAmbitionListener(lastMessageDate));
    }

    //  unsubscribes.current.push(registPastAmbitionListener(lastMessageDate));
  }, [registPastAmbitionListener, ambitionList]);

  // 登録解除(Unmount時に解除）
  const clear = useCallback(() => {
    for (const unsubscribe of unsubscribes.current) {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return {
    initRead,
    readMore,
    ambitionList,
  };
};
