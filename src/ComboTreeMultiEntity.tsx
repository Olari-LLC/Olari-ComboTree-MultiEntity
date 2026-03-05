import { ReactElement } from "react";
import { ComboTreeMultiEntityContainerProps } from "../typings/ComboTreeMultiEntityProps";
import ComboTreeImpl from "./ComboTreeMultiEntityImpl.web";

export default function ComboTree(props: ComboTreeMultiEntityContainerProps): ReactElement {
    return <ComboTreeImpl {...props} />;
}


