/**
 * This file was generated from ComboTreeMultiEntity.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, ListValue, ListExpressionValue, ListReferenceValue, ReferenceSetValue } from "mendix";

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
    level1Id: ListExpressionValue<string>;
    level1Caption: ListExpressionValue<string>;
    level1Label?: ListExpressionValue<string>;
    level1Icon?: ListExpressionValue<string>;
    level1ExpandedAttr?: ListExpressionValue<boolean>;
    level1SelectableAttr?: ListExpressionValue<boolean>;
    level2DataSource: ListValue;
    level2Id: ListExpressionValue<string>;
    level2Caption: ListExpressionValue<string>;
    level2ParentRef: ListReferenceValue;
    level2Label?: ListExpressionValue<string>;
    level2Icon?: ListExpressionValue<string>;
    level2ExpandedAttr?: ListExpressionValue<boolean>;
    level2SelectableAttr?: ListExpressionValue<boolean>;
    enableLevel3: boolean;
    level3DataSource?: ListValue;
    level3Id?: ListExpressionValue<string>;
    level3Caption?: ListExpressionValue<string>;
    level3ParentRef?: ListReferenceValue;
    level3Label?: ListExpressionValue<string>;
    level3Icon?: ListExpressionValue<string>;
    level3ExpandedAttr?: ListExpressionValue<boolean>;
    level3SelectableAttr?: ListExpressionValue<boolean>;
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
