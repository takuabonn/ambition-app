import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { clientAuth, db } from "../../firebase/client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "lib/useAuth";

const SignIn = () => {
  const { logIn } = useAuth();
  return (
    <div className="max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto container mt-10 sm:w-full w-11/12">
      {/* <div className="text-2xl text-center mt-5 font-yuji">YABOU</div> */}
      <div style={{ position: "relative", maxWidth: "100%", height: "300px" }}>
        <Image
          className="object-contain relative w-full"
          src="/arguing-g992580437_1280.png"
          alt=""
          fill
        />

        <p className="absolute md:top-1/2 top-1/2 left-1/2  text-3xl inline-block  font-yuji -translate-x-1/2 ">
          野望を
        </p>
        <p className="absolute md:top-2/3 top-2/3 left-1/2  text-3xl inline-block font-yuji -translate-y-1/4">
          叫べ
        </p>
      </div>

      <button
        className="w-80 shadow-md drop-shadow-md text-xl p-1 my-5 mx-auto block font-yuji"
        onClick={logIn}
      >
        Google ログイン
      </button>
    </div>
  );
};

export default SignIn;
