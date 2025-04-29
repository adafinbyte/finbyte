import useThemedProps from '@/contexts/themed-props';
import { EllipsisVertical } from 'lucide-react';
import { FC, HTMLAttributes, ReactNode, useState } from 'react';

interface child_menu_item { icon?: ReactNode; name: string; action: () => void}
interface menu_item { title: string; menu_items: child_menu_item[]}

interface custom_props extends HTMLAttributes<HTMLDivElement> {
  skeleton?: boolean;
  menu?:     menu_item[];
  example?:  boolean;
}

const EllipsisMenu: FC <custom_props> = ({
  skeleton = false, menu, example = false, ...props
}) => {
  const themed = useThemedProps();
  const [is_menu_open, set_is_menu_open] = useState(false);

  const toggle_menu = () => {
    set_is_menu_open(!is_menu_open);
  };

  return (
    <div className="relative">
      <button title='View Options' disabled={example} type="button" onClick={toggle_menu} className={`inline-flex items-center p-2 rounded-lg ${!example && themed.effects.transparent_button.hover}`}>
        <EllipsisVertical className={`${skeleton ? themed['500'].text : themed['400'].text + ' ' + (props.className ? props.className : 'size-8')}`}/>
      </button>

      {is_menu_open && menu && (
        <div className={`z-[10] shadow-lg ${themed['950'].shadow} absolute right-0 mt-2 min-w-56 rounded-lg ${themed['900'].bg} border ${themed['700'].border}`}>
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {menu.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 w-full text-left`}
              >
                <span className={`${themed['500'].text} text-xs font-semibold border-b ${themed['700'].border} p-2 cursor-default`}>
                  {item.title}
                </span>

                <div className='p-1 flex flex-col gap-1 text-sm'>
                  {item.menu_items.map((sub_item, sub_index) => (
                    <div
                      key={sub_index}
                      className={`${themed['400'].text} cursor-pointer flex items-center justify-between px-2 p-1 rounded-lg ${themed.effects.transparent_button.hover}`}
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

    </div>
  );
};

export default EllipsisMenu;
