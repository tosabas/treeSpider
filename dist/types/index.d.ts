declare module "utils/ts-element" {
    class TSElement extends HTMLDivElement {
        constructor();
        connectedCallback(): void;
    }
    export default TSElement;
}
declare module "helpers/colorHandler" {
    import { IChartHead, TColorPallet } from "types/MainTypes";
    import { TColorSet } from "types/utils";
    class ColorHandler {
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
}
declare module "helpers/chart-helper" {
    import { TChartHeadPointPosition, TColorSet, TElementCenterPositions, TEventType, THeadImageShape, THeadPointPosition, TLinkerCircleColor, TLinkerShape, TTreeToItemHierarchy } from "types/utils";
    import { IChartHead, ID3DataFormat, TChartHeadType, TLinkType } from "types/MainTypes";
    import TSElement from "utils/ts-element";
    import ColorHandler from "helpers/colorHandler";
    import * as d3 from "d3";
    class ChartMainHelper {
        tree_data: Array<IChartHead>;
        handleCollapseChildren: (svgNode: any, id: string, clicked_pos: number) => void | undefined;
        center_elem: (rect: DOMRect, position?: TElementCenterPositions) => void;
        itemHierarchy: TTreeToItemHierarchy;
        tmp_tree_data: IChartHead[];
        tree_level_step: number;
        display_tree_in_step: boolean;
        auto_display_tree_in_step: boolean;
        link_point_position: {
            [key in THeadPointPosition]: Function;
        };
        inverse_link_point_position: {
            [key in THeadPointPosition]: string;
        };
        chartHeadWidth: number;
        chartHeadHeight: number;
        chartHeadLandscapeWidth: number;
        chartHeadLandscapeHeight: number;
        chartHeadRoundedWidth: number;
        chartHeadRoundedHeight: number;
        color_handler: ColorHandler;
        chart_head_type: TChartHeadType;
        show_chart_head_border: boolean;
        animation_rotation_speed: number;
        animation_rotation_interval: number;
        head_linker_thumb_circle_radius: number;
        linker_thumb_icon_color: TLinkerCircleColor;
        linker_thumb_shape: TLinkerShape;
        head_image_shape: THeadImageShape;
        head_image_surface_area: number;
        chart_head_bg: string;
        auto_set_chart_head_bg: boolean;
        emitEvent: (eventName: TEventType, data?: any, cancelable?: boolean) => boolean;
        tree_link_types: {
            curveBumpX: d3.CurveFactory;
            curveBumpY: d3.CurveFactory;
            curveBasisClosed: d3.CurveFactory;
            curveLinear: d3.CurveFactory;
            curveStep: d3.CurveFactory;
            curveStepAfter: d3.CurveFactory;
            curveStepBefore: d3.CurveFactory;
        };
        tree_link_type: TLinkType | undefined;
        rootWrapperContainer: HTMLElement | null;
        app_unique_id: string;
        app_root_unique_selector: string;
        constructor();
        createDynamicEl(): TSElement;
        splitStringIntoBatch(text: string, len: number): string[];
        get_user_initials(name: string): string;
        format_employee_name(name: string, length?: number): string[];
        private symbol_type;
        private get_page_body_bg;
        private get_chart_head_bg;
        private get_image_shape_spacing;
        makeHead(head_data: IChartHead, doubleVerticalPoints?: boolean, pointPosition?: TChartHeadPointPosition): d3.Selection<SVGSVGElement, undefined, null, undefined>;
        handleCenterHead(e: any): void;
        defaultHead(head_data: IChartHead, doubleVerticalPoints?: boolean, pointPosition?: TChartHeadPointPosition): d3.Selection<SVGSVGElement, undefined, null, undefined>;
        landscapeHead(head_data: IChartHead, doubleVerticalPoints?: boolean, pointPosition?: TChartHeadPointPosition): d3.Selection<SVGSVGElement, undefined, null, undefined>;
        roundedHead(head_data: IChartHead, doubleVerticalPoints?: boolean, pointPosition?: TChartHeadPointPosition): d3.Selection<SVGSVGElement, undefined, null, undefined>;
        add_linker(all_group: d3.Selection<SVGGElement, undefined, null, undefined>, has_parent: boolean, has_children: boolean, pointPosition: TChartHeadPointPosition, color_set: TColorSet, rect: d3.Selection<SVGRectElement, undefined, null, undefined>, svgNode: d3.Selection<SVGSVGElement, undefined, null, undefined>, head_data: IChartHead, doubleVerticalPoints: boolean): void;
        get_tree_items_hierarchy(parentId?: string, parent_index?: number, action?: {
            level?: number;
            item_id?: string;
            callbackFn: (item: IChartHead, level: number) => void;
        }): TTreeToItemHierarchy;
        get_second_ancestor_item(child_id: string): any;
        getElemRelPosInTree(el_id: string): number;
        set_tmp_tree_data(el_id?: string | undefined): void;
        getIsParentRootEl(parent_id: string): boolean;
        getIsElRootTreeChild(id: string): boolean;
        getRootTreeEl(): IChartHead | undefined;
        el_has_children(el_id: string, check_tmp_data?: boolean): boolean;
        get_children_down_to_level(el_id: string, level_limit: number, current_level?: number): IChartHead[];
        data_to_d3_format(parentId?: string, include_stat?: boolean): ID3DataFormat;
    }
    export default ChartMainHelper;
}
declare module "types/utils" {
    import TSElement from "utils/ts-element";
    import { IChartHead } from "types/MainTypes";
    import ChartMainHelper from "helpers/chart-helper";
    export type TTreeMapArr = {
        svgNode: any;
        targetChild: SVGSVGElement;
        parentId: string;
        id: string;
        lineOrigin?: TBranchLineOrigin;
    };
    export type TChildrenMapperReturnEl = TSElement;
    export type TSingleChildrenMap = {
        child_el: TSElement;
        children_map_arr: TTreeMapArr[];
    };
    export type TTreeClassParams = {
        tree_data: Array<IChartHead>;
        tsInnerContainer: HTMLElement;
        chartHelper: ChartMainHelper;
    };
    export type THeadPointPosition = "top" | "bottom" | "left" | "right";
    export type TChartHeadPointPosition = {
        parent: THeadPointPosition;
        children: THeadPointPosition;
    } | false;
    export type TColorSet = {
        color: string;
        brighter: string;
        darker: string;
        bright100: string;
        dark100: string;
        bright500: string;
        gray: string;
        gray85: string;
    };
    export type TTreeToItemHierarchy = Array<{
        level: number;
        items: Array<IChartHead>;
    }>;
    export type TBranchLineOrigin = "top" | "bottom" | "left" | "right";
    export type TElementCenterPositions = 'center' | 'top' | 'bottom' | 'right' | 'left';
    export type TLinkerCircleColor = 'brighter' | 'bright500' | 'bright100';
    export type TLinkerShape = 'symbolAsterisk' | 'symbolCircle' | 'symbolCross' | 'symbolDiamond' | 'symbolDiamond2' | 'symbolPlus' | 'symbolSquare' | 'symbolSquare2' | 'symbolStar' | 'symbolTriangle' | 'symbolTriangle2' | 'symbolWye' | 'symbolX';
    export type THeadImageShape = 'symbolCircle' | 'symbolCross' | 'symbolDiamond' | 'symbolDiamond2' | 'symbolSquare' | 'symbolSquare2' | 'symbolStar' | 'symbolTriangle' | 'symbolTriangle2' | 'symbolWye';
    export type TEventType = 'chart_head.create' | 'chart_head.expanded' | 'chart_head.collapsed' | 'zooming' | 'library.init';
}
declare module "types/MainTypes" {
    import { THeadImageShape, TLinkerCircleColor, TLinkerShape } from "types/utils";
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
}
declare module "utils/backgrounds" {
    /**
     * SVG backgrounds gotten from https://www.fffuel.co
     */
    const _default: {
        flux: string;
        quad: string;
        blurry: string;
        chaos: string;
        spiral: string;
        flurry: string;
        whirling: string;
        replicate: string;
        scribble: string;
        squiggly: string;
        gyrate: string;
        leaves: string;
        reflection: string;
        spot: string;
    };
    export default _default;
}
declare module "utils/ts-root-container" {
    import * as d3 from 'd3';
    class TSRootContainer extends HTMLDivElement {
        main_svg: any;
        tree_data: any;
        static observeAttributes: string[];
        private backgroundPattern;
        private backgroundSize;
        private customBackground;
        private backgroundPosition;
        constructor();
        connectedCallback(): void;
        setCanvasBg(): void;
        defaultDotsPatternBg(): d3.Selection<SVGSVGElement, undefined, null, undefined>;
        fluxPatternBg(): string;
        quadPatternBg(): string;
        blurryBg(): string;
        chaosPatternBg(): string;
        spiralPatternBg(): string;
        flurryPatternBg(): string;
        whirlingPatternBg(): string;
        replicatePatternBg(): string;
        scribblePatternBg(): string;
        squigglyPatternBg(): string;
        gyrratePatternBg(): string;
        leavesPatternBg(): string;
        reflectionPatternBg(): string;
        spotPatternBg(): string;
    }
    export default TSRootContainer;
}
declare module "helpers/randomDataGenerator" {
    import { IChartHead } from "types/MainTypes";
    class RandomDataGenerator {
        private data_length;
        generated_data: Array<IChartHead>;
        private auto_proceed;
        private locale;
        imgAPIs: string[];
        constructor({ length, auto_proceed, locale }: {
            length?: number;
            auto_proceed?: boolean;
            locale?: string;
        });
        generate(): Array<IChartHead>;
        private make_data;
        private get_parent_id;
        private generate_data;
    }
    export default RandomDataGenerator;
}
declare module "trees/default.tree" {
    import { TTreeClassParams } from "types/utils";
    class DefaultTree {
        private chartHelper;
        private tree_map_arr;
        protected content_wrapper: HTMLElement | null;
        protected tsInnerContainer: HTMLElement | null;
        current_scale: number;
        constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
        private map_children_data_to_head;
        private organizeUI;
        private drawBranchLinkFresh;
        private drawBranchLink;
        private handleCollapseChildren;
        private removeNodeRecursiveFromTreeMap;
    }
    export default DefaultTree;
}
declare module "trees/vSpiderWalk.tree" {
    import ChartMainHelper from "helpers/chart-helper";
    import { TTreeClassParams, TTreeMapArr } from "types/utils";
    class VerticalSpiderWalkTree {
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
    export default VerticalSpiderWalkTree;
}
declare module "trees/hSpider.tree" {
    import { TTreeClassParams } from "types/utils";
    class HorizontalTreeSpider {
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
}
declare module "trees/hSpiderWalk.tree" {
    import ChartMainHelper from "helpers/chart-helper";
    import { TTreeClassParams, TTreeMapArr } from "types/utils";
    class HorizontalSpiderWalkTree {
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
}
declare module "trees/cellarSpider.tree" {
    import { TTreeClassParams, TTreeMapArr } from "types/utils";
    import ChartMainHelper from "helpers/chart-helper";
    class CellarTreeSpider {
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
    export default CellarTreeSpider;
}
declare module "trees/goldenRodSpider.tree" {
    import { TTreeClassParams } from "types/utils";
    import ChartMainHelper from "helpers/chart-helper";
    class GoldenRodSpider {
        protected content_wrapper: HTMLElement | null;
        protected head_child_wrapper: HTMLElement | null;
        protected tsInnerContainer: HTMLElement | null;
        chartHelper: ChartMainHelper | undefined;
        current_scale: number;
        nodes_group: any;
        links_group: any;
        rotate_deg: number;
        animation_interval: any;
        start_animation: boolean;
        constructor({ tsInnerContainer, chartHelper }: TTreeClassParams);
        private organizeUI;
        animate_chat(once?: boolean, anti?: boolean): any;
        private map_children_data_to_head;
    }
    export default GoldenRodSpider;
}
declare module "trees/radialSpiderLeg.tree" {
    import { TTreeClassParams } from "types/utils";
    import ChartMainHelper from "helpers/chart-helper";
    class RadialSpiderLeg {
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
}
declare module "utils/icons" {
    /**
     * SVG icons gotten from https://svgrepo.com
     */
    const _default_1: {
        zoomIn: string;
        zoomOut: string;
        resetZoom: string;
        rotate: string;
        rotate_once: string;
        rotate_once_anti_clockwise: string;
        rotate_anticlockwise: string;
    };
    export default _default_1;
}
declare module "utils/ui-tools" {
    import { TTreeType } from "types/MainTypes";
    class UITools {
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
}
declare module "core/treeSpider" {
    import { ITreeSpiderMain } from "types/MainTypes";
    import { TEventType } from "types/utils";
    import ColorHandler from "helpers/colorHandler";
    class TreeSpider extends EventTarget {
        /**
         * The library name
         */
        private libraryName;
        protected targetRootContainer: HTMLElement | null;
        protected rootWrapperContainer: HTMLElement | null;
        protected tsInnerContainer: HTMLElement | null;
        protected rootCanvasEl: HTMLCanvasElement | null;
        private chartHelper;
        private currentChartUI;
        private zoom_instace;
        protected colorHandler: ColorHandler;
        private tree_default_point_position;
        private instance_unique_id;
        /**
         * TreeSpider options
         */
        protected options: ITreeSpiderMain;
        constructor(options: ITreeSpiderMain);
        /**
         * Method to programatically initialize TreeSpider
         */
        initialize(): void;
        private initialize_root_container;
        private setCSSPropertyVar;
        private loadFont;
        protected setObjectValue(objectParent: Object, value: Object): Object;
        private createUI;
        private zoomInOut;
        /**
         * The method to reset the zoom to the default zoom state
         */
        resetZoom(): void;
        private placeRootContainer;
        private bindPanning;
        private center_elem;
        private emitEvent;
        /**
         * @public @method updateChartHeadBg - Method for programmatically updating all chat head's background color
         * @param color - The color value to set the chart heads to, you can pass any CSS color values to it
         */
        updateChartHeadBg(color: string): void;
        /**
         * The short form for addEventListener
         * @param eventName - The event you want to subscribe to
         * @param callbackFn - The callback function
         */
        on(eventName: TEventType, callbackFn: (data?: any) => null): void;
        /**
         * The method to programatically update parameters
         * @param options_to_set - The parameter to update
         */
        setOptions(options_to_set: Omit<ITreeSpiderMain, 'targetContainer'>): void;
        /**
         * The method for programatically zooming in and out
         * @param dir - The direction of the zoom, in or out
         */
        zoom(dir: 'in' | 'out'): void;
        /**
         * The method to start rotating the chart clockwisely
         */
        startStopRotateCW(): void;
        /**
         * The method to start rotating the chart anti-clockwisely
         */
        startStopRotateACW(): void;
        /**
         * The method to rotate the chart once clockwisely
         */
        rotateOnceCW(): void;
        /**
         * The method to rotate the chart once clockwisely
         */
        rotateOnceACW(): void;
    }
    export default TreeSpider;
}
declare module "trees/spiderlingsPacks.tree" {
    import { TTreeClassParams } from "types/utils";
    class SpiderlingsPacksTree {
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
}
