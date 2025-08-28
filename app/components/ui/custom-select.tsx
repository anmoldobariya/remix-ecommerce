import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "~/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ options, value, onChange, placeholder = "Select an option", className, disabled = false, ...props }, _ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Close dropdown on escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, []);

    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const currentIndex = options.findIndex(option => option.value === value);
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            onChange(options[nextIndex].value);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const currentIndex = options.findIndex(option => option.value === value);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            onChange(options[prevIndex].value);
          }
          break;
      }
    };

    return (
      <div className={cn("relative w-full", className)} ref={selectRef} {...props}>
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer transition-all duration-200",
            "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            disabled && "cursor-not-allowed opacity-50",
            isOpen && "ring-2 ring-blue-500 border-blue-500",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          <span className={cn(
            "block truncate",
            !selectedOption && "text-gray-500"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
            <ul
              role="listbox"
              className="max-h-60 overflow-auto rounded-md py-1 text-sm"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-150",
                    "hover:bg-blue-50 hover:text-blue-900",
                    option.value === value && "bg-blue-100 text-blue-900"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="block truncate font-medium">
                    {option.label}
                  </span>
                  {option.value === value && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
