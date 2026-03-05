import { ReactElement } from "react";
import { ComboTreeContainerProps } from "../typings/ComboTreeProps";
import ComboTreeImpl from "./ComboTreeImpl.web";

export default function ComboTree(props: ComboTreeContainerProps): ReactElement {
    return <ComboTreeImpl {...props} />;
}
