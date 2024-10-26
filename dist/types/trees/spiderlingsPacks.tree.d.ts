import { TTreeClassParams } from "src/types/utils";
declare class SpiderlingsPacksTree {
    protected content_wrapper: HTMLElement | null;
    protected head_child_wrapper: HTMLElement | null;
    protected tsInnerContainer: HTMLElement | null;
    private chartHelper;
    current_scale: number;
    private nodes_group;
    private links_group;
    private rotate_deg;
    private animation_interval;
    constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
    private organizeUI;
    private map_children_data_to_head;
}
export default SpiderlingsPacksTree;
