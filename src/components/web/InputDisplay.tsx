import { KeyboardEvent, MouseEvent, ReactElement } from "react";
import classNames from "classnames";

interface InputDisplayProps {
    selectedCaptions: string[];
    selectedItemsDisplay: "text" | "chips" | "count";
    placeholder: string;
    isOpen: boolean;
    clearable: boolean;
    onToggle: () => void;
    onClear: () => void;
    readOnly: boolean;
    tabIndex?: number;
    ariaLabel?: string;
    inputId?: string;
}

export function InputDisplay(props: InputDisplayProps): ReactElement {
    const {
        selectedCaptions,
        selectedItemsDisplay,
        placeholder,
        isOpen,
        clearable,
        onToggle,
        onClear,
        readOnly,
        tabIndex,
        ariaLabel,
        inputId
    } = props;

    const hasSelection = selectedCaptions.length > 0;

    const handleClear = (e: MouseEvent): void => {
        e.stopPropagation();
        onClear();
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
        if (readOnly) {
            return;
        }
        if (isOpen) {
            return;
        }
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            onToggle();
        }
    };

    const renderSelectedContent = (): ReactElement => {
        if (!hasSelection) {
            return <span className="combotree-input__placeholder">{placeholder}</span>;
        }

        switch (selectedItemsDisplay) {
            case "chips":
                return (
                    <div className="combotree-input__chips">
                        {selectedCaptions.map((caption, i) => (
                            <span key={i} className="combotree-input__chip">
                                {caption}
                            </span>
                        ))}
                    </div>
                );
            case "count":
                return (
                    <span className="combotree-input__count">
                        {selectedCaptions.length} item{selectedCaptions.length !== 1 ? "s" : ""} selected
                    </span>
                );
            case "text":
            default:
                return (
                    <span className="combotree-input__text" title={selectedCaptions.join(", ")}>
                        {selectedCaptions.join(", ")}
                    </span>
                );
        }
    };

    return (
        <div
            id={inputId}
            className={classNames("combotree-input", {
                "combotree-input--open": isOpen,
                "combotree-input--has-value": hasSelection,
                "combotree-input--readonly": readOnly
            })}
            onClick={readOnly ? undefined : onToggle}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="tree"
            aria-label={ariaLabel}
            tabIndex={readOnly ? -1 : tabIndex ?? 0}
        >
            <div className="combotree-input__content">{renderSelectedContent()}</div>

            <div className="combotree-input__indicators">
                {/* Clear button */}
                {clearable && hasSelection && !readOnly && (
                    <button
                        className="combotree-input__clear"
                        onClick={handleClear}
                        type="button"
                        tabIndex={-1}
                        aria-label="Clear selection"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                )}

                {/* Dropdown arrow */}
                <span
                    className={classNames("combotree-input__arrow", {
                        "combotree-input__arrow--open": isOpen
                    })}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </span>
            </div>
        </div>
    );
}
