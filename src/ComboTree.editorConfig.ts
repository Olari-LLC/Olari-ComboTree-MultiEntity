import { ComboTreePreviewProps } from "../typings/ComboTreeProps";
import { hidePropertiesIn, Properties } from "@mendix/pluggable-widgets-tools";

export function getProperties(values: ComboTreePreviewProps, defaultProperties: Properties): Properties {
    if (values.selectionMode === "single") {
        hidePropertiesIn(defaultProperties, values, [
            "autoCheckChildren",
            "autoCheckParent",
            "showSelectAll",
            "selectedItemsDisplay"
        ]);
    }

    if (!values.allowFiltering) {
        hidePropertiesIn(defaultProperties, values, ["filterType", "filterPlaceholder"]);
    }

    if (!values.enableLevel3) {
        hidePropertiesIn(defaultProperties, values, [
            "level3DataSource",
            "level3Id",
            "level3Caption",
            "level3ParentRef",
            "level3Label",
            "level3Icon",
            "level3ExpandedAttr",
            "level3SelectableAttr",
            "selectedLevel3RefSet"
        ]);
    }

    return defaultProperties;
}

export function getPreview(): null {
    return null;
}
