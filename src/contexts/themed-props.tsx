import { useContext, useEffect, useState } from 'react';
import { FinbyteContext } from '.';
import { Themes } from './utils';

interface types {bg: string; border: string; fill: string; shadow: string; text: string;}
interface ThemedProps {
  '100': types;
  '200': types;
  '300': types;
  '400': types;
  '500': types;
  '600': types;
  '700': types;
  '800': types;
  '900': types;
  '950': types;

  effects: {
    transparent_button: {
      /** @note hover:bg-theme */
      hover: string;
      /** @note hover:bg-theme */
      hover_darker: string;
    };
  };

  /** @note implements the full scrollbar, just add height */
  webkit_scrollbar: string;
}

const themeStyles: Record<Themes, ThemedProps> = {
  Neutral: {
    '100': {
      bg:     'bg-neutral-100',
      border: 'border-neutral-100',
      fill:   'fill-neutral-100',
      shadow: 'shadow-neutral-100',
      text:   'text-neutral-100',
    },
    '200':  {
      bg:     'bg-neutral-200',
      border: 'border-neutral-200',
      fill:   'fill-neutral-200',
      shadow: 'shadow-neutral-200',
      text:   'text-neutral-200',
    },
    '300':  {
      bg:     'bg-neutral-300',
      border: 'border-neutral-300',
      fill:   'fill-neutral-300',
      shadow: 'shadow-neutral-300',
      text:   'text-neutral-300',
    },
    '400':  {
      bg:     'bg-neutral-400',
      border: 'border-neutral-400',
      fill:   'fill-neutral-400',
      shadow: 'shadow-neutral-400',
      text:   'text-neutral-400',
    },
    '500':  {
      bg:     'bg-neutral-500',
      border: 'border-neutral-500',
      fill:   'fill-neutral-500',
      shadow: 'shadow-neutral-500',
      text:   'text-neutral-500',
    },
    '600':  {
      bg:     'bg-neutral-600',
      border: 'border-neutral-600',
      fill:   'fill-neutral-600',
      shadow: 'shadow-neutral-600',
      text:   'text-neutral-600',
    },
    '700':  {
      bg:     'bg-neutral-700',
      border: 'border-neutral-700',
      fill:   'fill-neutral-700',
      shadow: 'shadow-neutral-700',
      text:   'text-neutral-700',
    },
    '800':  {
      bg:     'bg-neutral-800',
      border: 'border-neutral-800',
      fill:   'fill-neutral-800',
      shadow: 'shadow-neutral-800',
      text:   'text-neutral-800',
    },
    '900':  {
      bg:     'bg-neutral-900',
      border: 'border-neutral-900',
      fill:   'fill-neutral-900',
      shadow: 'shadow-neutral-900',
      text:   'text-neutral-900',
    },
    '950':  {
      bg:     'bg-neutral-950',
      border: 'border-neutral-950',
      fill:   'fill-neutral-950',
      shadow: 'shadow-neutral-950',
      text:   'text-neutral-950',
    },
    effects: {
      transparent_button: {
        hover: 'hover:bg-neutral-800 active:bg-neutral-800/80',
        hover_darker: 'hover:bg-neutral-900 active:bg-neutral-900/80',
      },
    },
    webkit_scrollbar: 'overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500'
  },
  Slate: {
    '100': {
      bg:     'bg-slate-100',
      border: 'border-slate-100',
      fill:   'fill-slate-100',
      shadow: 'shadow-slate-100',
      text:   'text-slate-100',
    },
    '200':  {
      bg:     'bg-slate-200',
      border: 'border-slate-200',
      fill:   'fill-slate-200',
      shadow: 'shadow-slate-200',
      text:   'text-slate-200',
    },
    '300':  {
      bg:     'bg-slate-300',
      border: 'border-slate-300',
      fill:   'fill-slate-300',
      shadow: 'shadow-slate-300',
      text:   'text-slate-300',
    },
    '400':  {
      bg:     'bg-slate-400',
      border: 'border-slate-400',
      fill:   'fill-slate-400',
      shadow: 'shadow-slate-400',
      text:   'text-slate-400',
    },
    '500':  {
      bg:     'bg-slate-500',
      border: 'border-slate-500',
      fill:   'fill-slate-500',
      shadow: 'shadow-slate-500',
      text:   'text-slate-500',
    },
    '600':  {
      bg:     'bg-slate-600',
      border: 'border-slate-600',
      fill:   'fill-slate-600',
      shadow: 'shadow-slate-600',
      text:   'text-slate-600',
    },
    '700':  {
      bg:     'bg-slate-700',
      border: 'border-slate-700',
      fill:   'fill-slate-700',
      shadow: 'shadow-slate-700',
      text:   'text-slate-700',
    },
    '800':  {
      bg:     'bg-slate-800',
      border: 'border-slate-800',
      fill:   'fill-slate-800',
      shadow: 'shadow-slate-800',
      text:   'text-slate-800',
    },
    '900':  {
      bg:     'bg-slate-900',
      border: 'border-slate-900',
      fill:   'fill-slate-900',
      shadow: 'shadow-slate-900',
      text:   'text-slate-900',
    },
    '950':  {
      bg:     'bg-slate-950',
      border: 'border-slate-950',
      fill:   'fill-slate-950',
      shadow: 'shadow-slate-950',
      text:   'text-slate-950',
    },
    effects: {
      transparent_button: {
        hover: 'hover:bg-slate-800 active:bg-slate-800/80',
        hover_darker: 'hover:bg-slate-900 active:bg-slate-900/80',
      },
    },
    webkit_scrollbar: 'pr-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar-thumb]:bg-slate-500'
  },
};

const defaultThemedProps: ThemedProps = {
  '100': {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '200':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '300':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '400':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '500':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '600':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '700':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '800':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '900':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  '950':  {
    bg:     '',
    border: '',
    fill:   '',
    shadow: '',
    text:   '',
  },
  effects: {
    transparent_button: {
      hover: '',
      hover_darker: ''
    }
  },
  webkit_scrollbar: ''
};

const useThemedProps = (): ThemedProps => {
  const { theme } = useContext(FinbyteContext);

  const [props, setProps] = useState<ThemedProps>(defaultThemedProps);

  useEffect(() => {
    if (theme in themeStyles) {
      setProps(themeStyles[theme as Themes]);
    } else {
      setProps(defaultThemedProps);
    }
  }, [theme]);

  return props;
};

export default useThemedProps;