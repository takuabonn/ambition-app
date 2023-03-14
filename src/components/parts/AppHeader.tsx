import Image from "next/image";
import { AppBar } from "./AppBar";

export const AppHeader = () => {
  return (
    <div className="w-full">
      <AppBar />
      <div
        style={{
          position: "relative",
          height: "30vw",
        }}
      >
        <Image
          className="object-cover  w-full"
          src="/arguing-g992580437_1280.png"
          alt=""
          fill
        />
        <p className="absolute top-1/2 left-1/2 sm:text-5xl xl:text-8xl inline-block  font-yuji -translate-x-1/2 ">
          野望を
        </p>
        <p className="absolute top-3/4 left-1/2 sm:text-5xl xl:text-8xl inline-block font-yuji -translate-y-1/4">
          叫べ
        </p>
      </div>
    </div>
  );
};
