import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { ObjectItem } from "mendix";
import { ComboTreeMultiEntityContainerProps } from "../typings/ComboTreeMultiEntityProps";
import { DropdownPanelNative } from "./components/native/DropdownPanel.native";
import { InputDisplayNative } from "./components/native/InputDisplay.native";
import { useSelection } from "./hooks/useSelection";
import { useTreeData } from "./hooks/useTreeData";
import { flattenTree } from "./utils/treeBuilder";
import { TreeNode } from "./utils/types";

type ReferenceSetOutput = {
    readOnly: boolean;
    value?: ObjectItem[];
    setValue: (value: ObjectItem[] | undefined) => void;
};

function getInitialExpandedNodeIds(tree: TreeNode[], expandAll: boolean): Set<string> {
    const expanded = new Set<string>();

    function collect(nodes: TreeNode[]): void {
        for (const node of nodes) {
            if (node.hasChildren && (expandAll || node.expanded)) {
                expanded.add(node.id);
            }
            collect(node.children);
        }
    }

    collect(tree);
    return expanded;
}

export default function ComboTree(props: ComboTreeMultiEntityContainerProps): ReactElement {
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
        selectionMode,
        selectedLevel1RefSet,
        selectedLevel2RefSet,
        selectedLevel3RefSet,
        autoCheckChildren,
        autoCheckParent,
        showSelectAll,
        placeholderText,
        noOptionsText,
        selectedItemsDisplay,
        showEntityBadge,
        clearable,
        expandMode,
        defaultExpandAll,
        showNodeCount,
        allowFiltering,
        filterType,
        filterPlaceholder,
        onChangeAction,
        onOpenAction,
        onCloseAction,
        ariaLabel
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set());

    const {
        tree,
        filteredTree,
        nodeMap,
        selectedCaptions,
        objectByNodeId,
        level1NodeIdByObjectId,
        level2NodeIdByObjectId,
        level3NodeIdByObjectId
    } = useTreeData({
        level1DataSource,
        level1Id,
        level1Caption,
        level1Label: level1Label?.value ?? "Level 1",
        level1Icon,
        level1ExpandedAttr,
        level1SelectableAttr,
        level2DataSource,
        level2Id,
        level2Caption,
        level2ParentRef,
        level2Label: level2Label?.value ?? "Level 2",
        level2Icon,
        level2ExpandedAttr,
        level2SelectableAttr,
        enableLevel3,
        level3DataSource,
        level3Id,
        level3Caption,
        level3ParentRef,
        level3Label: level3Label?.value ?? "Level 3",
        level3Icon,
        level3ExpandedAttr,
        level3SelectableAttr,
        selectedIds: localSelectedIds,
        autoCheckParent,
        filterText,
        filterType
    });

    const selectedFromRefOutputs = useMemo(() => {
        const fromOutputs = new Set<string>();

        for (const item of selectedLevel1RefSet?.value ?? []) {
            const nodeId = level1NodeIdByObjectId.get(String(item.id));
            if (nodeId) {
                fromOutputs.add(nodeId);
            }
        }

        for (const item of selectedLevel2RefSet?.value ?? []) {
            const nodeId = level2NodeIdByObjectId.get(String(item.id));
            if (nodeId) {
                fromOutputs.add(nodeId);
            }
        }

        if (enableLevel3) {
            for (const item of selectedLevel3RefSet?.value ?? []) {
                const nodeId = level3NodeIdByObjectId.get(String(item.id));
                if (nodeId) {
                    fromOutputs.add(nodeId);
                }
            }
        }

        return fromOutputs;
    }, [
        selectedLevel1RefSet?.value,
        selectedLevel2RefSet?.value,
        selectedLevel3RefSet?.value,
        level1NodeIdByObjectId,
        level2NodeIdByObjectId,
        level3NodeIdByObjectId,
        enableLevel3
    ]);

    const hasOutputBinding = Boolean(selectedLevel1RefSet || selectedLevel2RefSet || selectedLevel3RefSet);
    const currentSelectedIds = useMemo(
        () => (hasOutputBinding ? selectedFromRefOutputs : localSelectedIds),
        [hasOutputBinding, selectedFromRefOutputs, localSelectedIds]
    );

    useEffect(() => {
        if (hasOutputBinding) {
            setLocalSelectedIds(selectedFromRefOutputs);
        }
    }, [hasOutputBinding, selectedFromRefOutputs]);

    const outputProps = [selectedLevel1RefSet, selectedLevel2RefSet, selectedLevel3RefSet].filter(
        Boolean
    ) as ReferenceSetOutput[];

    const isReadOnly = outputProps.length > 0 && outputProps.every(prop => prop.readOnly);

    const applyAssociationOutputs = useCallback(
        (newSelection: Set<string>) => {
            const level1Objects: ObjectItem[] = [];
            const level2Objects: ObjectItem[] = [];
            const level3Objects: ObjectItem[] = [];

            const level1ObjectIds = new Set<string>();
            const level2ObjectIds = new Set<string>();
            const level3ObjectIds = new Set<string>();

            for (const nodeId of newSelection) {
                const node = nodeMap.get(nodeId);
                const objectItem = objectByNodeId.get(nodeId);
                if (!node || !objectItem) {
                    continue;
                }

                const objectId = String(objectItem.id);
                if (node.level === 1 && !level1ObjectIds.has(objectId)) {
                    level1ObjectIds.add(objectId);
                    level1Objects.push(objectItem);
                    continue;
                }

                if (node.level === 2 && !level2ObjectIds.has(objectId)) {
                    level2ObjectIds.add(objectId);
                    level2Objects.push(objectItem);
                    continue;
                }

                if (node.level === 3 && !level3ObjectIds.has(objectId)) {
                    level3ObjectIds.add(objectId);
                    level3Objects.push(objectItem);
                }
            }

            if (selectedLevel1RefSet && !selectedLevel1RefSet.readOnly) {
                selectedLevel1RefSet.setValue(level1Objects);
            }

            if (selectedLevel2RefSet && !selectedLevel2RefSet.readOnly) {
                selectedLevel2RefSet.setValue(level2Objects);
            }

            if (selectedLevel3RefSet && !selectedLevel3RefSet.readOnly) {
                selectedLevel3RefSet.setValue(enableLevel3 ? level3Objects : []);
            }
        },
        [nodeMap, objectByNodeId, selectedLevel1RefSet, selectedLevel2RefSet, selectedLevel3RefSet, enableLevel3]
    );

    const applySelection = useCallback(
        (newSelection: Set<string>) => {
            setLocalSelectedIds(new Set(newSelection));
            applyAssociationOutputs(newSelection);

            if (onChangeAction?.canExecute) {
                onChangeAction.execute();
            }
        },
        [applyAssociationOutputs, onChangeAction]
    );

    const selection = useSelection({
        selectionMode,
        selectedIds: currentSelectedIds,
        autoCheckChildren,
        autoCheckParent,
        tree,
        onSelectionChange: applySelection
    });

    const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() =>
        getInitialExpandedNodeIds(tree, defaultExpandAll)
    );
    const [hasExpansionInteraction, setHasExpansionInteraction] = useState(false);

    useEffect(() => {
        if (hasExpansionInteraction) {
            return;
        }
        setExpandedNodeIds(getInitialExpandedNodeIds(tree, defaultExpandAll));
    }, [tree, defaultExpandAll, hasExpansionInteraction]);

    const handleOpen = useCallback(() => {
        if (isReadOnly) {
            return;
        }
        setIsOpen(true);
        if (onOpenAction?.canExecute) {
            onOpenAction.execute();
        }
    }, [isReadOnly, onOpenAction]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setFilterText("");
        if (onCloseAction?.canExecute) {
            onCloseAction.execute();
        }
    }, [onCloseAction]);

    const handleToggleExpand = useCallback(
        (nodeId: string) => {
            setHasExpansionInteraction(true);
            setExpandedNodeIds(prev => {
                const next = new Set(prev);
                if (next.has(nodeId)) {
                    next.delete(nodeId);
                } else {
                    if (expandMode === "single") {
                        const node = nodeMap.get(nodeId);
                        if (node) {
                            const parent = node.parentId ? nodeMap.get(node.parentId) : undefined;
                            const siblings = parent ? parent.children : tree;
                            for (const sibling of siblings) {
                                if (sibling.id !== nodeId) {
                                    next.delete(sibling.id);
                                }
                            }
                        }
                    }
                    next.add(nodeId);
                }
                return next;
            });
        },
        [expandMode, nodeMap, tree]
    );

    const handleToggleSelect = useCallback(
        (nodeId: string) => {
            selection.toggleNode(nodeId);
            if (selectionMode === "single") {
                handleClose();
            }
        },
        [selection, selectionMode, handleClose]
    );

    const forceExpandAll = allowFiltering && filterText.trim().length > 0;

    const allSelectable = useMemo(() => {
        const allNodes = flattenTree(tree);
        return allNodes.filter(n => n.selectable);
    }, [tree]);

    const selectedCount = useMemo(() => {
        return allSelectable.reduce((count, node) => (currentSelectedIds.has(node.id) ? count + 1 : count), 0);
    }, [allSelectable, currentSelectedIds]);

    const allSelected = allSelectable.length > 0 && selectedCount === allSelectable.length;
    const partialSelected = selectedCount > 0 && !allSelected;

    return (
        <View>
            <InputDisplayNative
                selectedCaptions={selectedCaptions}
                selectedItemsDisplay={selectedItemsDisplay}
                placeholder={placeholderText?.value ?? "Select..."}
                clearable={clearable}
                onPress={handleOpen}
                onClear={selection.clearAll}
                readOnly={isReadOnly}
            />

            <DropdownPanelNative
                visible={isOpen}
                onClose={handleClose}
                tree={filteredTree}
                selectionMode={selectionMode}
                showNodeCount={showNodeCount}
                showEntityBadge={showEntityBadge}
                expandedNodeIds={expandedNodeIds}
                forceExpandAll={forceExpandAll}
                onToggleExpand={handleToggleExpand}
                onToggleSelect={handleToggleSelect}
                selectedIds={currentSelectedIds}
                allowFiltering={allowFiltering}
                filterText={filterText}
                onFilterChange={setFilterText}
                filterPlaceholder={filterPlaceholder?.value ?? "Search..."}
                noOptionsText={noOptionsText?.value ?? "No results found"}
                showSelectAll={showSelectAll}
                onSelectAll={selection.selectAll}
                onClearAll={selection.clearAll}
                allSelected={allSelected}
                partialSelected={partialSelected}
                title={ariaLabel?.value ?? "Select"}
            />
        </View>
    );
}


