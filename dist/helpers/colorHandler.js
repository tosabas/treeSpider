class ColorHandler {
    hc_d3 = window.d3;
    tree_data = [];
    color_range = ['#b31212', '#b34712', '#b38d12', '#9ab312', '#2fb312', '#12b362', '#12b3a8', '#1278b3', '#1712b3', '#5712b3', '#8d12b3', '#b3128d', '#b3124a', '#b31212'];
    interpolated_color = (t) => '';
    constructor({ tree_data, color_range }) {
        this.tree_data = tree_data;
        (color_range !== undefined && color_range.length > 0) && (this.color_range = color_range);
        this.interpolateColor();
    }
    getColor(index) {
        const color_percentage = this.get_color_percentage(index);
        const color = this.interpolated_color(color_percentage);
        const conv_color = this.hc_d3.color(color);
        console.log("color color:", index, color_percentage, color);
        const to_hsl = this.hc_d3.hsl(conv_color);
        to_hsl.h += 10;
        to_hsl.s += 0.5;
        // to_hsl.l += 0.1;
        const hsl_bright = this.hc_d3.hsl(conv_color);
        hsl_bright.l += 0.6;
        const opac_gray80 = this.hc_d3.gray(85);
        const colorSet = {
            color: color,
            darker: conv_color?.darker(0.8).toString(),
            brighter: conv_color?.brighter(0.8).toString(),
            bright100: to_hsl.brighter(0.5).toString(),
            dark100: to_hsl.darker(0.5).toString(),
            bright500: hsl_bright.toString(),
            gray: this.hc_d3.gray(50).toString(),
            gray85: opac_gray80.toString(),
        };
        return colorSet;
    }
    get_app_gray() {
        return this.hc_d3.gray(50).toString();
    }
    get_color_percentage(index) {
        return (index / this.tree_data.length);
    }
    interpolateColor() {
        // if (true) {
        //     this.interpolated_color = this.hc_d3.interpolateRainbow;
        // }else{
        // }
        this.interpolated_color = this.hc_d3.interpolateRgbBasis(this.color_range);
    }
}
export default ColorHandler;
