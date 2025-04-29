import { FC, useContext, useEffect, useState } from 'react';
import { Copy, HeartCrack, HeartHandshake, Settings, Share, Users, X } from 'lucide-react';
import FormatAddress from '../format-address';
import { capitalize_first_letter, copy_to_clipboard } from '@/utils/string-tools';
import { FinbyteContext } from '@/contexts';
import useThemedProps from '@/contexts/themed-props';
import ComboBox from '../combobox';
import { get_themes, Themes } from '@/contexts/utils';
import curators_list from '@/verified/curators';
import { a } from 'framer-motion/client';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  curators: string[];
}

const CuratorsModal: FC <custom_props> = ({
  is_modal_open, close_modal, curators
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
        <div className={`border-b ${themed['700'].border}  p-4 flex justify-between items-center items-start`}>
          <div className="flex flex-col">
            <div className='inline-flex items-center gap-2'>
              <Users size={18} className='text-blue-400'/>
              <h1 className={`text-lg ${themed['300'].text} font-semibold`}>Curators</h1>
            </div>
            <p className={`text-sm ${themed['500'].text}`}>These are the people that help build this specific page.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg`}>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-4 ${themed['300'].text} text-center w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-64 ${themed.webkit_scrollbar}`}>

          <div>
            {curators.map((curator, index) => {
              const details = curators_list.find((a) => a.slug === curator);

              return (
                <div>
                  {details?.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuratorsModal;