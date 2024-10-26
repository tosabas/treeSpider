import ChartMainHelper from "../helpers/chart-helper.js";
import { TTreeClassParams, TTreeMapArr } from "../types/utils.js";
declare class HorizontalSpiderWalkTree {
    protected content_wrapper: HTMLElement | null;
    protected head_child_wrapper_center: HTMLElement | null;
    protected head_child_wrapper_1: HTMLElement | null;
    protected head_child_wrapper_2: HTMLElement | null;
    protected tsInnerContainer: HTMLElement | null;
    chartHelper: ChartMainHelper | undefined;
    tree_map_arr: Array<TTreeMapArr>;
    current_scale: number;
    constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
    private organizeUI;
    private map_children_data_to_head;
    private drawBranchLinkFresh;
    private drawBranchLink;
    private handleCollapseChildren;
    private removeNodeRecursiveFromTreeMap;
    private handleCollapseRootElChildren;
}
export default HorizontalSpiderWalkTree;
