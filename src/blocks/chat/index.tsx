import { FC, useEffect, useState } from "react";
import { ChatForm } from "./chat-box";
import SiteHeader from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetch_chat_posts } from "@/utils/api/fetch/posts";
import { Button } from "@/components/ui/button";
import { format_long_string } from "@/utils/string-tools";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FinbyteChatBlock: FC = () => {
  const [all_authors, set_all_authors] = useState<string[] | null>(null);

  const get_all_authors = async () => {
   const { data: all_posts_data, error: all_posts_error } = await fetch_chat_posts(0);
    if (all_posts_error) {
      toast('Failed to get chat posts', {
        description: all_posts_error
      });
      return;
    }
    if (all_posts_data) {
      const authors = new Set<string>();
      all_posts_data.forEach((post) => {
        authors.add(post.author);
      })
      set_all_authors(Array.from(authors));
    }
  }

  useEffect(() => {
    get_all_authors();
  }, []);

  return (
    <>
      <SiteHeader title="Finbyte Chat"/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main p-2 lg:p-4">
          <div className="grid lg:grid-cols-5 gap-y-2" style={{ placeItems: 'start' }}>
            <Card className="w-full">
              <CardHeader>
                <Label className="text-center">
                  Recent chatters
                </Label>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-1 w-full">
                  {all_authors && (
                    all_authors.map((author, index) => (
                      <Link href={'/address/' + author}>
                        <Badge variant={'secondary'} key={index} className="group w-full">
                          <div className="opacity-80 group-hover:opacity-100">
                            {format_long_string(author)}
                          </div>
                          <div className="ml-auto"/>
                          <ArrowRight className="size-3"/>
                        </Badge>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>              
            </Card>

            <div className="lg:col-span-4 w-full">
              <ChatForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FinbyteChatBlock;