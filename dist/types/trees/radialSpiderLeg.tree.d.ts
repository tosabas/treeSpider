import { TTreeClassParams } from "src/types/utils.js";
import ChartMainHelper from "../helpers/chart-helper.js";
declare class RadialSpiderLeg {
    protected content_wrapper: HTMLElement | null;
    protected head_child_wrapper: HTMLElement | null;
    protected tsInnerContainer: HTMLElement | null;
    chartHelper: ChartMainHelper | undefined;
    current_scale: number;
    root_svg: any;
    rotate_deg: number;
    animation_interval: any;
    start_animation: boolean;
    constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
    private organizeUI;
    animate_chat(once?: boolean, anti?: boolean): any;
    private map_children_data_to_head;
}
export default RadialSpiderLeg;
