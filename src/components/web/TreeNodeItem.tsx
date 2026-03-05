import { MouseEvent, ReactElement, useCallback } from "react";
import classNames from "classnames";
import { TreeNode } from "../../utils/types";

interface TreeNodeItemProps {
    node: TreeNode;
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
}

export function TreeNodeItem(props: TreeNodeItemProps): ReactElement {
    const {
        node,
        selectionMode,
        showNodeCount,
        showEntityBadge,
        expandedNodeIds,
        forceExpandAll,
        activeNodeId,
        onActivateNode,
        onToggleExpand,
        onToggleSelect,
        selectedIds
    } = props;

    const isExpanded = forceExpandAll || expandedNodeIds.has(node.id);
    const isSelected = selectedIds.has(node.id);
    const isIndeterminate = node.checked === "indeterminate";
    const isActive = activeNodeId === node.id;

    const handleExpandClick = useCallback(
        (e: MouseEvent): void => {
            e.stopPropagation();
            if (forceExpandAll) {
                return;
            }
            onToggleExpand(node.id);
        },
        [forceExpandAll, node.id, onToggleExpand]
    );

    const handleSelectClick = useCallback(
        (e: MouseEvent): void => {
            e.stopPropagation();
            if (!node.selectable) {
                return;
            }
            onToggleSelect(node.id);
        },
        [node.id, node.selectable, onToggleSelect]
    );

    const handleCheckboxChange = useCallback((): void => {
        if (!node.selectable) {
            return;
        }
        onToggleSelect(node.id);
    }, [node.id, node.selectable, onToggleSelect]);

    return (
        <li
            className={classNames("combotree-node", `combotree-node--level-${node.level}`, {
                "combotree-node--expanded": isExpanded,
                "combotree-node--selected": isSelected,
                "combotree-node--active": isActive,
                "combotree-node--disabled": !node.selectable,
                "combotree-node--has-children": node.hasChildren
            })}
            role="treeitem"
            aria-expanded={node.hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
        >
            <div
                className="combotree-node__content"
                style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
                onClick={handleSelectClick}
                onMouseEnter={() => onActivateNode(node.id)}
            >
                {node.hasChildren ? (
                    <button
                        className={classNames("combotree-node__toggle", {
                            "combotree-node__toggle--expanded": isExpanded
                        })}
                        onClick={handleExpandClick}
                        type="button"
                        tabIndex={-1}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" className="combotree-node__arrow">
                            <path d="M3 1 L7 5 L3 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                ) : (
                    <span className="combotree-node__toggle-placeholder" />
                )}

                {selectionMode === "multiple" && (
                    <label className="combotree-node__checkbox-label" onClick={(e): void => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="combotree-node__checkbox"
                            checked={isSelected}
                            ref={el => {
                                if (el) {
                                    el.indeterminate = isIndeterminate;
                                }
                            }}
                            onChange={handleCheckboxChange}
                            disabled={!node.selectable}
                            tabIndex={-1}
                        />
                        <span className="combotree-node__checkmark" />
                    </label>
                )}

                {node.icon && <span className={classNames("combotree-node__icon", node.icon)} />}

                {showEntityBadge && <span className="combotree-node__entity-badge">{node.entityLabel}</span>}

                <span className="combotree-node__caption">{node.caption}</span>

                {showNodeCount && node.hasChildren && (
                    <span className="combotree-node__count">({node.children.length})</span>
                )}
            </div>

            {node.hasChildren && isExpanded && (
                <ul className="combotree-node__children" role="group">
                    {node.children.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
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
        </li>
    );
}
