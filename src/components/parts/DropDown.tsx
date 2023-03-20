import { useState } from "react";

type DisplayType = "hidden" | "block";

type PropsType = {
  children: React.ReactNode;
  buttonComponent: JSX.Element;
  dropdownPositionClass: string;
};
export const DropDown = ({
  children,
  buttonComponent,
  dropdownPositionClass,
}: PropsType) => {
  const [display, setDisplay] = useState<DisplayType>("hidden");

  return (
    <div className="relative px-10">
      <div
        onClick={() =>
          setDisplay((pre) => (pre === "block" ? "hidden" : "block"))
        }
      >
        {buttonComponent}
      </div>

      <div
        id="dropdownDots"
        className={`z-10 ${display} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute ${dropdownPositionClass}`}
      >
        {children}
      </div>
    </div>
  );
};
