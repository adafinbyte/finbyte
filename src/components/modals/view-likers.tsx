import { FC, useEffect } from 'react';
import { Copy, HeartHandshake, X } from 'lucide-react';
import FormatAddress from '../format-address';
import { copy_to_clipboard } from '@/utils/string-tools';
import useThemedProps from '@/contexts/themed-props';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  post_likers: string[];
}

const ViewLikersModal: FC <custom_props> = ({
  is_modal_open, close_modal, post_likers
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
              <HeartHandshake size={18} className='text-blue-400'/>
              <h1 className={`text-lg ${themed['300'].text} font-semibold`}>Post Likers</h1>
            </div>
            <p className={`text-sm ${themed['500'].text}`}>View all the addresses that have liked this post.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg`}>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-4 ${themed['300'].text} text-center w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-64 ${themed.webkit_scrollbar}`}>
          {post_likers.length > 0 ? (
            post_likers.map((liker, index) => (
              <button key={index} onClick={() => copy_to_clipboard(liker)} className={`${themed.effects.transparent_button.hover} p-1 px-2 flex justify-between items-center rounded-lg`}>
                <FormatAddress title={liker} address={liker}/>
                <Copy size={14}/>
              </button>
            ))
          ) : (
            <p className='text-center text-sm my-auto'>
              We cannot find any likers on this post.<br />
              Shall you be the first?
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`text-xs border-t ${themed['700'].border} p-4 flex flex-col items-center gap-2`}>
          <div className='flex w-full'>
            <span className={`ml-auto text-xs ${themed['700'].border} text-neutral-400`}>
              Post Likers:
              <span className='ml-1 text-blue-400'>{post_likers.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLikersModal;