import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { clientAuth, db } from "../../firebase/client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "lib/useAuth";

const SignIn = () => {
  const { logIn, logOut } = useAuth();
  return (
    <div className="max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-24 container">
      <div className="text-2xl text-center mt-5 font-yuji">YABOU</div>
      <div style={{ position: "relative", maxWidth: "100%", height: "300px" }}>
        <Image
          className="object-contain relative w-full"
          src="/arguing-g992580437_1280.png"
          alt=""
          fill
        />
        <div className="absolute top-40 left-36 inline-block ">
          <span className="text-2xl inline-block  font-yuji">野望を</span>
          <span className="text-2xl inline-block font-yuji ">叫べ</span>
        </div>
      </div>

      <button
        className="w-80 shadow-md drop-shadow-md text-xl p-1 my-5 mx-auto block font-yuji"
        onClick={logIn}
      >
        Google ログイン
      </button>
      <button
        className="w-80 shadow-md drop-shadow-md text-xl p-1  my-5 mx-auto block font-yuji"
        onClick={logOut}
      >
        ログアウト
      </button>
    </div>
  );
};

export default SignIn;
