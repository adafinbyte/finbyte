import { cn } from "@/utils/common";
import { FC, HTMLAttributes } from "react";

interface custom_props extends HTMLAttributes<HTMLDivElement> {
  address: string;

  large_size?: boolean;
}

const FormatAddress: FC <custom_props> = ({
  address, large_size = false, ...props
}) => {

  if (address === '') { return (<></>); }

  return (
    <div {...props} className="inline-flex">
      {address.startsWith('addr') ?
        <span className="flex gap-0.5 items-baseline">
          <span className={cn(
            large_size ? 'text-md' : 'text-xs',
            'opacity-60 font-normal'
          )}
          >
            {address.substring(0, 7) + "..."}
          </span>

          <span className={cn(
            large_size ? 'text-lg' : 'text-base',
            'text-left tracking-wide font-semibold text-blue-500 dark:text-blue-300'
            )}
          >
            {address.substring(address.length - 10)}
          </span>
        </span>
        :
        <span className="inline-flex gap-0.5 items-center">
          <svg className={cn(
            large_size ? 'size-5' : 'size-3',
            'inline-block'
          )}
          viewBox="0 -50 100 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z" fill="#0CD15B"></path></svg>
          <code className={cn(
            large_size ? 'text-lg' : 'text-base',
          )}
        >{address.slice(1)}</code>
        </span>
      }
    </div>
  )
}

export default FormatAddress;