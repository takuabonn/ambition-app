import { AuthContext } from "@/auth/AuthProvider";
import { db } from "../../../firebase/client";
import {
  collection,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "lib/useAuth";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { BiHeart } from "react-icons/bi";
export const AmbitionForm = () => {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [messageOfSupport, setMessageOfSupport] = useState("応援する");

  const changeContent = (e: any) => {
    setContent(() => e.target.value);
  };

  const changeMessageOfSupport = (e: any) => {
    setMessageOfSupport(() => e.target.value);
  };

  const submitAmbition = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        const ambitionCollectionRef = collection(db, "ambitions");
        const ambitionDocRef = doc(ambitionCollectionRef);
        transaction.set(ambitionDocRef, {
          author: userInfo!.userDocRef,
          content: content,
          message_of_support: messageOfSupport,
          created_at: serverTimestamp(),
          support_count: increment(0),
        });
        setContent("");
        setMessageOfSupport("応援する");
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {userInfo ? (
        <div className="">
          <div className=" md:flex md:items-center md:w-9/12 w-11/12 p-5 min-h-min border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto my-5 container">
            <div className="md:w-1/2">
              <div className="mt-5">
                <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white font-yuji">
                  野望
                </label>
                <input
                  type="text"
                  id="ambition"
                  className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-white dark:focus:ring-black-500 dark:focus:border-black-500 font-yuji"
                  placeholder="野望"
                  required
                  value={content}
                  onChange={changeContent}
                />
              </div>
              <div className="mt-5">
                <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white font-yuji">
                  希望応援メッセージ
                </label>
                <input
                  type="text"
                  id="message_of_suport"
                  className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-yuji"
                  placeholder="応援メッセージ"
                  required
                  value={messageOfSupport}
                  onChange={changeMessageOfSupport}
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <p className="font-yuji text-xl mt-5 md:pl-5">完成図</p>
              <div className="w-11/12 h-40 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-5 relative">
                <p className="absolute text-center text-xl font-yuji top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                  {content}
                </p>
                <p className="absolute text-center font-yuji text-xl bottom-1 right-1 pr-1">
                  {userInfo.name}
                </p>
                <p className="absolute text-center font-yuji text-lg top-1 right-1 pr-1">
                  {"応援数: 0"}
                </p>
                <div className="flex absolute bottom-1 left-1">
                  <BiHeart className="icon cursor-pointer" size="1.5rem" />
                  <p className="text-lg font-yuji ml-1">{messageOfSupport}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={submitAmbition}
            className="md:w-60 w-1/2 shadow-md drop-shadow-md text-xl border border-gray-200 rounded-lg p-1 mx-auto mt-5 block font-yuji bg-black text-white"
          >
            叫ぶ
          </button>
        </div>
      ) : (
        <button
          className="md:w-60 w-1/2 shadow-md drop-shadow-md text-xl border border-gray-200 rounded-lg p-1 mx-auto mt-5 block font-yuji bg-black text-white"
          onClick={() => router.push("/SignIn")}
        >
          ログインして叫ぶ
        </button>
      )}
    </>
  );
};
