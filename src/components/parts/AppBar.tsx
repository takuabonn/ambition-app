import { AuthContext } from "@/auth/AuthProvider";
import { useAuth } from "lib/useAuth";
import { useRouter } from "next/router";
import { useContext } from "react";
import { MdAccountCircle } from "react-icons/md";
import { DropDown } from "./DropDown";
export const AppBar = () => {
  const router = useRouter();
  const { logOut } = useAuth();
  const { userInfo } = useContext(AuthContext);
  return (
    <>
      <div className="w-full h-16 bg-white-500 flex flex-wrap justify-between items-center">
        <div
          className="text-5xl font-yuji pt-3 pb-3 pl-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          YABOU
        </div>
        {userInfo && (
          <DropDown
            buttonComponent={
              <MdAccountCircle className="icon cursor-pointer" size="3.0rem" />
            }
            dropdownPositionClass="right-5"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li>
                <div
                  className="text-md font-yuji pt-3 pb-3 mr-5 px-1"
                  onClick={() => router.push("/SignIn")}
                >
                  ログイン
                </div>
              </li>

              <li>
                <div
                  className="text-md font-yuji pt-3 pb-3 mr-5 px-1"
                  onClick={logOut}
                >
                  ログアウト
                </div>
              </li>
            </ul>
          </DropDown>
        )}
      </div>
      <hr className="mt-2 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

      {/* <ul className="h-24 bg-white-500 z-10">
        <li>ログイン</li>
        <li>会員情報</li>
        <li>ログアウト</li>
      </ul> */}
    </>
  );
};
