import { ReactElement } from "react";
import { ComboTreePreviewProps } from "../typings/ComboTreeProps";

export function preview(_props: ComboTreePreviewProps): ReactElement {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                padding: "6px 12px",
                minHeight: "36px",
                backgroundColor: "#fff",
                fontFamily: "inherit",
                fontSize: "14px"
            }}
        >
            <span style={{ flex: 1, color: "#999" }}>Select...</span>
            <span style={{ color: "#999", fontSize: "10px" }}>{"\u25BC"}</span>
        </div>
    );
}

export function getPreviewCss(): string {
    return "";
}
