import { useAuth } from "lib/useAuth";
import { useRouter } from "next/router";

export const AppBar = () => {
  const router = useRouter();
  const { logOut } = useAuth();
  return (
    <div className="w-full h-16 bg-white-500 flex flex-wrap justify-between items-center">
      <div className="text-5xl font-yuji pt-3 pb-3 pl-3">YABOU</div>
      <div className="flex flex-wrap justify-between">
        <div
          className="text-md font-yuji pt-3 pb-3 mr-5"
          onClick={() => router.push("/SignIn")}
        >
          ログイン
        </div>
        <div className="text-md font-yuji pt-3 pb-3 mr-5" onClick={logOut}>
          ログアウト
        </div>
        <div className="text-md font-yuji pt-3 pb-3 mr-5">私の野望</div>
        <div className="text-md font-yuji pt-3 pb-3 mr-5">応援した野望</div>
      </div>
    </div>
  );
};
