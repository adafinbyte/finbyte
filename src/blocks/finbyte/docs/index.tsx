import { FC, useState } from "react"
import { motion } from "framer-motion";

import FinbyteFinbyteConnect from "./finbyte-connect";
import FinbyteFinbyteFeatures from "./finbyte-features";

import useThemedProps from "@/contexts/themed-props";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@/components/accordian";

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

  const known_bugs = [
    {
      title: 'Limited Mobile Support',
      description: `
        We are aware that mobile users do have limited support but we are working on a fix for this.
        Currently, the detect wallet backend is attempting to search your browser for the wallet extension and mobile browsers don't typically support extensions. 
      `
    },
  ]

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
          <div className={`${themed['400'].text} flex flex-col w-full gap-2 text-sm`}>
            <span className="inline-flex">
              <h1 className={`text-left text-xs font-semibold ${themed['500'].text} border-b ${themed['500'].border}`}>
                Known Bugs
              </h1>
            </span>
            
            <Accordion>
              {known_bugs.map((bug, index) => (
                <AccordionItem value={index.toString()}>
                  <AccordionHeader>
                    {bug.title}
                  </AccordionHeader>

                  <AccordionPanel>
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        delay: 1 * 0.1,
                      }}
                      className="w-full"
                    >
                      <span>
                        <p className={`${themed['400'].text} text-sm`}>
                          {bug.description}
                        </p>
                      </span>
                    </motion.div>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>

            <img src='/finbyte.png' className="mx-auto mb-2 mt-6 size-12"/>
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