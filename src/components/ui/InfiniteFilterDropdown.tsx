import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import classNames from "classnames";

interface Option {
  id: string;
  label: string;
  subLabel?: string;
}

interface InfiniteFilterDropdownProps {
  label: string;
  queryKey: string[];
  fetchFn: (pageParam: number) => Promise<{ data: any[]; nextCursor?: number }>;
  mapDataToOption: (data: any) => Option;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const InfiniteFilterDropdown: React.FC<InfiniteFilterDropdownProps> = ({
  label,
  queryKey,
  fetchFn,
  mapDataToOption,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // React Query khusus Infinite Scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 0 }) => fetchFn(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0,
    });

  // Hook untuk deteksi scroll mentok bawah
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Handle klik item (Toggle selection)
  const handleSelect = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="relative">
      {/* Tombol Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700"
      >
        <span className="truncate">
          {selectedValues.length > 0
            ? `${selectedValues.length} ${label} Dipilih`
            : `Pilih ${label}`}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-20 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-xs">
                Memuat data...
              </div>
            ) : (
              <div className="space-y-1">
                {data?.pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {group.data.map((item: any) => {
                      const opt = mapDataToOption(item);
                      const isSelected = selectedValues.includes(opt.id);

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelect(opt.id)}
                          className={classNames(
                            "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm",
                            isSelected
                              ? "bg-blue-50 border-blue-100"
                              : "hover:bg-gray-50",
                          )}
                        >
                          <div
                            className={classNames(
                              "w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0",
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-300 bg-white",
                            )}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {opt.label}
                            </div>
                            {opt.subLabel && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {opt.subLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* Element trigger untuk load more */}
                <div
                  ref={ref}
                  className="py-2 text-center text-xs text-gray-400"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={14} /> Memuat
                      lebih banyak...
                    </span>
                  ) : hasNextPage ? (
                    "Scroll untuk memuat lagi"
                  ) : (
                    "Semua data termuat"
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
