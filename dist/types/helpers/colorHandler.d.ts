import { IChartHead, TColorPallet } from "../types/MainTypes";
import { TColorSet } from "../types/utils";
declare class ColorHandler {
    private tree_data;
    private color_range;
    private interpolated_color;
    pallet: {
        h: number;
        s: number;
        l: number;
        darker: number;
        brighter: number;
        bright100: number;
        dark100: number;
        gray: number;
        gray85: number;
    };
    constructor({ tree_data, color_range, pallet }: {
        tree_data: IChartHead[];
        color_range?: string[];
        pallet?: TColorPallet;
    });
    getColor(index: number): TColorSet;
    get_app_gray(): string;
    private get_color_percentage;
    private interpolateColor;
}
export default ColorHandler;
