import { useMemo } from "react";
import { ListExpressionValue, ListReferenceValue, ListValue, ListWidgetValue, ObjectItem } from "mendix";
import { FlatNodeData } from "../utils/types";
import {
    buildNodeMap,
    buildTree,
    computeCheckStates,
    filterTree,
    getSelectedCaptions,
    SelectedCaptionMode
} from "../utils/treeBuilder";

interface UseTreeDataProps {
    level1DataSource: ListValue;
    level1Id: ListExpressionValue<string>;
    level1Caption: ListExpressionValue<string>;
    level1Label?: ListExpressionValue<string>;
    level1Icon?: ListExpressionValue<string>;
    level1DynamicClass?: ListExpressionValue<string>;
    level1Content?: ListWidgetValue;
    level1ExpandedAttr?: ListExpressionValue<boolean>;
    level1SelectableAttr?: ListExpressionValue<boolean>;

    level2DataSource: ListValue;
    level2Id: ListExpressionValue<string>;
    level2Caption: ListExpressionValue<string>;
    level2ParentRef: ListReferenceValue;
    level2Label?: ListExpressionValue<string>;
    level2Icon?: ListExpressionValue<string>;
    level2DynamicClass?: ListExpressionValue<string>;
    level2Content?: ListWidgetValue;
    level2ExpandedAttr?: ListExpressionValue<boolean>;
    level2SelectableAttr?: ListExpressionValue<boolean>;

    enableLevel3: boolean;
    level3DataSource?: ListValue;
    level3Id?: ListExpressionValue<string>;
    level3Caption?: ListExpressionValue<string>;
    level3ParentRef?: ListReferenceValue;
    level3Label?: ListExpressionValue<string>;
    level3Icon?: ListExpressionValue<string>;
    level3DynamicClass?: ListExpressionValue<string>;
    level3Content?: ListWidgetValue;
    level3ExpandedAttr?: ListExpressionValue<boolean>;
    level3SelectableAttr?: ListExpressionValue<boolean>;

    selectedIds: Set<string>;
    autoCheckParent: boolean;
    filterText: string;
    filterType: "contains" | "startsWith";
    selectedCaptionMode?: SelectedCaptionMode;
    pathDelimiter?: string;
}

interface UseTreeDataResult {
    tree: ReturnType<typeof buildTree>;
    filteredTree: ReturnType<typeof filterTree>;
    nodeMap: ReturnType<typeof buildNodeMap>;
    flatNodes: FlatNodeData[];
    selectedCaptions: string[];
    isLoading: boolean;
    objectByNodeId: Map<string, ObjectItem>;
    level1NodeIdByObjectId: Map<string, string>;
    level2NodeIdByObjectId: Map<string, string>;
    level3NodeIdByObjectId: Map<string, string>;
}

interface NodeAssembly {
    flatNodes: FlatNodeData[];
    objectByNodeId: Map<string, ObjectItem>;
    level1NodeIdByObjectId: Map<string, string>;
    level2NodeIdByObjectId: Map<string, string>;
    level3NodeIdByObjectId: Map<string, string>;
}

function toStringId(value: string | undefined | null, fallback: string): string {
    if (value == null) {
        return fallback;
    }
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : fallback;
}

function nodeToken(level: 1 | 2 | 3, value: string): string {
    return `L${level}:${value}`;
}

