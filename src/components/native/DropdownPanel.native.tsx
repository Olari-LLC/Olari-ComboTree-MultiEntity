import { ReactElement } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, SafeAreaView } from "react-native";
import { TreeNode } from "../../utils/types";
import { TreeNodeItemNative } from "./TreeNodeItem.native";

interface DropdownPanelNativeProps {
    visible: boolean;
    onClose: () => void;
    tree: TreeNode[];
    selectionMode: "single" | "multiple";
    showNodeCount: boolean;
    showEntityBadge: boolean;
    expandedNodeIds: Set<string>;
    forceExpandAll: boolean;
    onToggleExpand: (nodeId: string) => void;
    onToggleSelect: (nodeId: string) => void;
    selectedIds: Set<string>;

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

    title?: string;
}

export function DropdownPanelNative(props: DropdownPanelNativeProps): ReactElement {
    const {
        visible,
        onClose,
        tree,
        selectionMode,
        showNodeCount,
        showEntityBadge,
        expandedNodeIds,
        forceExpandAll,
        onToggleExpand,
        onToggleSelect,
        selectedIds,
        allowFiltering,
        filterText,
        onFilterChange,
        filterPlaceholder,
        noOptionsText,
        showSelectAll,
        onSelectAll,
        onClearAll,
        allSelected,
        partialSelected,
        title
    } = props;

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title ?? "Select"}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.headerClose}>
                        <Text style={styles.headerCloseText}>{"\u2715"}</Text>
                    </TouchableOpacity>
                </View>

                {allowFiltering && (
                    <View style={styles.filterContainer}>
                        <TextInput
                            style={styles.filterInput}
                            value={filterText}
                            onChangeText={onFilterChange}
                            placeholder={filterPlaceholder}
                            autoFocus
                            clearButtonMode="while-editing"
                        />
                    </View>
                )}

                {showSelectAll && selectionMode === "multiple" && (
                    <TouchableOpacity style={styles.selectAllRow} onPress={allSelected ? onClearAll : onSelectAll}>
                        <View
                            style={[
                                styles.checkbox,
                                allSelected && styles.checkboxChecked,
                                partialSelected && styles.checkboxIndeterminate
                            ]}
                        >
                            {allSelected && <Text style={styles.checkmark}>{"\u2713"}</Text>}
                            {partialSelected && !allSelected && (
                                <Text style={styles.indeterminateMark}>{"\u2014"}</Text>
                            )}
                        </View>
                        <Text style={styles.selectAllText}>{allSelected ? "Clear all" : "Select all"}</Text>
                    </TouchableOpacity>
                )}

                <ScrollView style={styles.treeScroll} contentContainerStyle={styles.treeContent}>
                    {tree.length === 0 ? (
                        <View style={styles.noOptions}>
                            <Text style={styles.noOptionsText}>{noOptionsText}</Text>
                        </View>
                    ) : (
                        tree.map(node => (
                            <TreeNodeItemNative
                                key={node.id}
                                node={node}
                                selectionMode={selectionMode}
                                showNodeCount={showNodeCount}
                                showEntityBadge={showEntityBadge}
                                expandedNodeIds={expandedNodeIds}
                                forceExpandAll={forceExpandAll}
                                onToggleExpand={onToggleExpand}
                                onToggleSelect={onToggleSelect}
                                selectedIds={selectedIds}
                            />
                        ))
                    )}
                </ScrollView>

                {selectionMode === "multiple" && (
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0"
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333"
    },
    headerClose: {
        padding: 4
    },
    headerCloseText: {
        fontSize: 18,
        color: "#666"
    },
    filterContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0"
    },
    filterInput: {
        height: 38,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        paddingHorizontal: 12,
        fontSize: 14,
        backgroundColor: "#f8f8f8"
    },
    selectAllRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#f9f9f9"
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: "#aaa",
        borderRadius: 3,
        marginRight: 10,
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
    selectAllText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333"
    },
    treeScroll: {
        flex: 1
    },
    treeContent: {
        paddingBottom: 20
    },
    noOptions: {
        padding: 20,
        alignItems: "center"
    },
    noOptionsText: {
        fontSize: 14,
        color: "#999"
    },
    footer: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0"
    },
    doneButton: {
        backgroundColor: "#264AE5",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center"
    },
    doneButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    }
});
