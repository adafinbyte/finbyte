import { FC } from "react"

const FinbyteBlock: FC = () => {

  return (
    <div className="p-2 lg:p-14 flex flex-col w-full gap-4 mt-4 text-neutral-400">
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          here, we should include our recent progress on the platform.
          This could include newly curated tokens by the community,
          general updates, team news etc.

          We should also create some for of kanban in order to keep track
          of certain tasks.
        </div>

        <div>
          new to finbyte?
        </div>
      </div>
    </div>
  )
}

export default FinbyteBlock;