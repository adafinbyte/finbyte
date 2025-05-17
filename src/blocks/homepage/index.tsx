import { SectionCards } from "@/components/section-cards";
import SiteHeader from "@/components/site-header";
import { FC } from "react";
import Hero from "./hero";
import About from "./about";

const HomepageBlock: FC = () => {

  return (
    <>
      <SiteHeader/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <Hero/>
          <About/>
        </div>
      </div>
    </>
  )
}

export default HomepageBlock;