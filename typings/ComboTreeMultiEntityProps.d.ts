/**
 * This file was generated from ComboTreeMultiEntity.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type SelectionModeEnum = "single" | "multiple";

export type SelectedItemsDisplayEnum = "text" | "chips" | "count";

export type ExpandModeEnum = "multiple" | "single";

export type ReadOnlyStyleEnum = "bordered" | "text";

export type FilterTypeEnum = "contains" | "startsWith";

export interface ComboTreeMultiEntityContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    level1DataSource: ListValue;
    level1Id: ListAttributeValue<string | Big>;
    level1Caption: ListAttributeValue<string>;
    level1Label?: DynamicValue<string>;
    level1Icon?: ListAttributeValue<string>;
    level1ExpandedAttr?: ListAttributeValue<boolean>;
    level1SelectableAttr?: ListAttributeValue<boolean>;
    level2DataSource: ListValue;
    level2Id: ListAttributeValue<string | Big>;
    level2Caption: ListAttributeValue<string>;
    level2ParentRef: ListReferenceValue;
    level2Label?: DynamicValue<string>;
    level2Icon?: ListAttributeValue<string>;
    level2ExpandedAttr?: ListAttributeValue<boolean>;
    level2SelectableAttr?: ListAttributeValue<boolean>;
    enableLevel3: boolean;
    level3DataSource?: ListValue;
    level3Id?: ListAttributeValue<string | Big>;
    level3Caption?: ListAttributeValue<string>;
    level3ParentRef?: ListReferenceValue;
    level3Label?: DynamicValue<string>;
    level3Icon?: ListAttributeValue<string>;
    level3ExpandedAttr?: ListAttributeValue<boolean>;
    level3SelectableAttr?: ListAttributeValue<boolean>;
    selectionMode: SelectionModeEnum;
    autoCheckChildren: boolean;
    autoCheckParent: boolean;
    showSelectAll: boolean;
    selectedLevel1RefSet?: ReferenceSetValue;
    selectedLevel2RefSet?: ReferenceSetValue;
    selectedLevel3RefSet?: ReferenceSetValue;
    placeholderText?: DynamicValue<string>;
    noOptionsText?: DynamicValue<string>;
    selectedItemsDisplay: SelectedItemsDisplayEnum;
    showEntityBadge: boolean;
    clearable: boolean;
    maxDropdownHeight: number;
    expandMode: ExpandModeEnum;
    defaultExpandAll: boolean;
    showNodeCount: boolean;
    readOnlyStyle: ReadOnlyStyleEnum;
    allowFiltering: boolean;
    filterType: FilterTypeEnum;
    filterPlaceholder?: DynamicValue<string>;
    onChangeAction?: ActionValue;
    onOpenAction?: ActionValue;
    onCloseAction?: ActionValue;
    ariaLabel?: DynamicValue<string>;
}

export interface ComboTreeMultiEntityPreviewProps {
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    level1DataSource: {} | { caption: string } | { type: string } | null;
    level1Id: string;
    level1Caption: string;
    level1Label: string;
    level1Icon: string;
    level1ExpandedAttr: string;
    level1SelectableAttr: string;
    level2DataSource: {} | { caption: string } | { type: string } | null;
    level2Id: string;
    level2Caption: string;
    level2ParentRef: string;
    level2Label: string;
    level2Icon: string;
    level2ExpandedAttr: string;
    level2SelectableAttr: string;
    enableLevel3: boolean;
    level3DataSource: {} | { caption: string } | { type: string } | null;
    level3Id: string;
    level3Caption: string;
    level3ParentRef: string;
    level3Label: string;
    level3Icon: string;
    level3ExpandedAttr: string;
    level3SelectableAttr: string;
    selectionMode: SelectionModeEnum;
    autoCheckChildren: boolean;
    autoCheckParent: boolean;
    showSelectAll: boolean;
    selectedLevel1RefSet: string;
    selectedLevel2RefSet: string;
    selectedLevel3RefSet: string;
    placeholderText: string;
    noOptionsText: string;
    selectedItemsDisplay: SelectedItemsDisplayEnum;
    showEntityBadge: boolean;
    clearable: boolean;
    maxDropdownHeight: number | null;
    expandMode: ExpandModeEnum;
    defaultExpandAll: boolean;
    showNodeCount: boolean;
    readOnlyStyle: ReadOnlyStyleEnum;
    allowFiltering: boolean;
    filterType: FilterTypeEnum;
    filterPlaceholder: string;
    onChangeAction: {} | null;
    onOpenAction: {} | null;
    onCloseAction: {} | null;
    ariaLabel: string;
}
