import { useEffect, useRef, useState } from "react";

export const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const timer = useRef<number>();

    useEffect(() => {
        timer.current = window.setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            window.clearTimeout(timer.current);
        };
    }, [value, delay]);

    return debouncedValue;
};
