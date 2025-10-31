import { Search, X } from 'lucide-react';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/src/components/atoms';

interface ProductSearchProps {
  keyword: string;
  onSearch: (s: string) => void;
  debounceDelay?: number;
  showClearButton?: boolean;
}
export default function ProductSearch({
  keyword,
  onSearch,
  debounceDelay = 300,
  showClearButton = false,
}: ProductSearchProps): JSX.Element {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState(keyword);

  const triggerSearch = useCallback(
    (value: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, debounceDelay);
    },
    [debounceDelay]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    onSearch('');
    searchInputRef.current?.focus();
  }, [onSearch]);

  useEffect(() => {
    if (searchQuery) {
      triggerSearch(searchQuery);
    } else {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch('');
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery, triggerSearch]);

  return (
    <div className='relative flex w-full'>
      <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
      <Input
        inputSize='lg'
        ref={searchInputRef}
        placeholder={'Search products...'}
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
        }}
        className='pl-12 w-full pr-4 py-4 text-base rounded-xl border-2 border-gray-200 shadow-sm'
      />
      {showClearButton && searchQuery && (
        <button
          type='button'
          onClick={handleClearSearch}
          className='absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors'
          aria-label='Clear search'
        >
          <X className='w-4 h-4 text-gray-500' />
        </button>
      )}
    </div>
  );
}
