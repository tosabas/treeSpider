import { TTreeClassParams } from "../types/utils.js";
declare class HorizontalTreeSpider {
    private chartHelper;
    private tree_map_arr;
    protected content_wrapper: HTMLElement | null;
    protected tsInnerContainer: HTMLElement | null;
    current_scale: number;
    constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
    private organizeUI;
    private map_children_data_to_head;
    private drawBranchLinkFresh;
    private drawBranchLink;
    private handleCollapseChildren;
    private removeNodeRecursiveFromTreeMap;
}
export default HorizontalTreeSpider;
