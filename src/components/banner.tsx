import { cn } from "@/lib/utils";
import { FC } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface custom_props {
  text: string;
  subtext?: string;
  on_close?: () => void;
}

const Banner: FC <custom_props> = ({
  text, subtext, on_close
}) => {

  return (
    <div className={cn(
      "w-full flex flex-col gap-2",
      "relative"
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "opacity-20 group-hover:opacity-100",
          "transition-opacity duration-300",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,1)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.5)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <div className="flex gap-2 items-center justify-between py-2 px-4 relative">
        <div className="flex-col gap-1 ">
          <Label className="opacity-80 text-xs">
            {text}
          </Label>
          {subtext && (
            <p className="opacity-80 text-sm">{subtext}</p>
          )}
        </div>

        {on_close && (
          <Button variant='ghost' size='icon' onClick={() => on_close?.()}><X /></Button>
        )}
      </div>
    </div>
  )
}

export default Banner;