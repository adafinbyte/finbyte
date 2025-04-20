"use client"

import { verified_token } from "@/verified/interfaces";
import verified_tokens from "@/verified/tokens";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import CommunitySidebar from "./sidebar";
import CommunityView from "./views";


const Communities: FC = () => {
  const router = useRouter();
  const [found_token, set_found_token] = useState<verified_token | undefined>();
  const [active_tab, set_active_tab] = useState(0);

  useEffect(() => {
    const slug_id = router.asPath.split('/').pop();
    const found_token = verified_tokens.find(a => a.slug_id === slug_id);

    if (found_token) {
      set_found_token(found_token);
    }
  }, [router.asPath]);

  const tab_list = [
    "Overview", "Community", "Trade"
  ]

  return found_token ? (
    <div className="">

      <div className="grid lg:grid-cols-5 p-4 mt-4 lg:mt-10 lg:gap-4" style={{ placeItems: "start"}}>
        <div className="border border-transparent w-full text-left p-2">
          <CommunitySidebar token={found_token} tab_list={tab_list} active_tab={active_tab} set_tab={set_active_tab}/>
        </div>

        <div className="lg:col-span-4 lg:col-start-2 lg:w-full">
          <CommunityView
            active_tab={active_tab}
            token={found_token}
          />
        </div>
      </div>
    </div>
  )
  :
  <div>
    No Token Found
  </div>
}

export default Communities;