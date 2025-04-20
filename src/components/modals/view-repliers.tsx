import { FC, useEffect } from 'react';
import { Copy, MessageCircle, X } from 'lucide-react';
import FormatAddress from '../format-address';
import { copy_to_clipboard } from '@/utils/string-tools';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  post_repliers: string[];
}

/** @note should be an option for forum post */
const ViewRepliersModal: FC <custom_props> = ({
  is_modal_open, close_modal, post_repliers
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

  const count_replies = () => {
    const repliers_count: Record<string, number> = {};
  
    post_repliers.forEach((commenter) => {
      repliers_count[commenter] = (repliers_count[commenter] || 0) + 1;
    });
  
    return Object.entries(repliers_count).map(([author, count]) => ({
      author,
      count,
    }));
  };
  const formatted_repliers = count_replies();

  return (
    <div
      className={`
        fixed inset-0 z-[999] bg-neutral-900 bg-opacity-80 flex justify-center items-center
        transition-opacity duration-300 ease-out
        ${is_modal_open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="bg-neutral-900 border border-neutral-800 shadow-md shadow-neutral-950/40 rounded-lg w-9/12 sm:w-7/12 md:w-5/12 lg:w-3/12 scale-95 transition-transform duration-300 ease-out">
        {/* Modal Header */}
        <div className="border-b border-neutral-800 p-4 flex justify-between items-center items-start">
          <div className="flex flex-col">
            <div className='inline-flex items-center gap-2'>
              <MessageCircle size={18} className='text-blue-400'/>
              <h1 className="text-lg text-neutral-300 font-semibold">Post Repliers</h1>
            </div>
            <p className="text-sm text-neutral-500">View all the post repliers.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className='p-2 hover:bg-neutral-800 rounded-lg'>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 text-neutral-300 w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
          {formatted_repliers.length > 0 ? (
            formatted_repliers.map((author, index) => (
              <button key={index} onClick={() => copy_to_clipboard(author.author)} className='hover:bg-neutral-800 active:opacity-80 p-1 px-2 flex gap-2 items-center rounded-lg'>
                <FormatAddress title={author.author} address={author.author}/>
                <span className='text-blue-400'>
                  <span className='text-neutral-400 text-xs'>
                    x
                  </span>
                  {author.count}
                </span>

                <span className='ml-auto'>
                  <Copy size={14}/>
                </span>
              </button>
            ))
          ) : (
            <p className='text-center text-sm my-auto'>
              We cannot find any replies on this post.<br />
              Shall you be the first?
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="text-xs border-t border-neutral-800 p-4 flex flex-col items-center gap-2">
          <div className='flex w-full'>
            <span className='text-xs text-neutral-400'>
              Total Replies:
              <span className='ml-1 text-blue-400'>{post_repliers.length}</span>
            </span>

            <span className='ml-auto text-xs text-neutral-400'>
              Unique Repliers:
              <span className='ml-1 text-blue-400'>{formatted_repliers.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRepliersModal;