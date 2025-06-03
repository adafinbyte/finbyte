import curated_tokens from "@/verified/tokens";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useRouter } from "next/router";

const ExploreProjects: FC = () => {
  const router = useRouter();

  const [page, set_page] = useState(0);
  const [hide_all, set_hide_all] = useState(false);

  const PAGE_SIZE = 10;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginated_tokens = curated_tokens.slice(start, end);
  const total_pages = Math.ceil(curated_tokens.length / PAGE_SIZE);


  const testnet_token_list = ['Finbyte'];

  const handle_discover_project = (slug: string) => {
    router.push('/projects/' + slug);
  }

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Explore Projects</h2>
        <Button onClick={() => set_hide_all(!hide_all)} size="sm" className="scale-[80%]" variant='secondary'>
          {hide_all ? 'Show Projects' : 'Hide Projects'}
        </Button>
      </div>

      {hide_all ?
        <div className="bg-secondary rounded-lg opacity-60 p-2">
          <div className="flex justify-center w-full">
            <h1 className="text-sm font-semibold">Projects Hidden</h1>
          </div>
        </div>
        :
        <div className="grid w-full gap-y-4">
          {paginated_tokens.map((token, index) => (
            <div key={start + index} className="hover:-translate-y-0.5 duration-300 bg-secondary p-4 rounded-xl flex justify-between items-center gap-4 lg:gap-8">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-4 items-center">
                  <div className="min-w-16 text-center text-xs border border-muted-foreground p-1 rounded-lg">
                    <span className="text-green-400">$</span>{token.token_details.ticker}
                  </div>

                  <h1 className="font-bold text-primary text-sm">
                    {token.name}
                  </h1>

                  {testnet_token_list.includes(token.name) && (
                    <div className="text-center text-xs ml-auto border dark:border-red-400 dark:text-red-400 border-red-500 text-red-500 p-1 rounded-lg">
                      Testnet Asset
                    </div>
                  )}
                </div>

                <div className="text-sm opacity-80">
                  {token.description}
                </div>

                <div>
                  <Button onClick={() => handle_discover_project(token.slug_id)} size='sm' variant='link' >
                    Discover ${token.token_details.ticker}
                  </Button>
                </div>
              </div>

              <img src={token.images.logo} className="size-14 rounded-lg" />
            </div>
          ))}

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => set_page((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
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
            >
              Next
            </Button>
          </div>
        </div>
      }
    </div>
  );
};

export default ExploreProjects;
