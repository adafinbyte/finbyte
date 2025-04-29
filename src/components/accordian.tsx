//https://www.ui-layouts.com/components/accordion
import React, { ReactNode, isValidElement } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

type AccordionContextType = {
  isActive: boolean;
  value: string;
  onChangeIndex: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextType>({
  isActive: false,
  value: '',
  onChangeIndex: () => {}
});

const useAccordion = () => React.useContext(AccordionContext);

export function AccordionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-1 ` + className}>{children}</div>
  );
}

export function AccordionWrapper({ 
  children 
}: { 
  children: ReactNode 
}) {
  return <div>{children}</div>;
}

export function Accordion({
  children,
  multiple,
  defaultValue,
}: {
  children: ReactNode;
  multiple?: boolean;
  defaultValue?: string | string[];
}) {
  const [activeIndex, setActiveIndex] = React.useState<string[]>(
    multiple ? (defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []) : 
    (defaultValue ? (Array.isArray(defaultValue) ? [defaultValue[0]] : [defaultValue]) : [])
  );

  function onChangeIndex(value: string) {
    setActiveIndex((currentActiveIndex) => {
      if (!multiple) {
        return value === currentActiveIndex[0] ? [] : [value];
      }

      if (currentActiveIndex.includes(value)) {
        return currentActiveIndex.filter((i) => i !== value);
      }

      return [...currentActiveIndex, value];
    });
  }

  return React.Children.map(children, (child) => {
    if (!isValidElement<{ value?: string }>(child)) return null;

    const value = child.props.value ?? '';
    const isActive = multiple
      ? activeIndex.includes(value)
      : activeIndex[0] === value;

    return (
      <AccordionContext.Provider value={{ isActive, value, onChangeIndex }}>
        {React.cloneElement(child)}
      </AccordionContext.Provider>
    );
  });
}

export function AccordionItem({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: string 
}) {
  const { isActive } = useAccordion();

  return (
    <div
      data-active={isActive || undefined}
      className={`overflow-hidden ${
        isActive
          ? 'active border border-neutral-700 bg-neutral-800'
          : 'bg-transparent border border-neutral-700'
      }
    `}
      data-value={value}
    >
      {children}
    </div>
  );
}

export function AccordionHeader({
  children,
  customIcon,
  className
}: {
  children: ReactNode;
  customIcon?: boolean;
  className?: string;
}) {
  const { isActive, value, onChangeIndex } = useAccordion();

  return (
    <motion.div
      data-active={isActive || undefined}
      className={`group p-2 px-4 cursor-pointer transition-all font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 flex justify-between items-center ${
        isActive
          ? 'active bg-neutral-800'
          : 'bg-neutral-900'
      }
      `}
      onClick={() => onChangeIndex(value)}
    >
      {children}
      {!customIcon && (
        <ChevronDown size={20}
          className={`transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`}
        />
      )}
    </motion.div>
  );
}

export function AccordionPanel({ 
  children,
  className
}: { 
  children: ReactNode;
  className?: string;
}) {
  const { isActive } = useAccordion();

  return (
    <AnimatePresence initial={true}>
      {isActive && (
        <motion.div
          data-active={isActive || undefined}
          initial={{ height: 0, overflow: 'hidden' }}
          animate={{ height: 'auto', overflow: 'hidden' }}
          exit={{ height: 0 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
          className={`group bg-[#F2F2F2] ` + className}
        >
          <motion.article
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
            exit={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            }}
            transition={{
              type: 'spring',
              duration: 0.4,
              bounce: 0,
            }}
            className={`px-2 py-4 bg-neutral-900 text-neutral-300 max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500`}
          >
            {children}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}