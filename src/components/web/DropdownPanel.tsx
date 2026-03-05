import { ReactElement, useRef, useEffect } from "react";
import { TreeNode } from "../../utils/types";
import { TreeNodeItem } from "./TreeNodeItem";

interface DropdownPanelProps {
    tree: TreeNode[];
    selectionMode: "single" | "multiple";
    showNodeCount: boolean;
    showEntityBadge: boolean;
    expandedNodeIds: Set<string>;
    forceExpandAll: boolean;
    activeNodeId?: string;
    onActivateNode: (nodeId: string) => void;
    onToggleExpand: (nodeId: string) => void;
    onToggleSelect: (nodeId: string) => void;
    selectedIds: Set<string>;
    maxHeight: number;

    allowFiltering: boolean;
    filterText: string;
    onFilterChange: (text: string) => void;
    filterPlaceholder: string;
    noOptionsText: string;

    showSelectAll: boolean;
    onSelectAll: () => void;
    onClearAll: () => void;
    allSelected: boolean;
    partialSelected: boolean;
}

export function DropdownPanel(props: DropdownPanelProps): ReactElement {
    const {
        tree,
        selectionMode,
        showNodeCount,
        showEntityBadge,
        expandedNodeIds,
        forceExpandAll,
        activeNodeId,
        onActivateNode,
        onToggleExpand,
        onToggleSelect,
        selectedIds,
        maxHeight,
        allowFiltering,
        filterText,
        onFilterChange,
        filterPlaceholder,
        noOptionsText,
        showSelectAll,
        onSelectAll,
        onClearAll,
        allSelected,
        partialSelected
    } = props;

    const filterInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (allowFiltering && filterInputRef.current) {
            filterInputRef.current.focus();
        }
    }, [allowFiltering]);

    return (
        <div className="combotree-dropdown" role="dialog" aria-label="Dropdown tree">
            {allowFiltering && (
                <div className="combotree-dropdown__filter">
                    <svg
                        className="combotree-dropdown__filter-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={filterInputRef}
                        className="combotree-dropdown__filter-input"
                        type="text"
                        value={filterText}
                        onChange={e => onFilterChange(e.target.value)}
                        placeholder={filterPlaceholder}
                        aria-label="Filter tree nodes"
                    />
                    {filterText && (
                        <button
                            className="combotree-dropdown__filter-clear"
                            onClick={() => onFilterChange("")}
                            type="button"
                            aria-label="Clear filter"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {showSelectAll && selectionMode === "multiple" && (
                <div className="combotree-dropdown__select-all">
                    <button
                        className="combotree-dropdown__select-all-btn"
                        onClick={allSelected ? onClearAll : onSelectAll}
                        type="button"
                    >
                        <input
                            type="checkbox"
                            checked={allSelected}
                            ref={el => {
                                if (el) {
                                    el.indeterminate = partialSelected;
                                }
                            }}
                            readOnly
                            tabIndex={-1}
                            className="combotree-node__checkbox"
                        />
                        <span>{allSelected ? "Clear all" : "Select all"}</span>
                    </button>
                </div>
            )}

            <div className="combotree-dropdown__tree-wrapper" style={{ maxHeight: `${maxHeight}px` }}>
                {tree.length === 0 ? (
                    <div className="combotree-dropdown__no-options">{noOptionsText}</div>
                ) : (
                    <ul className="combotree-tree" role="tree">
                        {tree.map(node => (
                            <TreeNodeItem
                                key={node.id}
                                node={node}
                                selectionMode={selectionMode}
                                showNodeCount={showNodeCount}
                                showEntityBadge={showEntityBadge}
                                expandedNodeIds={expandedNodeIds}
                                forceExpandAll={forceExpandAll}
                                activeNodeId={activeNodeId}
                                onActivateNode={onActivateNode}
                                onToggleExpand={onToggleExpand}
                                onToggleSelect={onToggleSelect}
                                selectedIds={selectedIds}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
