import { TTreeType } from "../types/MainTypes";
declare class UITools {
    private root_ui_element;
    private zoomInOut;
    private resetZoom;
    private animate_chat;
    tree_type: TTreeType | undefined;
    private animatable_trees;
    constructor({ root_ui_element, zoomInOut, resetZoom, animate_chat }: {
        root_ui_element: HTMLElement;
        zoomInOut: Function;
        resetZoom: Function;
        animate_chat: Function;
    });
    private make_tools;
}
export default UITools;
