// components/SettingsModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { FC, useEffect, useState } from "react"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SettingsModal: FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const [isDark, setIsDark] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = storedTheme === "dark" || (!storedTheme && prefersDark);
    setIsDark(dark);
    setTheme(storedTheme??'');
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
    setTheme(newTheme);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Platform Settings</DialogTitle>
          <DialogDescription>
            Edit your personal preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label>
            Theme Select
          </Label>
          <div className="flex gap-4">
            <Button disabled={!isDark} variant={!isDark ? 'default' : 'outline'} onClick={toggleTheme} type="submit">
              <Sun/>
            </Button>

            <Button disabled={isDark} variant={isDark ? 'default' : 'outline'} onClick={toggleTheme} type="submit">
              <Moon/>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
