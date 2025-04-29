import { FC } from "react"
import ExploreProjects from "./projects";
import ExploreStats from "./stats";

const ExploreBlock: FC = () => {

  return (
    <div className="p-2 lg:p-14 flex flex-col w-full gap-4 mt-4 lg:w-[90%] lg:mx-auto">
      <ExploreStats/>

      <ExploreProjects/>
    </div>
  )
}

export default ExploreBlock;