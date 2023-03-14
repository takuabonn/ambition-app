import { clientAuth, db } from "../../firebase/client";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

type AuthProps = {
  children: React.ReactNode;
};

type User = {
  uid: string;
  name: string | null;
};

const AuthContext = createContext<{ userInfo: User | null }>({
  userInfo: null,
});

const AuthProvider = ({ children }: AuthProps) => {
  // 認証情報を格納
  const [userInfo, setUserInfo] = useState<User | null>(null);
  console.log(userInfo);

  useEffect(() => {
    const unScribe = clientAuth.onAuthStateChanged(async (user) => {
      console.log(user);
      if (user) {
        console.log(user);
        setUserInfo({
          uid: user.uid,
          name: user.displayName,
        });

        // ユーザーの自動作成
        const userDoc = doc(db, "users", user.uid);
        await getDoc(userDoc).then((snap) => {
          if (!snap.exists()) {
            console.log("作成");
            setDoc(userDoc, {
              email: user.email,
              name: user.displayName,
              createdAt: serverTimestamp(),
            });
          }
        });
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
