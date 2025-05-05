import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FilterIcon } from "lucide-react"
import { FC } from "react"
import FilterSectionsComboBox from "./filter-sections"

interface custom_props {
  on_filter: (by_section: string) => void;
}

const FilterButton: FC <custom_props> = ({
  on_filter
}) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 dark:border-neutral-800 mt-2">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Posts</h4>
            <p className="text-sm text-muted-foreground">
              Filter the posts how you like.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Sections</Label>
              <FilterSectionsComboBox on_selected={on_filter}/>
            </div>

          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterButton;