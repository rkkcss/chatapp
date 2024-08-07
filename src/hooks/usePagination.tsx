import { useCallback, useRef, useState } from "react";

// Define the pagination state type
interface PaginationState {
    page: number;
    last: boolean;
}

// Define the return type of the hook
interface UsePaginationResult {
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    lastElementRef: (node: HTMLElement | null) => void;
}

function usePagination(initialPage = 0): UsePaginationResult {
    const [pagination, setPagination] = useState<PaginationState>({
        page: initialPage,
        last: false,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (observer.current) {
                observer.current.disconnect();
            }
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !pagination.last) {
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                }
            });
            if (node) {
                observer.current.observe(node);
            }
        },
        [pagination.last]
    );

    return { pagination, setPagination, loading, lastElementRef, setLoading };
}

export default usePagination;
