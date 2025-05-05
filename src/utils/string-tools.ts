import { toast } from "@/hooks/use-toast";

export const format_long_string = (str: string): string => {
  return str.length > 14 ? str.substring(0, 14) + "..." : str;
}

export function format_unix(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const now = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formatted_day = day < 10 ? `0${day}` : day;
  const formatted_month = month < 10 ? `0${month}` : month;

  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  let time_ago = '';
  if (diffInDays === 0) {
    time_ago = 'Today';
  } else if (diffInDays === 1) {
    time_ago = 'Yesterday';
  } else {
    time_ago = `${diffInDays.toLocaleString()} days ago`;
  }

  const data = {
    time_ago,
    date: `${formatted_day}/${formatted_month}/${year}`
  }

  return data;
}

export const capitalize_first_letter = (word: string) => {
  return word[0].toUpperCase() + word.slice(1)
}

export const copy_to_clipboard = (text: string, toast_message: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: toast_message,
      });
    })
    .catch(err => {
      toast({
        title: 'Failed to clipboard.',
        description: err,
        variant: 'destructive'
      });
    });
};