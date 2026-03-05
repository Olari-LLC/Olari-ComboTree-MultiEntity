import { RefObject, useState, useCallback, useRef, useEffect } from "react";
import { ActionValue } from "mendix";

interface UseDropdownProps {
    onOpenAction?: ActionValue;
    onCloseAction?: ActionValue;
}

interface UseDropdownResult {
    isOpen: boolean;
    filterText: string;
    setFilterText: (text: string) => void;
    open: () => void;
    close: () => void;
    toggle: () => void;
    containerRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
}

export function useDropdown(props: UseDropdownProps): UseDropdownResult {
    const { onOpenAction, onCloseAction } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [filterText, setFilterText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const open = useCallback(() => {
        setIsOpen(true);
        if (onOpenAction?.canExecute) {
            onOpenAction.execute();
        }
    }, [onOpenAction]);

    const close = useCallback(() => {
        setIsOpen(false);
        setFilterText("");
        if (onCloseAction?.canExecute) {
            onCloseAction.execute();
        }
    }, [onCloseAction]);

    const toggle = useCallback(() => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }, [isOpen, open, close]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, close]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                close();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    return { isOpen, filterText, setFilterText, open, close, toggle, containerRef, inputRef };
}
