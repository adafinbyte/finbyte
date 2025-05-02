import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@/components/accordian";
import useThemedProps from "@/contexts/themed-props";
import { FC } from "react"
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const FinbyteFinbyteFeatures: FC = () => {
  const themed = useThemedProps();

  const noteable_features = [
    'Cardano Integration',
    '"CRUD" Actions',
    'CIP-8 Verify',
    'MeshSDK Handles Wallet',
    'AdaHandle Support',
    'DexHunter Integration',
    'Open Source',
    '100% Free To Use',
  ];

  const anon_user_features = [
    '100% Free to use',
    'Create Posts & Comments',
    'Like, Edit, Delete Content',
  ];  
  const finbyte_user_features = [
    'Everything Anonymous...',
    'Apply AdaHandle as Username',
    'Represent Communities',
  ];

  return (
    <div className={`p-2 flex flex-col w-full gap-2`}>
      <span className="inline-flex">
        <h1 className={`text-left text-xs font-semibold ${themed['500'].text} border-b ${themed['500'].border}`}>
          Notable Feature
        </h1>
      </span>

      <div className="flex items-center flex-wrap gap-2 text-sm">
        {noteable_features.map((item, index) => (
          <div key={index} className={`cursor-default ${themed.effects.transparent_button.hover} p-1 rounded-lg ${themed['400'].text}`}>
            {item}
          </div>
        ))}
      </div>

      <span className="inline-flex">
        <h1 className={`text-left text-xs font-semibold ${themed['500'].text} border-b ${themed['500'].border}`}>
          User Types
        </h1>
      </span>

      <div className={`grid grid-cols-2 gap-4`}>
        <div className={`border ${themed['700'].border} rounded-lg flex-col gap-2 p-2 w-full ${themed['400'].text}`}>
          <h1 className={`text-left text-xs font-semibold ${themed['500'].text} w-full pb-2`}>
            Anonymous
          </h1>

          {anon_user_features.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Check className="text-green-400 size-4"/>
              <h1 className={`text-sm ${themed['300'].text}`}>
                {item}
              </h1>
            </div>
          ))}
        </div>

        <div className={`border ${themed['700'].border} rounded-lg flex-col gap-2 p-2 w-full ${themed['400'].text}`}>
          <h1 className={`text-left text-xs font-semibold ${themed['500'].text} w-full pb-2`}>
            Registered
          </h1>

          {finbyte_user_features.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Check className="text-green-400 size-4"/>
              <h1 className={`text-sm ${themed['300'].text}`}>
                {item}
              </h1>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default FinbyteFinbyteFeatures;