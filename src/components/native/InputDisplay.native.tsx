import { ReactElement } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface InputDisplayNativeProps {
    selectedCaptions: string[];
    selectedItemsDisplay: "text" | "chips" | "count";
    placeholder: string;
    clearable: boolean;
    onPress: () => void;
    onClear: () => void;
    readOnly: boolean;
}

export function InputDisplayNative(props: InputDisplayNativeProps): ReactElement {
    const { selectedCaptions, selectedItemsDisplay, placeholder, clearable, onPress, onClear, readOnly } = props;

    const hasSelection = selectedCaptions.length > 0;

    const renderContent = (): ReactElement => {
        if (!hasSelection) {
            return <Text style={styles.placeholder}>{placeholder}</Text>;
        }

        switch (selectedItemsDisplay) {
            case "chips":
                return (
                    <View style={styles.chipsContainer}>
                        {selectedCaptions.slice(0, 3).map((caption, i) => (
                            <View key={i} style={styles.chip}>
                                <Text style={styles.chipText} numberOfLines={1}>
                                    {caption}
                                </Text>
                            </View>
                        ))}
                        {selectedCaptions.length > 3 && (
                            <View style={styles.chip}>
                                <Text style={styles.chipText}>+{selectedCaptions.length - 3}</Text>
                            </View>
                        )}
                    </View>
                );
            case "count":
                return (
                    <Text style={styles.text}>
                        {selectedCaptions.length} item{selectedCaptions.length !== 1 ? "s" : ""} selected
                    </Text>
                );
            case "text":
            default:
                return (
                    <Text style={styles.text} numberOfLines={1}>
                        {selectedCaptions.join(", ")}
                    </Text>
                );
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, readOnly && styles.containerReadOnly]}
            onPress={readOnly ? undefined : onPress}
            activeOpacity={readOnly ? 1 : 0.7}
            disabled={readOnly}
        >
            <View style={styles.content}>{renderContent()}</View>
            <View style={styles.indicators}>
                {clearable && hasSelection && !readOnly && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            onClear();
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.clearIcon}>{"\u2715"}</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.arrow}>{"\u25BC"}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#fff",
        minHeight: 42
    },
    containerReadOnly: {
        backgroundColor: "#f5f5f5",
        borderColor: "#ddd"
    },
    content: {
        flex: 1
    },
    placeholder: {
        fontSize: 14,
        color: "#999"
    },
    text: {
        fontSize: 14,
        color: "#333"
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4
    },
    chip: {
        backgroundColor: "#e8eaf6",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    chipText: {
        fontSize: 12,
        color: "#333"
    },
    indicators: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8
    },
    clearButton: {
        marginRight: 8
    },
    clearIcon: {
        fontSize: 12,
        color: "#999"
    },
    arrow: {
        fontSize: 10,
        color: "#999"
    }
});
