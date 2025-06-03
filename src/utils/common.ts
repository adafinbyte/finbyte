import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copy_to_clipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Copied to clipboard!');
    })
    .catch(err => {
      toast.error('Failed to clipboard.');
    });
};

export const capitalize_first_letter = (word: string) => {
  return word[0].toUpperCase() + word.slice(1)
}

export const get_timestamp = () => {
  return Math.floor(Date.now() / 1000);
}