export function useTreeData(props: UseTreeDataProps): UseTreeDataResult {
    const {
        level1DataSource,
        level1Id,
        level1Caption,
        level1Label,
        level1Icon,
        level1DynamicClass,
        level1Content,
        level1ExpandedAttr,
        level1SelectableAttr,
        level2DataSource,
        level2Id,
        level2Caption,
        level2ParentRef,
        level2Label,
        level2Icon,
        level2DynamicClass,
        level2Content,
        level2ExpandedAttr,
        level2SelectableAttr,
        enableLevel3,
        level3DataSource,
        level3Id,
        level3Caption,
        level3ParentRef,
        level3Label,
        level3Icon,
        level3DynamicClass,
        level3Content,
        level3ExpandedAttr,
        level3SelectableAttr,
        selectedIds,
        autoCheckParent,
        filterText,
        filterType,
        selectedCaptionMode = "item",
        pathDelimiter = " : "
    } = props;

    const assembled = useMemo<NodeAssembly>(() => {
        const flatNodes: FlatNodeData[] = [];
        const objectByNodeId = new Map<string, ObjectItem>();

        const level1NodeIdByObjectId = new Map<string, string>();
        const level2NodeIdByObjectId = new Map<string, string>();
        const level3NodeIdByObjectId = new Map<string, string>();

        if (level1DataSource?.status === "available" && level1DataSource.items) {
            for (const item of level1DataSource.items) {
                const idValue = toStringId(level1Id.get(item).value, String(item.id));
                const idToken = nodeToken(1, idValue);
                const itemObjectId = String(item.id);

                level1NodeIdByObjectId.set(itemObjectId, idToken);
                objectByNodeId.set(idToken, item);

                flatNodes.push({
                    id: idToken,
                    parentId: "",
                    caption: level1Caption.get(item).value ?? "",
                    entityLabel: level1Label ? level1Label.get(item).value ?? "Level 1" : "Level 1",
                    level: 1,
                    icon: level1Icon ? level1Icon.get(item).value ?? undefined : undefined,
                    dynamicClass: level1DynamicClass ? level1DynamicClass.get(item).value ?? undefined : undefined,
                    content: level1Content ? level1Content.get(item) : undefined,
                    expanded: level1ExpandedAttr ? level1ExpandedAttr.get(item).value ?? false : false,
                    selectable: level1SelectableAttr ? level1SelectableAttr.get(item).value ?? true : true
                });
            }
        }

        if (level2DataSource?.status === "available" && level2DataSource.items) {
            for (const item of level2DataSource.items) {
                const idValue = toStringId(level2Id.get(item).value, String(item.id));
                const idToken = nodeToken(2, idValue);
                const itemObjectId = String(item.id);

                level2NodeIdByObjectId.set(itemObjectId, idToken);
                objectByNodeId.set(idToken, item);

                const parentObject = level2ParentRef.get(item).value;
                const parentToken = parentObject ? level1NodeIdByObjectId.get(String(parentObject.id)) ?? "" : "";

                flatNodes.push({
                    id: idToken,
                    parentId: parentToken,
                    caption: level2Caption.get(item).value ?? "",
                    entityLabel: level2Label ? level2Label.get(item).value ?? "Level 2" : "Level 2",
                    level: 2,
                    icon: level2Icon ? level2Icon.get(item).value ?? undefined : undefined,
                    dynamicClass: level2DynamicClass ? level2DynamicClass.get(item).value ?? undefined : undefined,
                    content: level2Content ? level2Content.get(item) : undefined,
                    expanded: level2ExpandedAttr ? level2ExpandedAttr.get(item).value ?? false : false,
                    selectable: level2SelectableAttr ? level2SelectableAttr.get(item).value ?? true : true
                });
            }
        }

        const canBuildLevel3 =
            enableLevel3 &&
            level3DataSource &&
            level3Id &&
            level3Caption &&
            level3ParentRef &&
            level3DataSource.status === "available" &&
            level3DataSource.items;

        if (canBuildLevel3) {
            for (const item of level3DataSource.items!) {
                const idValue = toStringId(level3Id!.get(item).value, String(item.id));
                const idToken = nodeToken(3, idValue);
                const itemObjectId = String(item.id);

                level3NodeIdByObjectId.set(itemObjectId, idToken);
                objectByNodeId.set(idToken, item);

                const parentObject = level3ParentRef!.get(item).value;
                const parentToken = parentObject ? level2NodeIdByObjectId.get(String(parentObject.id)) ?? "" : "";

                flatNodes.push({
                    id: idToken,
                    parentId: parentToken,
                    caption: level3Caption!.get(item).value ?? "",
                    entityLabel: level3Label ? level3Label.get(item).value ?? "Level 3" : "Level 3",
                    level: 3,
                    icon: level3Icon ? level3Icon.get(item).value ?? undefined : undefined,
                    dynamicClass: level3DynamicClass ? level3DynamicClass.get(item).value ?? undefined : undefined,
                    content: level3Content ? level3Content.get(item) : undefined,
                    expanded: level3ExpandedAttr ? level3ExpandedAttr.get(item).value ?? false : false,
                    selectable: level3SelectableAttr ? level3SelectableAttr.get(item).value ?? true : true
                });
            }
        }

        return {
            flatNodes,
            objectByNodeId,
            level1NodeIdByObjectId,
            level2NodeIdByObjectId,
            level3NodeIdByObjectId
        };
    }, [
        level1DataSource,
        level1Id,
        level1Caption,
        level1Label,
        level1Icon,
        level1DynamicClass,
        level1Content,
        level1ExpandedAttr,
        level1SelectableAttr,
        level2DataSource,
        level2Id,
        level2Caption,
        level2ParentRef,
        level2Label,
        level2Icon,
        level2DynamicClass,
        level2Content,
        level2ExpandedAttr,
        level2SelectableAttr,
        enableLevel3,
        level3DataSource,
        level3Id,
        level3Caption,
        level3ParentRef,
        level3Label,
        level3Icon,
        level3DynamicClass,
        level3Content,
        level3ExpandedAttr,
        level3SelectableAttr
    ]);

    const tree = useMemo(() => {
        const roots = buildTree(assembled.flatNodes, selectedIds);
        if (autoCheckParent) {
            computeCheckStates(roots);
        }
        return roots;
    }, [assembled.flatNodes, selectedIds, autoCheckParent]);

    const nodeMap = useMemo(() => buildNodeMap(tree), [tree]);

    const filteredTree = useMemo(() => {
        return filterTree(tree, filterText, filterType);
    }, [tree, filterText, filterType]);

    const selectedCaptions = useMemo(() => {
        return getSelectedCaptions(tree, selectedIds, selectedCaptionMode, pathDelimiter);
    }, [tree, selectedIds, selectedCaptionMode, pathDelimiter]);

    const isLoading =
        level1DataSource?.status === "loading" ||
        level2DataSource?.status === "loading" ||
        (enableLevel3 && level3DataSource?.status === "loading");

    return {
        tree,
        filteredTree,
        nodeMap,
        flatNodes: assembled.flatNodes,
        selectedCaptions,
        isLoading,
        objectByNodeId: assembled.objectByNodeId,
        level1NodeIdByObjectId: assembled.level1NodeIdByObjectId,
        level2NodeIdByObjectId: assembled.level2NodeIdByObjectId,
        level3NodeIdByObjectId: assembled.level3NodeIdByObjectId
    };
}
