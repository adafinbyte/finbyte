import { EllipsisVertical } from 'lucide-react';
import { FC, HTMLAttributes, ReactNode, useState } from 'react';

interface menu_item { icon?: ReactNode; name: string; action: () => void}
interface alt_menu { title: string; menu_items: menu_item[]}

interface custom_props {
  menu_items?:  menu_item[];
  button_size?: number;
  skeleton?:    boolean;
  alt_menu?:    alt_menu[];
}

const EllipsisMenu: FC <custom_props> = ({
  menu_items, button_size = 18, skeleton = false, alt_menu
}) => {
  const [is_menu_open, set_is_menu_open] = useState(false);

  const toggle_menu = () => {
    set_is_menu_open(!is_menu_open);
  };

  return (
    <div className="relative">
      <button title='View Options' type="button" onClick={toggle_menu} className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg focus:z-10 focus:outline-hidden text-neutral-500 hover:bg-neutral-800 active:bg-neutral-800/60">
        <EllipsisVertical size={button_size} className={`${skeleton ? "text-neutral-500/20" : "text-neutral-400"}`}/>
      </button>

      {is_menu_open && alt_menu && (
        <div className="z-[10] shadow-lg shadow-neutral-950 absolute right-0 mt-2 min-w-56 rounded-lg bg-neutral-900 border border-neutral-700">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {alt_menu.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 w-full text-left`}
              >
                <span className='text-neutral-500 font-semibold border-b border-neutral-700 p-2 cursor-default'>
                  {item.title}
                </span>

                <div className='p-1 flex flex-col gap-1 text-sm'>
                  {item.menu_items.map((sub_item, sub_index) => (
                    <div
                      key={sub_index}
                      className='cursor-pointer flex items-center justify-between px-2 p-1 rounded-lg hover:bg-neutral-800'
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        sub_item.action();
                        set_is_menu_open(false);
                      }}
                    >
                      {sub_item.name}
                      {sub_item.icon}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {is_menu_open && menu_items && (
        <div className="z-[10] shadow-lg shadow-neutral-950 absolute right-0 mt-2 min-w-48 rounded-lg bg-neutral-900 border border-neutral-700">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {menu_items.map((item, index) => (
              <div
                key={index}
                className={`${index === 0 && "rounded-t-lg"} ${menu_items.length - 1 === index && "rounded-b-lg"} cursor-pointer flex items-center gap-x-2 block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800`}
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  item.action();
                  set_is_menu_open(false);
                }}
              >
                {item.name}
                <span className='ml-auto'>
                  {item.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;
