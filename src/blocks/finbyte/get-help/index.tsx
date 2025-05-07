import { FC } from "react";
import SiteHeader from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const GetHelpBlock: FC = () => {
  const connect_wallet_child = (
    <div>

    </div>
  )

  const help_items = [
    {title: 'Finbyte Kudos', children: connect_wallet_child, type: 'platform'},
    {title: 'Finbyte Markdown', children: connect_wallet_child, type: 'style'},
    {title: 'Platform Emojis', children: connect_wallet_child, type: 'style'},
    {title: 'Connect a Wallet', children: connect_wallet_child, type: 'platform'},
    {title: 'Create Content', children: connect_wallet_child, type: 'platform'},
    {title: 'Edit Content', children: connect_wallet_child, type: 'platform'},
    {title: 'Request New Token', children: connect_wallet_child, type: 'platform'},
    {title: 'Register to Finbyte', children: connect_wallet_child, type: 'account'},
    {title: 'Change your Username', children: connect_wallet_child, type: 'account'},
    {title: 'Delete your account', children: connect_wallet_child, type: 'account'},
  ];

  const about_integrations = [
    {title: 'MeshSDK', children: connect_wallet_child, type: 'wallet', image: 'https://meshjs.dev/logo-mesh/white/logo-mesh-white-64x64.png'},
    {title: 'DexHunter', children: connect_wallet_child, type: 'trade', image: 'https://www.dexhunter.io/_next/static/media/hunt-token.0f202821.svg'},
    {title: 'PoolPM', children: connect_wallet_child, type: 'blockchain', image: 'https://pool.pm/pool.pm.svg'},
    {title: 'Blockfrost', children: connect_wallet_child, type: 'blockchain', image: 'https://pbs.twimg.com/profile_images/1683911708719316992/n9LpcKJk_400x400.png'},
  ]

  return (
    <>
      <SiteHeader title='Get Help'/>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <div className="grid lg:grid-cols-2 gap-4" style={{ placeItems: 'start' }}>
            <div className="flex flex-col w-full gap-2">
              <h1 className="font-semibold text-sm">
                Help Guides
              </h1>

              <Accordion type='single' collapsible className="">
                {help_items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      delay: index * 0.2,
                    }}
                  >
                    <AccordionItem key={index} value={index.toString()}>
                      <AccordionTrigger>
                        <span className="flex w-full items-center justify-between gap-4 pr-2">
                          {item.title}
                          <Badge variant='secondary'>{item.type}</Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>{item.children}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

            </div>
            
            <div className="flex flex-col w-full gap-2">
              <h1 className="font-semibold text-sm">
                Cardano Integrations
              </h1>

              <Accordion type='single' collapsible className="">
                {about_integrations.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      delay: index * 0.2,
                    }}
                  >
                    <AccordionItem key={index} value={index.toString()}>
                      <AccordionTrigger>
                        <span className="flex w-full items-center gap-4">
                          <img src={item.image} className="size-5"/>
                          {item.title}
                        </span>
                        <Badge variant='secondary' className="ml-auto mr-2">{item.type}</Badge>
                        </AccordionTrigger>
                      <AccordionContent>{item.children}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default GetHelpBlock;