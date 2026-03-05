import { CheckState, FlatNodeData, TreeNode } from "./types";

const ROOT_PARENT = "";

export function buildTree(flatNodes: FlatNodeData[], selectedIds: Set<string>): TreeNode[] {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const flat of flatNodes) {
        const node: TreeNode = {
            id: flat.id,
            parentId: flat.parentId,
            caption: flat.caption,
            entityLabel: flat.entityLabel,
            level: flat.level,
            icon: flat.icon,
            expanded: flat.expanded ?? false,
            selectable: flat.selectable ?? true,
            children: [],
            depth: 0,
            hasChildren: false,
            checked: selectedIds.has(flat.id) ? "checked" : "unchecked"
        };
        nodeMap.set(flat.id, node);
    }

    for (const node of nodeMap.values()) {
        if (!node.parentId || node.parentId === ROOT_PARENT) {
            roots.push(node);
        } else {
            const parent = nodeMap.get(node.parentId);
            if (parent) {
                parent.children.push(node);
                parent.hasChildren = true;
            } else {
                roots.push(node);
            }
        }
    }

    function setDepth(nodes: TreeNode[], depth: number): void {
        for (const node of nodes) {
            node.depth = depth;
            setDepth(node.children, depth + 1);
        }
    }

    setDepth(roots, 0);
    return roots;
}

export function computeCheckStates(roots: TreeNode[]): void {
    function computeNode(node: TreeNode): CheckState {
        if (!node.hasChildren) {
            return node.checked;
        }
        const childStates = node.children.map(c => computeNode(c));
        const allChecked = childStates.every(s => s === "checked");
        const allUnchecked = childStates.every(s => s === "unchecked");

        if (allChecked) {
            node.checked = "checked";
        } else if (allUnchecked) {
            node.checked = "unchecked";
        } else {
            node.checked = "indeterminate";
        }
        return node.checked;
    }
    roots.forEach(r => computeNode(r));
}

export function getAllDescendantIds(node: TreeNode): string[] {
    const ids: string[] = [];
    function collect(n: TreeNode): void {
        for (const child of n.children) {
            ids.push(child.id);
            collect(child);
        }
    }
    collect(node);
    return ids;
}

export function flattenTree(roots: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    function walk(nodes: TreeNode[]): void {
        for (const node of nodes) {
            result.push(node);
            walk(node.children);
        }
    }
    walk(roots);
    return result;
}

export function flattenVisibleTree(roots: TreeNode[], expandedNodeIds: Set<string>, expandAll = false): TreeNode[] {
    const result: TreeNode[] = [];

    function walk(nodes: TreeNode[]): void {
        for (const node of nodes) {
            result.push(node);
            const isExpanded = expandAll || expandedNodeIds.has(node.id);
            if (node.hasChildren && isExpanded) {
                walk(node.children);
            }
        }
    }

    walk(roots);
    return result;
}

export function buildNodeMap(roots: TreeNode[]): Map<string, TreeNode> {
    const map = new Map<string, TreeNode>();
    function walk(nodes: TreeNode[]): void {
        for (const node of nodes) {
            map.set(node.id, node);
            walk(node.children);
        }
    }
    walk(roots);
    return map;
}

export function filterTree(roots: TreeNode[], filterText: string, filterType: "contains" | "startsWith"): TreeNode[] {
    if (!filterText.trim()) {
        return roots;
    }
    const lowerFilter = filterText.toLowerCase();

    function matchesFilter(node: TreeNode): boolean {
        const lowerCaption = node.caption.toLowerCase();
        const lowerEntity = node.entityLabel.toLowerCase();
        if (filterType === "startsWith") {
            return lowerCaption.startsWith(lowerFilter) || lowerEntity.startsWith(lowerFilter);
        }
        return lowerCaption.includes(lowerFilter) || lowerEntity.includes(lowerFilter);
    }

    function filterNode(node: TreeNode): TreeNode | null {
        const filteredChildren = node.children
            .map(child => filterNode(child))
            .filter((child): child is TreeNode => child !== null);

        if (matchesFilter(node) || filteredChildren.length > 0) {
            return {
                ...node,
                children: filteredChildren,
                hasChildren: filteredChildren.length > 0,
                expanded: true
            };
        }
        return null;
    }

    return roots.map(root => filterNode(root)).filter((root): root is TreeNode => root !== null);
}

export function getSelectedCaptions(roots: TreeNode[], selectedIds: Set<string>): string[] {
    const captions: string[] = [];
    function walk(nodes: TreeNode[]): void {
        for (const node of nodes) {
            if (selectedIds.has(node.id)) {
                captions.push(node.entityLabel ? `${node.entityLabel}: ${node.caption}` : node.caption);
            }
            walk(node.children);
        }
    }
    walk(roots);
    return captions;
}
