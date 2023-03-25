import { clientAuth, db } from "../../firebase/client";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { UserInfo } from "types/UserTypes";

type AuthProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<{ userInfo: UserInfo | null }>({
  userInfo: null,
});

const AuthProvider = ({ children }: AuthProps) => {
  // 認証情報を格納
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();
  console.log(userInfo);

  useEffect(() => {
    const unScribe = clientAuth.onAuthStateChanged(async (user) => {
      console.log(user);
      if (user) {
        console.log(user);
        // ユーザーの自動作成
        const userDoc = doc(db, "users", user.uid);
        await getDoc(userDoc).then((snap) => {
          if (!snap.exists()) {
            router.push(
              {
                pathname: "/UserRegistration",
                query: {
                  params: JSON.stringify({
                    user: user,
                  }),
                },
              },
              "UserRegistration"
            );
          } else {
            setUserInfo({
              uid: user.uid,
              name: snap.data().name,
              userDocRef: userDoc,
              avatar_image_url: snap.data().avatar_image_url,
            });
          }
        });
        router.push("/");
      } else {
        setUserInfo(null);
      }
    });
    return () => {
      unScribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
