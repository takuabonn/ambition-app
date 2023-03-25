import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { clientAuth } from "../firebase/client";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const logIn = () => {
    signInWithRedirect(clientAuth, provider).then(() => {
      console.log("ログイン");
      router.push("/");
    });
  };
  const logOut = () => {
    signOut(clientAuth).then(() => {
      router.push("/");
    });
  };
  return { logIn, logOut };
};
