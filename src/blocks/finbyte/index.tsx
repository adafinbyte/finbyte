import { FC } from "react"
import FinbyteDocs from "./docs";
import FinbyteDevelopment from "./development";
import useThemedProps from "@/contexts/themed-props";
import FinbytePlatformUsers from "./platform-users";

const FinbyteBlock: FC = () => {
  const themed = useThemedProps();

  return (
    <div className="p-4 lg:p-14 flex flex-col w-full gap-4">
      <div className="grid lg:grid-cols-2 gap-4" style={{ placeItems: 'start'}}>
        <div className="flex flex-col w-full gap-4">
          <FinbyteDocs/>
          <FinbytePlatformUsers/>
        </div>

        <div className="flex flex-col w-full gap-4">
          <FinbyteDevelopment/>
        </div>
      </div>
    </div>
  )
}

export default FinbyteBlock;