import { FC, useContext, useEffect, useState } from 'react';
import { Check, Copy, HeartCrack, HeartHandshake, Settings, Share, X } from 'lucide-react';
import FormatAddress from '../format-address';
import { capitalize_first_letter, copy_to_clipboard } from '@/utils/string-tools';
import { FinbyteContext } from '@/contexts';
import useThemedProps from '@/contexts/themed-props';
import ComboBox from '../combobox';
import { get_themes, Themes } from '@/contexts/utils';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  token_ticker: string;
  token_image: string;
  on_confirm: () => Promise<void>;
}

const RepCommunityModal: FC <custom_props> = ({
  is_modal_open, close_modal, token_ticker, token_image, on_confirm
}) => {
  useEffect(() => {
    if (is_modal_open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [is_modal_open]);

  const themed = useThemedProps();

  return (
    <div
      className={`
        fixed inset-0 z-[999] ${themed['900'].bg} bg-opacity-80 flex justify-center items-center
        transition-opacity duration-300 ease-out
        ${is_modal_open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className={`${themed['900'].bg} border ${themed['700'].border} shadow-lg ${themed['950'].shadow} rounded-lg w-5/6 lg:w-1/3 scale-95 transition-transform duration-300 ease-out`}>
        {/* Modal Header */}
        <div className={`border-b ${themed['700'].border} p-4 flex justify-between items-center items-start`}>
          <div className="flex flex-col">
            <div className='inline-flex items-center gap-2'>
              <img src={token_image} className={`${themed['400'].text} size-4`}/>
              <h1 className={`text-lg ${themed['300'].text} font-semibold`}>Represent Community</h1>
            </div>
            <p className={`text-sm ${themed['500'].text}`}>Build a stronger connection with your favourite community.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg`}>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-4 ${themed['300'].text} text-center w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-64 ${themed.webkit_scrollbar}`}>
          <h1 className={`font-semibold ${themed['400'].text}`}>
            You are about to represent this community.
          </h1>

          <p className='text-sm w-3/4 mx-auto'>
            You are only allowed to represent one community at a time but you are free to update it to a new one and come back if you desire!
          </p>

          <div className='flex gap-2 flex-wrap items-center justify-center mt-6 text-sm'>
            <button onClick={close_modal} className={`p-2 duration-300 ${themed.effects.transparent_button.hover} rounded-lg inline-flex gap-2 items-center`}>
              <X size={16}/>
              Go Back
            </button>

            <button onClick={on_confirm} className={`p-2 duration-300 ${themed.effects.transparent_button.hover} rounded-lg inline-flex gap-2 items-center`}>
              Confirm
              <Check size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepCommunityModal;