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
  const [selected_category, set_selected_category] = useState<string | null>(null);

  const category_counts: Record<string, number> = {};

  curated_tokens.forEach(token => {
    const category = token.category || "Uncategorized";
    category_counts[category] = (category_counts[category] || 0) + 1;
  });

  const uniqueCategories = Object.keys(category_counts);

  const PAGE_SIZE = 10;
  const start = page * PAGE_SIZE;

  const filtered_tokens = curated_tokens.filter(token => {
    const matches_search =
      token.slug_id.toLowerCase().includes(search_query.toLowerCase()) ||
      token.name.toLowerCase().includes(search_query.toLowerCase()) ||
      token.token_details.ticker.toLowerCase().includes(search_query.toLowerCase()) ||
      token.token_details.policy?.toLowerCase().includes(search_query.toLowerCase());

    const matches_category = selected_category === null || token.category === selected_category;

    return matches_search && matches_category;
  });

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
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selected_category === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => set_selected_category(null)}
            >
              All ({curated_tokens.length})
            </Button>

            {uniqueCategories.map((category) => (
              <Button
                key={category}
                variant={selected_category === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => set_selected_category(category)}
              >
                {category} ({category_counts[category]})
              </Button>
            ))}
          </div>

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
            {paginated_tokens.map((token, index) => (
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
                    <div className="max-h-24 text-sm opacity-80 pr-4">
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
