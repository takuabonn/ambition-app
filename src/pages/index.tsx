import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { AppHeader } from "@/components/parts/AppHeader";
import { AmbitionForm } from "@/components/parts/AmbitionForm";
import { AmbitionList } from "@/components/parts/AmbitionList";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { MyAmbitionList } from "@/components/parts/MyAmbitionList";
import { AuthContext } from "@/auth/AuthProvider";
import { SupportedAmbitionList } from "@/components/parts/SupportedAmbitionList";

const inter = Inter({ subsets: ["latin"] });

type TabItem =
  | "POST_AMBITION"
  | "All_AMBITION"
  | "MY_AMBITION"
  | "SUPPORTED_AMBITION";

// eslint-disable-next-line react/display-name
const MemoedList = memo(() => <AmbitionList />);

export default function Home() {
  const [tab, setTab] = useState<TabItem>("POST_AMBITION");
  const { userInfo } = useContext(AuthContext);
  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center justify-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-900 hover:border-gray-900 dark:hover:text-gray-300 font-yuji"
              id="profile-tab"
              data-tabs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              onClick={() => setTab("POST_AMBITION")}
            >
              野望を叫ぶ
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-900 hover:border-gray-900 dark:hover:text-gray-300 font-yuji"
              id="dashboard-tab"
              data-tabs-target="#dashboard"
              type="button"
              role="tab"
              aria-controls="dashboard"
              aria-selected="false"
              onClick={() => setTab("All_AMBITION")}
            >
              みんなの野望
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-900 hover:border-gray-900 dark:hover:text-gray-300 font-yuji"
              id="settings-tab"
              data-tabs-target="#settings"
              type="button"
              role="tab"
              aria-controls="settings"
              aria-selected="false"
              onClick={() => setTab("SUPPORTED_AMBITION")}
            >
              応援している野望
            </button>
          </li>
          <li role="presentation">
            <button
              className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-900 hover:border-gray-900 dark:hover:text-gray-300 font-yuji"
              id="contacts-tab"
              data-tabs-target="#contacts"
              type="button"
              role="tab"
              aria-controls="contacts"
              aria-selected="false"
              onClick={() => setTab("MY_AMBITION")}
            >
              私の野望
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div className={tab === "POST_AMBITION" ? "block" : "hidden"}>
          <AmbitionForm />
        </div>
        <div className={tab === "All_AMBITION" ? "block" : "hidden"}>
          <AmbitionList />
        </div>
        {userInfo && (
          <>
            <div className={tab === "MY_AMBITION" ? "block" : "hidden"}>
              <MyAmbitionList />
            </div>
            <div className={tab === "SUPPORTED_AMBITION" ? "block" : "hidden"}>
              <SupportedAmbitionList />
            </div>
          </>
        )}
      </div>
    </>
  );
}
