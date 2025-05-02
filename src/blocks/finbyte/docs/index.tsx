import { FC, useState } from "react"

import FinbyteFinbyteConnect from "./finbyte-connect";
import FinbyteFinbyteFeatures from "./finbyte-features";

import useThemedProps from "@/contexts/themed-props";

const FinbyteDocs: FC = () => {
  const themed = useThemedProps();

  /** @todo fix the welcome screen then put this back to null */
  const [current_view, set_current_view] = useState<string | null>('finbyte-features');

  const views = [
    {
      title: 'Welcome',
      view: null
    },
    {
      title: 'Platform Features',
      view: 'finbyte-features'
    },
    {
      title: 'Connect to Finbyte',
      view: 'finbyte-connect'
    },
    //wait until we have an adahandle to do screenshot of create account
  ]

  const tab_button_class = (triggers: string | null) => `
    ${triggers === current_view ? themed['300'].text + ' border-b ' + themed['800'].border : themed['500'].text + ' '}
    ${themed.effects.transparent_button.hover}
    py-1 px-2 rounded-lg
  `;

  return (
    <div className={`p-2 flex flex-col gap-2 ${themed['900'].bg} rounded-lg border ${themed['700'].border}`}>
      <h1 className={`text-left text-sm font-semibold ${themed['500'].text} w-full`}>
        Docs
      </h1>

      <div className={`flex gap-1 ${themed.webkit_scrollbar}`}>
        {views.map((view, index) => (
          <button key={index} onClick={() => set_current_view(view.view)} className={tab_button_class(view.view)}>
            {view.title}
          </button>
        ))}
      </div>

      <span className={`max-h-80 ${themed.webkit_scrollbar}`}>
        {current_view === null ?
          <div className={`${themed['400'].text} text-xs`}>
            <p className={`text-xs ${themed['500'].text} p-2 px-4 italic`}>
              Please be aware, Finbyte is a work-in-progress so it may have limited supported.
              We do fully intend to fully have everything supported.
              On that note, everything you read here is working one way or another and it will be stated what has been tested using which "thing".
            </p>

            here, we should include our recent progress on the platform.
            This could include newly curated tokens by the community,
            general updates, team news etc.

            We should also create some for of kanban in order to keep track
            of certain tasks.
          </div>
          :
          current_view === 'finbyte-connect' && (<FinbyteFinbyteConnect/>) ||
          current_view === 'finbyte-features' && (<FinbyteFinbyteFeatures/>)
        }
      </span>

    </div>
  )
}

export default FinbyteDocs;