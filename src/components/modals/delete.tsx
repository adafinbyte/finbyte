import { FC, useEffect } from 'react';
import { Check, Copy, HeartHandshake, Share, Trash, X } from 'lucide-react';
import FormatAddress from '../format-address';
import { copy_to_clipboard } from '@/utils/string-tools';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  on_delete: () => Promise<void>;
}

const DeleteModal: FC <custom_props> = ({
  is_modal_open, close_modal, on_delete
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

  const handle_action = async () => {
    await on_delete();
    close_modal();
  }

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
              <Trash size={18} className='text-rose-400'/>
              <h1 className="text-lg text-neutral-300 font-semibold">Delete Post</h1>
            </div>
            <p className="text-sm text-neutral-500">What happened for this to happen?</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className='p-2 hover:bg-neutral-800 rounded-lg'>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 text-neutral-300 text-center w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <h1 className='font-semibold text-neutral-400'>
            Warning, this action is irreversable and cannot be undone!
          </h1>

          <p className='text-sm'>
            Are you sure you want to delete this post?
          </p>

          <div className='flex gap-2 flex-wrap items-center justify-center mt-2 text-sm'>
            <button onClick={close_modal} className='p-2 duration-300 hover:bg-neutral-800 rounded-lg inline-flex gap-2 items-center'>
              <X size={16}/>
              Go Back
            </button>

            <button onClick={handle_action} className='p-2 duration-300 hover:bg-neutral-800 rounded-lg inline-flex gap-2 items-center'>
              Delete
              <Trash size={16}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeleteModal;