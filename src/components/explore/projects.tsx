import curated_tokens from "@/verified/tokens";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Input } from "../ui/input";

const ExploreProjects: FC = () => {
  const router = useRouter();

  const [page, set_page] = useState(0);
  const [hide_all, set_hide_all] = useState(false);
  const [search_query, set_search_query] = useState('');

  const finbyte_token = curated_tokens.find(a => a.slug_id === 'finbyte')!!;
  const PAGE_SIZE = 10;
  const start = page * PAGE_SIZE;

  const filtered_tokens = curated_tokens.filter(token =>
    token.slug_id.toLowerCase().includes(search_query.toLowerCase()) ||
    token.name.toLowerCase().includes(search_query.toLowerCase()) ||
    token.token_details.ticker.toLowerCase().includes(search_query.toLowerCase()) ||
    token.token_details.policy?.toLowerCase().includes(search_query.toLowerCase())
  );

  const total_pages = Math.ceil(filtered_tokens.length / PAGE_SIZE);
  const paginated_tokens = filtered_tokens.slice(start, start + PAGE_SIZE);

  const handle_discover_project = (slug: string) => {
    router.push('/projects/' + slug);
  }

  return (
    <div>
      <div className="flex w-full justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Explore Tokens</h2>
        <Button onClick={() => set_hide_all(!hide_all)} size="sm" className="scale-[80%]" variant='secondary'>
          {hide_all ? 'Show Tokens' : 'Hide Tokens'}
        </Button>
      </div>

      {/** @todo search input here */}

      {hide_all ?
        <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-2">
          <div className="flex justify-center w-full">
            <h1 className="text-sm text-muted-foreground font-semibold">Tokens Hidden</h1>
          </div>
        </div>
        :
        <>
          <div className="grid w-full gap-y-4">
            <div className="hover:-translate-y-0.5 duration-300 bg-secondary/20 backdrop-blur-lg p-4 rounded-xl flex justify-between items-center gap-4 lg:gap-8">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-4 items-center">
                  <div className="min-w-16 text-center text-xs border border-muted-foreground p-1 rounded-lg">
                    <span className="text-green-400">$</span>{finbyte_token.token_details.ticker}
                  </div>

                  <h1 className="font-bold text-primary text-sm">
                    {finbyte_token.name}
                  </h1>

                  <div className="text-center text-xs ml-auto border dark:border-red-400 dark:text-red-400 border-red-500 text-red-500 p-1 rounded-lg">
                    Testnet Asset
                  </div>
                </div>

                <ScrollArea>
                  <div className="h-24 text-sm opacity-80 pr-4">
                    {finbyte_token.description}
                  </div>
                  <ScrollBar orientation="horizontal"/>
                </ScrollArea>

                <div>
                  <Button onClick={() => handle_discover_project(finbyte_token.slug_id)} size='sm' variant='link' >
                    Discover ${finbyte_token.token_details.ticker}
                  </Button>
                </div>
              </div>

              <img src={finbyte_token.images.logo} className="size-14 rounded-lg" />
            </div>
          </div>

          <hr className="dark:border-slate-800 my-4"/>

          <Input
            placeholder="Search token name/slug/ticker/policy..."
            value={search_query}
            onChange={(e) => {
              set_search_query(e.target.value);
              set_page(0);
            }}
            className="mb-4 w-full"
          />

          {filtered_tokens.length === 0 && (
            <div className="font-semibold text-muted-foreground text-center py-8">
              No tokens match your search.
            </div>
          )}

          <div className="grid gap-4 w-full gap-y-4 items-start">
            {paginated_tokens.map((token, index) => (token.slug_id !== 'finbyte') &&(
              <div key={start + index} className="hover:-translate-y-0.5 duration-300 bg-secondary/20 backdrop-blur-lg p-4 rounded-xl flex justify-between items-center gap-4 lg:gap-8">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-4 items-center">
                    <div className="min-w-16 text-center text-xs border border-muted-foreground p-1 rounded-lg">
                      <span className="text-green-400">$</span>{token.token_details.ticker}
                    </div>

                    <h1 className="font-bold text-primary text-sm">
                      {token.name}
                    </h1>
                  </div>

                  <ScrollArea>
                    <div className="max-h-24 text-sm opacity-80">
                      {token.description}
                    </div>
                  </ScrollArea>

                  <div>
                    <Button onClick={() => handle_discover_project(token.slug_id)} size='sm' variant='link' >
                      Discover ${token.token_details.ticker}
                    </Button>
                  </div>
                </div>

                <img src={token.images.logo} className="size-14 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => set_page((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              size='sm'
            >
              Back
            </Button>

            <p className="text-sm text-muted-foreground">
              Page {page + 1} of {total_pages}
            </p>

            <Button
              variant="outline"
              onClick={() => set_page((prev) => Math.min(prev + 1, total_pages - 1))}
              disabled={page >= total_pages - 1}
              size='sm'
            >
              Next
            </Button>
          </div>
        </>
      }
    </div>
  );
};

export default ExploreProjects;
