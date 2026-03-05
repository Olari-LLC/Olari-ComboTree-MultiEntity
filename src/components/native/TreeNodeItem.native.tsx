import { ReactElement, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TreeNode } from "../../utils/types";

interface TreeNodeItemNativeProps {
    node: TreeNode;
    selectionMode: "single" | "multiple";
    showNodeCount: boolean;
    showEntityBadge: boolean;
    expandedNodeIds: Set<string>;
    forceExpandAll: boolean;
    onToggleExpand: (nodeId: string) => void;
    onToggleSelect: (nodeId: string) => void;
    selectedIds: Set<string>;
}

export function TreeNodeItemNative(props: TreeNodeItemNativeProps): ReactElement {
    const {
        node,
        selectionMode,
        showNodeCount,
        showEntityBadge,
        expandedNodeIds,
        forceExpandAll,
        onToggleExpand,
        onToggleSelect,
        selectedIds
    } = props;

    const isExpanded = forceExpandAll || expandedNodeIds.has(node.id);
    const isSelected = selectedIds.has(node.id);
    const isIndeterminate = node.checked === "indeterminate";
    const levelBadgeStyle =
        node.level === 1 ? styles.entityBadgeLevel1 : node.level === 2 ? styles.entityBadgeLevel2 : styles.entityBadgeLevel3;

    const handleExpandPress = useCallback(() => {
        if (forceExpandAll) {
            return;
        }
        onToggleExpand(node.id);
    }, [forceExpandAll, node.id, onToggleExpand]);

    const handleSelectPress = useCallback(() => {
        if (!node.selectable) {
            return;
        }
        onToggleSelect(node.id);
    }, [node.id, node.selectable, onToggleSelect]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.row, { paddingLeft: node.depth * 20 + 12 }]}
                onPress={handleSelectPress}
                activeOpacity={0.7}
                disabled={!node.selectable}
            >
                {node.hasChildren ? (
                    <TouchableOpacity style={styles.toggleButton} onPress={handleExpandPress}>
                        <Text style={[styles.arrow, isExpanded && styles.arrowExpanded]}>{"\u25B6"}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.togglePlaceholder} />
                )}

                {selectionMode === "multiple" && (
                    <View
                        style={[
                            styles.checkbox,
                            isSelected && styles.checkboxChecked,
                            isIndeterminate && styles.checkboxIndeterminate,
                            !node.selectable && styles.checkboxDisabled
                        ]}
                    >
                        {isSelected && <Text style={styles.checkmark}>{"\u2713"}</Text>}
                        {isIndeterminate && !isSelected && <Text style={styles.indeterminateMark}>{"\u2014"}</Text>}
                    </View>
                )}

                {showEntityBadge && <Text style={[styles.entityBadge, levelBadgeStyle]}>{node.entityLabel}</Text>}

                <Text
                    style={[
                        styles.caption,
                        isSelected && selectionMode === "single" && styles.captionSelected,
                        !node.selectable && styles.captionDisabled
                    ]}
                    numberOfLines={1}
                >
                    {node.caption}
                </Text>

                {showNodeCount && node.hasChildren && <Text style={styles.count}>({node.children.length})</Text>}
            </TouchableOpacity>

            {node.hasChildren && isExpanded && (
                <View>
                    {node.children.map(child => (
                        <TreeNodeItemNative
                            key={child.id}
                            node={child}
                            selectionMode={selectionMode}
                            showNodeCount={showNodeCount}
                            showEntityBadge={showEntityBadge}
                            expandedNodeIds={expandedNodeIds}
                            forceExpandAll={forceExpandAll}
                            onToggleExpand={onToggleExpand}
                            onToggleSelect={onToggleSelect}
                            selectedIds={selectedIds}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingRight: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#eee"
    },
    toggleButton: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    arrow: {
        fontSize: 10,
        color: "#666"
    },
    arrowExpanded: {
        transform: [{ rotate: "90deg" }]
    },
    togglePlaceholder: {
        width: 24
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: "#aaa",
        borderRadius: 3,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    checkboxChecked: {
        backgroundColor: "#264AE5",
        borderColor: "#264AE5"
    },
    checkboxIndeterminate: {
        borderColor: "#264AE5"
    },
    checkboxDisabled: {
        opacity: 0.4
    },
    checkmark: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold"
    },
    indeterminateMark: {
        color: "#264AE5",
        fontSize: 14,
        fontWeight: "bold"
    },
    entityBadge: {
        fontSize: 10,
        fontWeight: "600",
        color: "#2f3a4a",
        backgroundColor: "#e9edf5",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
        overflow: "hidden"
    },
    entityBadgeLevel1: {
        backgroundColor: "#d8f3dc",
        color: "#1b4332"
    },
    entityBadgeLevel2: {
        backgroundColor: "#d7e3fc",
        color: "#163172"
    },
    entityBadgeLevel3: {
        backgroundColor: "#fde2e4",
        color: "#7f1d1d"
    },
    caption: {
        flex: 1,
        fontSize: 14,
        color: "#333"
    },
    captionSelected: {
        fontWeight: "600",
        color: "#264AE5"
    },
    captionDisabled: {
        color: "#aaa"
    },
    count: {
        fontSize: 12,
        color: "#999",
        marginLeft: 4
    }
});
