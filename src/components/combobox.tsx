import { Dispatch, FC, SetStateAction, useState } from "react";
import { ChevronDown } from "lucide-react";
import useThemedProps from "@/contexts/themed-props";

type custom_props = {
  items:       string[];
  placeholder: string;
  selected: {
    state: string | null;
    set_state: Dispatch<SetStateAction<string | null>>;
  }
  include_search?: boolean;
};

const ComboBox: FC <custom_props> = ({
  items, placeholder, selected, include_search = false
}) => {
  const themed = useThemedProps();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-64 text-sm text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center border ${themed['700'].border} px-4 py-1 rounded-md ${themed.effects.transparent_button.hover} ${themed['800'].bg}`}
      >
        {selected.state || placeholder}
        <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : ''} duration-300`} />
      </button>

      {isOpen && (
        <div className={`absolute w-full ${themed['800'].bg} border ${themed['700'].border} rounded-md shadow-lg mt-2 p-2 z-[999]`}>
          {include_search && (
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-3 py-2 mb-2 border ${themed['700'].border} ${themed['900'].bg} rounded-md outline-none`}
            />
          )}

          <div className="max-h-40 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    selected.set_state(item);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 ${themed.effects.transparent_button.hover_darker} w-full text-left rounded-md cursor-pointer`}
                >
                  {item}
                </button>
              ))
            ) : (
              <p className={`${themed['500'].text} text-center py-2`}>No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComboBox;