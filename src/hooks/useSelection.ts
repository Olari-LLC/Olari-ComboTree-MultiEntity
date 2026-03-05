import { useCallback } from "react";
import { TreeNode } from "../utils/types";
import { buildNodeMap, flattenTree, getAllDescendantIds } from "../utils/treeBuilder";

interface UseSelectionProps {
    selectionMode: "single" | "multiple";
    selectedIds: Set<string>;
    autoCheckChildren: boolean;
    autoCheckParent: boolean;
    tree: TreeNode[];
    onSelectionChange: (newIds: Set<string>) => void;
}

interface UseSelectionResult {
    toggleNode: (nodeId: string) => void;
    selectAll: () => void;
    clearAll: () => void;
}

export function useSelection(props: UseSelectionProps): UseSelectionResult {
    const { selectionMode, selectedIds, autoCheckChildren, autoCheckParent, tree, onSelectionChange } = props;

    const toggleNode = useCallback(
        (nodeId: string) => {
            const current = new Set(selectedIds);
            const nodeMap = buildNodeMap(tree);

            if (selectionMode === "single") {
                if (current.has(nodeId)) {
                    onSelectionChange(new Set());
                } else {
                    onSelectionChange(new Set([nodeId]));
                }
                return;
            }

            const newSet = new Set(current);
            const node = nodeMap.get(nodeId);
            if (!node) {
                return;
            }

            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
                if (autoCheckChildren) {
                    const descendants = getAllDescendantIds(node);
                    descendants.forEach(id => newSet.delete(id));
                }
            } else {
                newSet.add(nodeId);
                if (autoCheckChildren) {
                    const descendants = getAllDescendantIds(node);
                    descendants.forEach(id => newSet.add(id));
                }
            }

            if (autoCheckParent) {
                updateParentStates(newSet, nodeMap);
            }

            onSelectionChange(newSet);
        },
        [selectedIds, selectionMode, autoCheckChildren, autoCheckParent, tree, onSelectionChange]
    );

    const selectAll = useCallback(() => {
        const allNodes = flattenTree(tree);
        const allIds = new Set(allNodes.filter(n => n.selectable).map(n => n.id));
        onSelectionChange(allIds);
    }, [tree, onSelectionChange]);

    const clearAll = useCallback(() => {
        onSelectionChange(new Set());
    }, [onSelectionChange]);

    return { toggleNode, selectAll, clearAll };
}

function updateParentStates(selectedIds: Set<string>, nodeMap: Map<string, TreeNode>): void {
    const parentNodes = Array.from(nodeMap.values())
        .filter(node => node.hasChildren)
        .sort((a, b) => b.depth - a.depth);

    for (const node of parentNodes) {
        if (!node.selectable) {
            selectedIds.delete(node.id);
            continue;
        }

        const selectableChildren = node.children.filter(child => child.selectable);
        const allChildrenChecked =
            selectableChildren.length > 0 && selectableChildren.every(child => selectedIds.has(child.id));

        if (allChildrenChecked) {
            selectedIds.add(node.id);
        } else {
            selectedIds.delete(node.id);
        }
    }
}
