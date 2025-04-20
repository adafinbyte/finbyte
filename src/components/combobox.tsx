import { Dispatch, FC, SetStateAction, useState } from "react";
import { ChevronDown } from "lucide-react";

type custom_props = {
  items:       string[];
  placeholder: string;
  selected: {
    state: string | null;
    set_state: Dispatch<SetStateAction<string | null>>;
  }
};

const ComboBox: FC <custom_props> = ({
  items, placeholder, selected
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-64 text-sm text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center border border-neutral-700 px-4 py-1 rounded-md shadow-sm bg-neutral-800"
      >
        {selected.state || placeholder}
        <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : ''} duration-300`} />
      </button>

      {isOpen && (
        <div className="absolute w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-lg mt-2 p-2 z-10">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 mb-2 border border-neutral-700 bg-neutral-900 rounded-md outline-none"
          />

          <div className="max-h-40 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    selected.set_state(item);
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-neutral-700 rounded-md cursor-pointer"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComboBox;
