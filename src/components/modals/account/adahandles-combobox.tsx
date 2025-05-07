"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Save } from "lucide-react"

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

interface custom_props {
  on_selected: (value: string) => void;
  on_save_handle?: (value: string) => Promise<void>;
  adahandles: string[];
}

const AdaHandlesComboBox: React.FC <custom_props> = ({
  on_selected, on_save_handle, adahandles
}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("");
  
  React.useEffect(() => {
    on_selected(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex w-full gap-2 justify-between text-left">
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
          >
            {value
              ? adahandles.find((adahandle) => adahandle === value)
              : "Select adahandle..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        {on_save_handle && (
          <Button disabled={!value} onClick={() => on_save_handle(value)} variant='save' size='icon'>
            <Save />
          </Button>
        )}
      </div>
      <PopoverContent className="text-left w-[200px] lg:w-[300px] p-0 dark:border-neutral-800">
        <Command>
          <CommandInput placeholder="Search for section..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sections found.</CommandEmpty>
            <CommandGroup>
              {adahandles.map((adahandle, index) => (
                <CommandItem
                  key={index}
                  value={adahandle}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {adahandle}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === adahandle ? "opacity-100" : "opacity-0"
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

export default AdaHandlesComboBox;