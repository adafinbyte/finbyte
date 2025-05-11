import { FC, useState } from "react";
import SiteHeader from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Banner from "@/components/banner";
import { Check } from "lucide-react";

const GetHelpBlock: FC = () => {
  const [close_banner, set_close_banner] = useState(false);

  const finbyte_kudos_child = (
    <div>
      <hr className="dark:border-neutral-800 mb-2"/>

      <Label className="p-2">
        About Finbyte's Kudos System.
      </Label>

      <p className="p-2">
        Although the numbers are just for fun for the time being, these do have real meaning.
        Your Finbyte Kudos is a calculated point system based on your activity across the platform.
        Below explains how Kudos is worked out.
      </p>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Earns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Creating content</TableCell>
              <TableCell>+1 Kudos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Your content recieves a like</TableCell>
              <TableCell>+2 Kudos</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>


    </div>
  )

  const connect_wallet_child = (
    <div>
      <hr className="dark:border-neutral-800 mb-2"/>

      <Label className="p-2">
        Connect a wallet to Finbyte.
      </Label>

      <p className="p-2">
        At this moment, we are aware of limited support for mobile users.
        We use MeshSDK for all wallet action and because we focus on connecting a browser wallet extension, these actions can be limited.
        For example, not all mobile browsers use extension.
        <br/>
        Good news is on the horizon though as the MeshSDK is working a way to login with a Cardano using a 3rd party login like Google, Discord and X.
        <br/>
        We will also be working on our own integrations too so we're not fully relying on MeshSDK.
        Below is a list what has been tested.
      </p>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Browser/App</TableHead>
              <TableHead>Wallet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>PC/Laptop</TableCell>
              <TableCell>Brave Browser</TableCell>
              <TableCell className="inline-flex items-center gap-2">Eternl<Check className="size-4 text-green-400"/></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>


    </div>
  )

  const create_content_child = (
    <div>
      <hr className="dark:border-neutral-800 mb-2"/>

      <Label className="p-2">
        Create Content on Finbyte.
      </Label>

      <p className="p-2">
        Creating content on Finbyte is easy and 100% free.
        Simply connect your wallet, fill in the needed details, sign the message with your wallet and there we go... Yes, it's really that easy.
      </p>

      <Label className="p-2">
        Finbyte Forums
      </Label>

      <p className="p-2">
        Within our Forums, you are able to create posts and comment on them posts.
        If you are deciding to post a request, our platform will recognise this automatically create a voting system on this post allowing users to vote yes and no.
        This could be used to request new tokens, projects, features etc.
      </p>

      <Label className="p-2">
        Community Page
      </Label>

      <p className="p-2">
        Sometimes called a token page, we have extended the forum logic to create individual community message boards for each token listed.
        This could be used to deepen the connection with other members of that community, maybe even leave a message for the core team behind that project for them to see!
      </p>
    </div>
  )

  const request_token_child = (
    <div>
      <hr className="dark:border-neutral-800 mb-2"/>

      <Label className="p-2">
        Request Token Listing on Finbyte.
      </Label>

      <p className="p-2">
        Just like creating content, request and updating token information is also a 100% free process.
        Simply head on over to our forum, click Create Post with a connected wallet and then click "Requests" for the post section.
        Once you've created your post, the community can then vote on your request.
      </p>
    </div>
  )

  type help_type = 'platform' | 'style' | 'account';
  const help_items = [
    {title: 'Connect a Wallet', children: connect_wallet_child, type: 'platform'},
    {title: 'Finbyte Kudos', children: finbyte_kudos_child, type: 'platform'},
    {title: 'Create Content', children: create_content_child, type: 'platform'},
    {title: 'Request New Token', children: request_token_child, type: 'platform'},
    {title: 'Finbyte Markdown', children: null, type: 'style'},
    {title: 'Platform Emojis', children: null, type: 'style'},
    {title: 'Edit Content', children: null, type: 'platform'},
    {title: 'Register to Finbyte', children: null, type: 'account'},
    {title: 'Change your Username', children: null, type: 'account'},
    {title: 'Delete your account', children: null, type: 'account'},
  ];

  const about_integrations = [
    {title: 'MeshSDK', children: null, type: 'wallet', image: 'https://meshjs.dev/logo-mesh/white/logo-mesh-white-64x64.png'},
    {title: 'DexHunter', children: null, type: 'trade', image: 'https://www.dexhunter.io/_next/static/media/hunt-token.0f202821.svg'},
    {title: 'PoolPM', children: null, type: 'blockchain', image: 'https://pool.pm/pool.pm.svg'},
    {title: 'Blockfrost', children: null, type: 'blockchain', image: 'https://pbs.twimg.com/profile_images/1683911708719316992/n9LpcKJk_400x400.png'},
  ];

  const defaultFilter: help_type = 'platform';

  const [active_help_filter, set_active_help_filter] = useState<help_type | null>(defaultFilter);
  const [filtered_help_items, set_filtered_help_items] = useState(
    help_items.filter(item => item.type === defaultFilter)
  );

  const handle_help_filter = (type: help_type) => {
    set_filtered_help_items(help_items.filter(item => item.type === type));
    set_active_help_filter(type);
  };

  const reset_help_filter = () => {
    set_filtered_help_items(help_items);
    set_active_help_filter(null);
  };

  return (
    <>
      <SiteHeader title='Get Help'/>

      <div className="flex flex-1 flex-col">
        {!close_banner && (
          <Banner text="This page is under construction" subtext="Things on this page may be incorrect or not work as intended." on_close={() => set_close_banner(true)}/>
        )}

        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <div className="grid lg:grid-cols-2 gap-4" style={{ placeItems: 'start' }}>
            <div className="flex flex-col w-full gap-2">
              <h1 className="font-semibold text-sm">
                Help Guides
              </h1>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={reset_help_filter} disabled={active_help_filter === null}>
                  All Guides
                </Button>
                <Button variant="ghost" onClick={() => handle_help_filter("platform")} disabled={active_help_filter === "platform"}>
                  Platform
                </Button>
                <Button variant="ghost" onClick={() => handle_help_filter("account")} disabled={active_help_filter === "account"}>
                  Account
                </Button>
                <Button variant="ghost" onClick={() => handle_help_filter("style")} disabled={active_help_filter === "style"}>
                  Style
                </Button>
              </div>

              {/**
               * @note Why this works:
               * React sees that the parent div has a different key,
               * so it unmounts the whole thing and remounts it, triggering
               * the animations again.
               */}
              <ScrollArea>
              <Accordion className="max-h-[500px] pr-4" type='single' collapsible key={filtered_help_items.map(i => i.title).join(',')}>
                {filtered_help_items.map((item, index) => (
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
                          {/** @note the circle is only to removed once we've done everything! */}
                          <div className={`ml-auto size-3 rounded-full ${item.children === null ? 'bg-red-400' : 'bg-amber-400'}`}/>
                          <Badge variant='secondary'>{item.type}</Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>{item.children}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
              </ScrollArea>
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
                        <div className="flex w-full justify-end items-center gap-2">
                          {/** @note the circle is only to removed once we've done everything! */}
                          <div className={`ml-auto size-3 rounded-full ${item.children === null ? 'bg-red-400' : 'bg-amber-400'}`}/>
                          <Badge variant='secondary'>{item.type}</Badge>
                        </div>
                        </AccordionTrigger>
                      <AccordionContent>
                        {item.children}
                      </AccordionContent>
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