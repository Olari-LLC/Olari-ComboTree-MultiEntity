import { useMemo } from "react";
import { ListAttributeValue, ListReferenceValue, ListValue, ObjectItem } from "mendix";
import { Big } from "big.js";
import { FlatNodeData } from "../utils/types";
import { buildNodeMap, buildTree, computeCheckStates, filterTree, getSelectedCaptions } from "../utils/treeBuilder";

interface UseTreeDataProps {
    level1DataSource: ListValue;
    level1Id: ListAttributeValue<string | Big>;
    level1Caption: ListAttributeValue<string>;
    level1Label: string;
    level1Icon?: ListAttributeValue<string>;
    level1ExpandedAttr?: ListAttributeValue<boolean>;
    level1SelectableAttr?: ListAttributeValue<boolean>;

    level2DataSource: ListValue;
    level2Id: ListAttributeValue<string | Big>;
    level2Caption: ListAttributeValue<string>;
    level2ParentRef: ListReferenceValue;
    level2Label: string;
    level2Icon?: ListAttributeValue<string>;
    level2ExpandedAttr?: ListAttributeValue<boolean>;
    level2SelectableAttr?: ListAttributeValue<boolean>;

    enableLevel3: boolean;
    level3DataSource?: ListValue;
    level3Id?: ListAttributeValue<string | Big>;
    level3Caption?: ListAttributeValue<string>;
    level3ParentRef?: ListReferenceValue;
    level3Label: string;
    level3Icon?: ListAttributeValue<string>;
    level3ExpandedAttr?: ListAttributeValue<boolean>;
    level3SelectableAttr?: ListAttributeValue<boolean>;

    selectedIds: Set<string>;
    autoCheckParent: boolean;
    filterText: string;
    filterType: "contains" | "startsWith";
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

function toStringId(value: string | Big | undefined | null, fallback: string): string {
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
        level1ExpandedAttr,
        level1SelectableAttr,
        level2DataSource,
        level2Id,
        level2Caption,
        level2ParentRef,
        level2Label,
        level2Icon,
        level2ExpandedAttr,
        level2SelectableAttr,
        enableLevel3,
        level3DataSource,
        level3Id,
        level3Caption,
        level3ParentRef,
        level3Label,
        level3Icon,
        level3ExpandedAttr,
        level3SelectableAttr,
        selectedIds,
        autoCheckParent,
        filterText,
        filterType
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
                    entityLabel: level1Label,
                    level: 1,
                    icon: level1Icon ? level1Icon.get(item).value ?? undefined : undefined,
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
                    entityLabel: level2Label,
                    level: 2,
                    icon: level2Icon ? level2Icon.get(item).value ?? undefined : undefined,
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
                    entityLabel: level3Label,
                    level: 3,
                    icon: level3Icon ? level3Icon.get(item).value ?? undefined : undefined,
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
        level1ExpandedAttr,
        level1SelectableAttr,
        level2DataSource,
        level2Id,
        level2Caption,
        level2ParentRef,
        level2Label,
        level2Icon,
        level2ExpandedAttr,
        level2SelectableAttr,
        enableLevel3,
        level3DataSource,
        level3Id,
        level3Caption,
        level3ParentRef,
        level3Label,
        level3Icon,
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
        return getSelectedCaptions(tree, selectedIds);
    }, [tree, selectedIds]);

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
