import { User } from "firebase/auth";
import { cloudStorage, db } from "../../firebase/client";
import {
  doc,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type RouterParamType = {
  user: User;
};
const UserRegistration = () => {
  const userNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarImage, setAvatarImage] = useState<File>();
  const changeAvatarImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setAvatarImage(e.target.files[0]);
    }
  };

  const registerUser = () => {
    if (router.query.params) {
      const { user }: RouterParamType = JSON.parse(
        router.query.params as string
      );
      const avatarImageRef = ref(
        cloudStorage,
        `users/common/${avatarImage?.name}`
      );

      const userName = userNameRef.current?.value;
      const userDoc = doc(db, "users", user.uid);

      if (avatarImage) {
        uploadBytes(avatarImageRef, avatarImage).then(() => {
          getDownloadURL(avatarImageRef).then((imageUrl) => {
            setDoc(userDoc, {
              email: user.email,
              name: userName,
              createdAt: serverTimestamp(),
              avatar_image_url: imageUrl,
            });
            router.push("/");
          });
        });
      }

      console.log("認証か");
    }
  };

  return (
    <>
      <div className="max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-24 container">
        <div
          style={{
            position: "relative",
            height: "200px",
            width: "200px",
          }}
          className="mt-5 mx-auto"
          onClick={() => fileRef.current?.click()}
        >
          <Image
            className="object-cover rounded-full cursor-pointer"
            src={
              avatarImage !== undefined
                ? URL.createObjectURL(avatarImage)
                : "/blank-profile-picture-973460_640.png"
            }
            alt=""
            fill
          />
        </div>
        <div className="w-9/12 mx-auto mt-1">
          <p className="text-center text-xs font-yuji">
            上のアイコンをクリックしてアバター画像選択
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={changeAvatarImage}
        />
        <div className="mt-5 px-5 pb-5">
          <input
            type="text"
            id="user_name"
            className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-black-400 dark:text-white dark:focus:ring-black-500 dark:focus:border-black-500 font-yuji"
            placeholder="ユーザーネーム"
            ref={userNameRef}
          />
        </div>
        <button
          onClick={registerUser}
          className="md:w-60 w-1/2 shadow-md drop-shadow-md text-xl border border-gray-200 rounded-lg p-1 mx-auto mt-5 block font-yuji bg-black text-white mb-5"
        >
          アカウント登録
        </button>
      </div>
    </>
  );
};

export default UserRegistration;
