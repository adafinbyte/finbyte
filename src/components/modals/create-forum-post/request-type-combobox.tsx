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

const request_types = [
  {
    value: "token",
    label: "Request Token",
  },
  {
    value: "feature",
    label: "Request Feature",
  },
]

interface custom_props {
  on_selected: (value: string) => void;
}

const RequestTypeComboBox: React.FC <custom_props> = ({
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
            ? request_types.find((type) => type.value === value)?.label
            : "Select request type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:border-neutral-800">
        <Command>
          <CommandList>
            <CommandEmpty>No types found.</CommandEmpty>
            <CommandGroup>
              {request_types.map((type, index) => (
                <CommandItem
                  key={index}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {type.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === type.value ? "opacity-100" : "opacity-0"
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

export default RequestTypeComboBox;