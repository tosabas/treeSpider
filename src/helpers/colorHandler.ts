import { RGBColor, hcl } from "d3";
import { IChartHead } from "src/types/MainTypes";
import { TColorSet } from "src/types/utils";

class ColorHandler {
    private hc_d3: typeof globalThis.d3 = window.d3;
    private tree_data: IChartHead[] = [];
    private color_range: string[] = ["steelblue", "green"];
    private interpolated_color: (t: number) => string = (t) => '';

    constructor ({tree_data, color_range}: {tree_data: IChartHead[]; color_range?: string[]}) {
        this.tree_data = tree_data;
        (color_range !== undefined && color_range.length > 1) && (this.color_range = color_range as string[]);
        this.interpolateColor();
    }

    public getColor (index: number): TColorSet {
        const color_percentage = this.get_color_percentage(index);
        const color = this.interpolated_color(color_percentage);
        const conv_color = this.hc_d3.color(color);
        console.log("color color:", index, color_percentage, color);
        
        const to_hsl = this.hc_d3.hsl(conv_color as RGBColor);
        to_hsl.h += 10;
        to_hsl.s += 0.5;
        // to_hsl.l += 0.1;

        const hsl_bright = this.hc_d3.hsl(conv_color as RGBColor)
        hsl_bright.l += 0.6;

        const opac_gray80 = this.hc_d3.gray(85).opacity = .2

        const colorSet: TColorSet = {
            color: color,
            darker: conv_color?.darker(0.8).toString() as string,
            brighter: conv_color?.brighter(0.8).toString() as string,
            bright100: to_hsl.brighter(0.5).toString() as string,
            dark100: to_hsl.darker(0.5).toString(),
            bright500: hsl_bright.toString() as string,
            gray: this.hc_d3.gray(50).toString(),
            gray85: opac_gray80.toString(),
        }
        return colorSet;
    }

    private get_color_percentage (index: number) {
        return (index / this.tree_data.length);
    }

    private interpolateColor () {
        this.interpolated_color = this.hc_d3.interpolateRgbBasis(this.color_range);
        // this.interpolated_color = this.hc_d3.interpolateHslLong(this.color_range[0], this.color_range[1]);
    }
}

export default ColorHandler;