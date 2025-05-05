import { FC, useRef, useState } from "react";
import SiteHeader from "@/components/site-header";
import curated_tokens from "@/verified/tokens";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

const TokensBlock: FC = () => {
  const [search_query, set_search_query] = useState<string>('');

  return (
    <>
      <SiteHeader title='Explore User Curated Tokens'/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              delay: 0.2,
            }}
          >
            <div className="grid gap-2">
              <Label>Search Token</Label>
                <Input
                  value={search_query}
                  onChange={(e) => set_search_query(e.target.value)}
                  placeholder="Search token by name..."
                />
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-4 pt-8" style={{ placeItems: 'start'}}>
              <AnimatePresence mode="wait">
                {curated_tokens.map((token, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      delay: index * 0.2,
                    }}
                    className="w-full"
                  >
                    <Link
                      href={'tokens/' + token.slug_id}
                      key={index}
                    >
                      <Card
                        className={cn(
                          "group relative h-full transition-all duration-300 hover:shadow-lg dark:border-neutral-800",
                          "hover:-translate-y-0.5 will-change-transform",
                          "overflow-hidden"
                        )}
                      >
            <div
              className={cn(
                "absolute inset-0",
                "opacity-20 group-hover:opacity-100",
                "transition-opacity duration-300",
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>

            <CardHeader className="relative space-y-0 p-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10">
                  <img src={token.images.logo} className="rounded-lg"/>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {token.category}
                </span>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-2 p-4 pt-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
                {token.name}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">{token.token_details.ticker}</span>
              </h3>
              <ScrollArea className="w-full">
              <p className="text-sm max-h-20 text-gray-600 dark:text-gray-300 leading-snug font-[425]">{token.description}</p>
              </ScrollArea>
            </CardContent>

            <CardFooter className="relative p-4">
              <div className="flex items-center justify-end w-full">
                <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {"Explore →"}
                </span>
              </div>
            </CardFooter>

            <div
              className={cn(
                "absolute inset-0 -z-10 rounded-xl p-px bg-linear-to-br from-transparent via-gray-200/70 to-transparent dark:via-white/10",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-300",
              )}
            />
          </Card>
        </Link></motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default TokensBlock;