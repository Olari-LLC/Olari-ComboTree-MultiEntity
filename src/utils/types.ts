export type EntityLevel = 1 | 2 | 3;

export interface TreeNode {
    id: string;
    parentId: string;
    caption: string;
    entityLabel: string;
    level: EntityLevel;
    icon?: string;
    expanded: boolean;
    selectable: boolean;
    children: TreeNode[];
    depth: number;
    hasChildren: boolean;
    checked: CheckState;
}

export type CheckState = "unchecked" | "checked" | "indeterminate";

export interface FlatNodeData {
    id: string;
    parentId: string;
    caption: string;
    entityLabel: string;
    level: EntityLevel;
    icon?: string;
    expanded?: boolean;
    selectable?: boolean;
}
