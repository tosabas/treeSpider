import { THeadImageShape, TLinkerCircleColor, TLinkerShape } from "./utils";
export interface ITreeSpiderMain {
    /**
     * The target container in which SpiderTree will be spawned in
     */
    targetContainer: string;
    /**
     * How SpiderTree container should be placed in the target root container,
     * provide a CSS selector to beforeEl if SpiderTree container should be placed
     * before a container in the provided target container
     */
    placeEl?: 'override' | 'start' | 'end' | {
        beforeEl: string;
    };
    /**
     * The parameter to set TreeSpider to not auto initialize
     */
    autoInitialize?: boolean;
    /**
     * An array of data containing employee details and relationship
     */
    tree_data?: Array<IChartHead>;
    /**
     * An array of colors which will be used as color range, set more than
     * one color for better output
     */
    color_range?: string[];
    /**
     * The type of chart, it is set to 'default' by default
     */
    tree_type?: 'default' | 'cellar' | 'goldenRod' | 'hSpider' | 'hSpiderWalk' | 'radialSpiderLeg' | 'vSpiderWalk';
    /**
     * The type of chart head
     */
    chart_head_type?: TChartHeadType;
    /**
     * Set this to `false` to not display the tool UI
     */
    show_tools?: boolean;
    /**
     * Set this parameter to `false` to not show border around the chart head,
     * note setting this to `false` will also remove the charthead background for the radialSpiderLeg tree type
     */
    show_chart_head_border?: boolean;
    /**
     * Use this to set the animation rotation speed
     */
    animation_rotation_speed?: number;
    /**
     * The degree increment of the rotation, default is 1
     */
    animation_rotation_interval?: number;
    /**
     * The background pattern of your choice
     */
    backgroundPattern?: 'none' | 'default' | 'flux' | 'quad' | 'blurry' | 'chaos' | 'flurry' | 'spiral' | 'whirling' | 'replicate' | 'scribble' | 'squiggly' | 'gyrrate' | 'leaves' | 'spot';
    /**
     * The CSS background position of the SVG background
     */
    backgroundPosition?: 'bottom' | 'center' | 'inherit' | 'initial' | 'left' | 'right' | 'top' | 'unset' | `${number}%` | `${number}px`;
    /**
     * The size of the background svg pattern
     */
    backgroundSize?: string;
    /**
     * The SVG background to be used instead of the TreeSpider ones
     */
    customBackground?: string;
    /**
     * The radius/width of the linker thumb
     */
    head_linker_thumb_circle_radius?: number;
    /**
     * The color of the linker thumb icon that shows if the head children has been collapsed or not
     */
    linker_thumb_icon_color?: TLinkerCircleColor;
    /**
     * The shape of the linker thumb
     */
    linker_thumb_shape?: TLinkerShape;
    /**
     * The shape of the head image or the employee initials wrapper if image is unavailable
     */
    head_image_shape?: THeadImageShape;
    /**
     * The chart head background color, useful in cases where you want the background to
     * match your website color mode
     */
    chart_head_bg?: string;
    /**
     * The parameter to set whether the library should automatically use the webpage's
     * body tag's background color as the chart head background color
     */
    auto_set_chart_head_bg?: boolean;
    /**
     * The parameter to set whether to automatically display-in-step when rendering
     * large data that is more than 500, it is advisable to keep this parameter to `true`
     * when working with large data that is more than 3000 employees because it is going
     * take few seconds to render which is bad for user experience
     */
    display_tree_in_step?: boolean;
    /**
     * The parameter to disable auto display tree in step feature
     */
    auto_display_tree_in_step?: boolean;
    /**
     * The steps to display trees, on initialization the number of the provided step will be rendered,
     * when a tree whose children are hidden by default
     * is expanded its children will also be rendered in the number of the provided step
     */
    tree_level_step?: number;
    /**
     * The parameter to tune the chart head color
     */
    pallet?: TColorPallet;
    /**
     * The type of tree link you want to use
     */
    tree_link_type?: TLinkType;
    /**
     * The length of the random number
     */
    random_data_length?: number;
    /**
     * Suspended - random_data_locale
     * The locale of the random data, it automatically use the user's device's locale
     * gotten through the browser
     */
    /**
     * The distance to be zoomed in
     */
    zoom_in_distance?: number;
    /**
     * The distance to be zoomed out
     */
    zoom_out_distance?: number;
    /**
     * The vertical space between heads, set this to a lower or higher number to
     * decrease or increase the distance between parent and children heads
     */
    verticalSpace?: string;
    /**
     * The CDN of the Google font to be loaded
     */
    font_link?: string;
    /**
     * The name of the provided font
     */
    font_name?: string;
    /**
     * The width of the TreeSpider wrapper container
     */
    width?: string;
    /**
     * The height of the TreeSpider wrapper container
     */
    height?: string;
}
export interface IChartHead {
    /**
     * required: id of the head
     */
    id: string;
    name: string;
    role: string;
    location?: string;
    parentId?: string;
    stat?: number;
    image?: string;
}
export interface ID3DataFormat extends IChartHead {
    children: IChartHead[];
}
export type TColorPallet = {
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
export type TTreeType = 'default' | 'cellar' | 'goldenRod' | 'hSpider' | 'hSpiderWalk' | 'radialSpiderLeg' | 'spiderlingsPack' | 'vSpiderWalk';
export type TChartHeadType = 'default' | 'landscape' | 'rounded';
export type TLinkType = 'curveBumpX' | 'curveBumpY' | 'curveBasisClosed' | 'curveLinear' | 'curveStep' | 'curveStepAfter' | 'curveStepBefore';
