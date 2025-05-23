"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const sections = [
  {
    value: 'all',
    label: "All Posts",
  },
  {
    value: "general",
    label: "General",
  },
  {
    value: "requests",
    label: "Requests",
  },
  {
    value: "finbyte",
    label: "Finbyte",
  },
]

interface custom_props {
  on_selected: (value: string) => void;
}

const FilterSectionsComboBox: React.FC <custom_props> = ({
  on_selected
}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("");
  

  React.useEffect(() => {
    on_selected(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="col-span-2 justify-between"
        >
          {value
            ? sections.find((section) => section.value === value)?.label
            : "Select section..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:border-neutral-800">
        <Command>
          <CommandInput placeholder="Search for section..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sections found.</CommandEmpty>
            <CommandGroup>
              {sections.map((section, index) => (
                <CommandItem
                  key={index}
                  value={section.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {section.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === section.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default FilterSectionsComboBox;