import { IChartHead, ITreeSpiderMain } from "../types/MainTypes";
import { TChartHeadType, TDropShadow, TLinkType } from "../types/utils";
import TSRootContainer from "../utils/ts-root-container";
import TSElement from "../utils/ts-element";
import { TElementCenterPositions, TEventType, THeadImageShape, TLinkerCircleColor, TLinkerShape } from "../types/utils";
import RandomDataGenerator from "../helpers/randomDataGenerator";
import ChartMainHelper from "../helpers/chart-helper";

// color handler
import ColorHandler from "../helpers/colorHandler";

// trees
import DefaultTree from "../trees/default.tree";
import VerticalSpiderWalkTree from "../trees/vSpiderWalk.tree";
import HorizontalTreeSpider from "../trees/hSpider.tree";
import HorizontalSpiderWalkTree from "../trees/hSpiderWalk.tree";
import CellarTreeSpider from "../trees/cellarSpider.tree";
import GoldenRodSpider from "../trees/goldenRodSpider.tree";
import RadialSpiderLeg from "../trees/radialSpiderLeg.tree";
import UITools from "../utils/ui-tools";
import * as d3 from "d3"


class TreeSpider extends EventTarget {
    /**
     * The library name
     */
    private libraryName = "TreeSpider";
    
    protected targetRootContainer: HTMLElement | null = null;
    protected rootWrapperContainer: HTMLElement | null = null;
    protected tsInnerContainer: HTMLElement | null = null;
    protected rootCanvasEl: HTMLCanvasElement | null = null;

    private chartHelper: ChartMainHelper = {} as ChartMainHelper;

    private currentChartUI: any;

    private zoom_instace: d3.ZoomBehavior<Element, unknown> | undefined;

    protected colorHandler: ColorHandler = {} as ColorHandler;

    private tree_default_point_position: TElementCenterPositions = '' as TElementCenterPositions

    private instance_unique_id: string = ''

    /**
     * TreeSpider options
     */
    protected options: ITreeSpiderMain = {
        targetContainer: '',
        width: '100%',
        height: '500px',
        placeEl: 'override',
        tree_data: undefined,
        color_range: [],
        tree_type: 'default',
        chart_head_type: 'default',
        show_tools: true,
        show_chart_head_border: false,
        animation_rotation_speed: 10,
        animation_rotation_interval: 1,
        backgroundPattern: 'default',
        backgroundSize: undefined,
        customBackground: undefined,
        backgroundPosition: undefined,
        head_linker_thumb_circle_radius: 8,
        linker_thumb_icon_color: 'bright500',
        linker_thumb_shape: 'symbolCircle',
        head_image_shape: 'symbolCircle',
        chart_head_bg: '#ffffff',
        auto_set_chart_head_bg: false,
        display_tree_in_step: false,
        auto_display_tree_in_step: true,
        tree_level_step: 2,
        pallet: {
            h: 10,
            s: 0.5,
            l: 0.5,
            darker: 3,
            brighter: 0.8,
            bright100: 0.5,
            dark100: 0.5,
            gray: 50,
            gray85: 85
        },
        tree_link_type: undefined,
        random_data_length: 200,
        // random_data_locale: window.navigator.language, // Suspended - the user's device's locale
        autoInitialize: true,
        zoom_in_distance: 1.5,
        zoom_out_distance: 0.5,
        verticalSpace: '120px',
        font_link: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
        font_name: "Lato",
        dropshadow: {
            x: "-50%",
            y: "-50%",
            width: "200%",
            height: "200%",
            dx: 1,
            dy: 1,
            stdDeviation: 4,
            floodColor: "rgba(91, 91, 91, 0.19)",
        }
    }

    constructor (options: ITreeSpiderMain) {
        super();

        if (options.targetContainer == undefined) {
            throw new Error(this.libraryName + ": The target container is required")
        }

        if (options.tree_data != undefined) {
            this.options.tree_data = options.tree_data;            
        }else{
            const randData = new RandomDataGenerator({
                length: options.random_data_length || this.options.random_data_length,
            });            
            this.options.tree_data = randData.generated_data;
        }

        this.setOptions(options);
        this.instance_unique_id = 'tree_spider_' + this.options.targetContainer.replace(/[\W\D]/, '_')
        this.loadFont();
        console.info(this.libraryName + ' ready!');
        this.options.autoInitialize && this.initialize();
    }

    /**
     * Method to programatically initialize TreeSpider
     */
    public initialize() {
        this.targetRootContainer = d3.select(this.options.targetContainer).node() as HTMLElement;
        if (this.targetRootContainer === null) throw new Error(this.libraryName + ": target container not found");
        this.targetRootContainer.setAttribute('data-tree-spider-initialized', this.instance_unique_id);
        
        this.createUI();
        
        setTimeout(() => {
            this.emitEvent('library.init', {rootContainer: this.rootWrapperContainer});            
        }, 0);
        console.info(this.libraryName + ' initialized!')
    }

    private initialize_root_container () {
        this.rootWrapperContainer = new TSRootContainer();
        this.rootWrapperContainer.setAttribute('data-ts-unique-id', this.instance_unique_id)
        this.setCSSPropertyVar('--vertical-space-var', this.options.verticalSpace as string)
        this.setCSSPropertyVar('--font-family', this.options.font_name as string)
        this.setCSSPropertyVar('--root-cont-width', this.options.width as string)
        this.setCSSPropertyVar('--root-cont-height', this.options.height as string)
        this.rootWrapperContainer.setAttribute('backgroundPattern', this.options.backgroundPattern as string)
        this.rootWrapperContainer.setAttribute('backgroundSize', this.options.backgroundSize as any)
        this.rootWrapperContainer.setAttribute('customBackground', this.options.customBackground as any)
        this.rootWrapperContainer.setAttribute('backgroundPosition', this.options.backgroundPosition as any)
    }

    private setCSSPropertyVar(prop: string, value: string) {
        this.rootWrapperContainer?.style.setProperty(prop, value)
    }
 
    private loadFont () {
        let fontLink: d3.Selection<HTMLLinkElement, undefined, null, undefined> | undefined, 
            preconnect: d3.Selection<HTMLLinkElement, undefined, null, undefined> | undefined,
            crossorgin_preconnect: d3.Selection<HTMLLinkElement, undefined, null, undefined> | undefined;

        if (d3.select(`[href="https://fonts.googleapis.com"]`).node() == null) {
            preconnect = d3.create('link')
            .attr("rel", "preconnect")
            .attr("href", "https://fonts.googleapis.com");           
        }
        if (d3.select(`[href="https://fonts.gstatic.com"]`).node() == null) {
            crossorgin_preconnect = d3.create('link')
            .attr("rel", "preconnect")
            .attr("href", "https://fonts.gstatic.com")
            .attr("crossOrigin", "");
        }


        if(this.options.font_link) {
            fontLink = d3.create('link')
            .attr("href", this.options.font_link as string)
            .attr("rel", "stylesheet");
        }
        
        preconnect != undefined && (d3.select('head').node() as HTMLHeadElement).appendChild(preconnect.node() as HTMLLinkElement);
        crossorgin_preconnect != undefined && (d3.select('head').node() as HTMLHeadElement).appendChild(crossorgin_preconnect.node() as HTMLLinkElement);
        fontLink != undefined && (d3.select('head').node() as HTMLHeadElement).appendChild(fontLink.node() as HTMLLinkElement);
    }

    protected setObjectValue (objectParent: Object, value: Object) {
        const setObj: {[key: string]: any} = objectParent;
        if (Object.keys(setObj).length == 0) return value;
        for (const keyx in setObj) {
            if (!Object.keys(value).includes(keyx)) continue;
            if (Object.hasOwnProperty.call(setObj, keyx)) {
                if (typeof setObj[keyx as keyof typeof setObj] == 'object' && !Array.isArray(setObj[keyx as keyof typeof setObj])) {
                    const xc = this.setObjectValue(setObj[keyx as keyof typeof setObj], value[keyx as keyof typeof value])
                    setObj[keyx as keyof typeof setObj] = {...setObj[keyx as keyof typeof setObj], ...xc}
                }else{
                    setObj[keyx as keyof typeof setObj] = value[keyx as keyof typeof value]
                }
            }
        }
        return setObj;
    }

    private createUI () {
        this.initialize_root_container();

        this.chartHelper = new ChartMainHelper();
        this.chartHelper.rootWrapperContainer = this.rootWrapperContainer;
        this.chartHelper.app_unique_id = this.instance_unique_id;
        this.chartHelper.tree_data = this.options.tree_data as IChartHead[] as IChartHead[];
        this.chartHelper.center_elem = this.center_elem.bind(this);
        this.chartHelper.chart_head_type = this.options.chart_head_type as TChartHeadType;
        this.chartHelper.animation_rotation_speed = this.options.animation_rotation_speed as number;
        this.chartHelper.animation_rotation_interval = this.options.animation_rotation_interval as number;
        this.chartHelper.head_linker_thumb_circle_radius = this.options.head_linker_thumb_circle_radius as number;
        this.chartHelper.linker_thumb_icon_color = this.options.linker_thumb_icon_color as TLinkerCircleColor;
        this.chartHelper.linker_thumb_shape = this.options.linker_thumb_shape as TLinkerShape;
        this.chartHelper.head_image_shape = this.options.head_image_shape as THeadImageShape;
        this.chartHelper.chart_head_bg = this.options.chart_head_bg as string;
        this.chartHelper.auto_set_chart_head_bg = this.options.auto_set_chart_head_bg as boolean;
        this.chartHelper.display_tree_in_step = this.options.display_tree_in_step as boolean;
        this.chartHelper.auto_display_tree_in_step = this.options.auto_display_tree_in_step as boolean;
        this.chartHelper.tree_level_step = this.options.tree_level_step as number;
        this.chartHelper.tree_link_type = this.options.tree_link_type as TLinkType;
        this.chartHelper.dropshadow = this.options.dropshadow as TDropShadow;
        this.chartHelper.emitEvent = this.emitEvent.bind(this);
        
        this.colorHandler = new ColorHandler({
            tree_data: this.options.tree_data as IChartHead[],
            color_range: this.options.color_range,
            pallet: this.options.pallet
        });
        this.chartHelper.color_handler = this.colorHandler;
        
        this.placeRootContainer();
    }

    private zoomInOut(dir='in') {
        const zoom_level = (dir == 'in' ? this.options.zoom_in_distance : this.options.zoom_out_distance) as number
        this.zoom_instace?.scaleBy(d3.select(`[data-ts-unique-id='${this.instance_unique_id}']`), zoom_level,)
    }

    /**
     * The method to reset the zoom to the default zoom state
     */
    public resetZoom() {
        const first_svg_el = (d3.select(`[data-ts-unique-id='${this.instance_unique_id}'] .root-svg-el > g`)!.node() as SVGSVGElement)!.getBoundingClientRect();
        this.center_elem(first_svg_el as DOMRect, this.tree_default_point_position)
    }

    private placeRootContainer () {
        this.tsInnerContainer = this.chartHelper.createDynamicEl();
        this.tsInnerContainer.className = "ts-inner-container";

        if (this.options.tree_data?.length == 0) {
            const empty_content_container = new TSElement();
            empty_content_container.innerText = "No data provided!"
            this.tsInnerContainer.appendChild(empty_content_container)
        }

        this.rootWrapperContainer?.appendChild(this.tsInnerContainer);

        if (this.options.placeEl == 'start') {
            this.targetRootContainer?.prepend(this.rootWrapperContainer as HTMLElement);
        }else if (this.options.placeEl == 'end') {
            this.targetRootContainer?.append(this.rootWrapperContainer as HTMLElement);
        }else if (typeof this.options.placeEl === 'object' && Object.keys(this.options.placeEl).length > 0) {
            this.targetRootContainer?.insertBefore(this.rootWrapperContainer as HTMLElement, this.targetRootContainer.querySelector(this.options.placeEl.beforeEl))
        }else{
            this.targetRootContainer!.innerHTML = '';
            this.targetRootContainer!.appendChild(this.rootWrapperContainer as HTMLElement);
        }

        this.bindPanning();

        if (this.options.tree_type == 'default') {
            this.currentChartUI = new DefaultTree({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'vSpiderWalk') {
            this.currentChartUI = new VerticalSpiderWalkTree({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'hSpider') {
            this.currentChartUI = new HorizontalTreeSpider({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'hSpiderWalk') {
            this.currentChartUI = new HorizontalSpiderWalkTree({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'cellar') {
            this.currentChartUI = new CellarTreeSpider({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'goldenRod') {
            this.currentChartUI = new GoldenRodSpider({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else if (this.options.tree_type == 'radialSpiderLeg') {
            this.currentChartUI = new RadialSpiderLeg({
                tree_data: this.options.tree_data as IChartHead[],
                tsInnerContainer: this.tsInnerContainer,
                chartHelper: this.chartHelper
            });            
        }else{
            throw new Error('Not implemented and you are welcome to implement it :)')
        } 

        if (this.options.tree_data!.length > 0 && this.options.show_tools) {
            
            const uitool = new UITools({
                root_ui_element: this.rootWrapperContainer as HTMLElement,
                zoomInOut: this.zoomInOut.bind(this),
                resetZoom: this.resetZoom.bind(this),
                animate_chat: this.currentChartUI?.animate_chat?.bind(this.currentChartUI)
            })      
            uitool.tree_type = this.options.tree_type      
        }

    }

    

    private bindPanning () {
        const root_cont_rect = this.rootWrapperContainer?.getBoundingClientRect();

        // zoom filter removed because of issue on mobile browsers
        const zoomFilter = (event: any) => {
            event.preventDefault();
            return (!event.ctrlKey || event.type === 'wheel') && !event.button;
        }

        const root_container_el = d3?.select(`[data-ts-unique-id='${this.instance_unique_id}']`) as any;

        const zoomed = (e: any) => {
            const emitedEvent = this.emitEvent('zooming', {e})
            if(!emitedEvent) return;
            this.tsInnerContainer!.style.transform = `translate(${e.transform.x}px, ${e.transform.y}px) scale(${e.transform.k})`
            this.rootWrapperContainer!.style.setProperty('--ts-root-container-cursor', 'grabbing')
            this.currentChartUI.current_scale = e.transform.k;
        }

        this.zoom_instace = d3.zoom()
            // .filter(zoomFilter) // filter removed because of issue on mobile browsers
            .extent([[0, 0], [root_cont_rect!.width, root_cont_rect!.height]])
            .on("zoom", zoomed)
            .on('end', (e: any) => {
                this.rootWrapperContainer!.style.setProperty('--ts-root-container-cursor', 'grab')
            })
        
        root_container_el.call(this.zoom_instace).on("dblclick.zoom", (e: any) => null);
    }

    private center_elem (rect: DOMRect, position?: TElementCenterPositions) {
        const root_container_el = d3?.select(`[data-ts-unique-id='${this.instance_unique_id}']`) as any;

        (this.tree_default_point_position == '' as TElementCenterPositions && position != undefined) && (this.tree_default_point_position = position);
        
        const root_cont_rect = root_container_el.node()?.getBoundingClientRect();
        const inner_cont_rect = this.tsInnerContainer?.getBoundingClientRect();

        const rel_posX = ((rect.left - (inner_cont_rect!.left)) / this.currentChartUI.current_scale);
        const rel_posY = ((rect.top - (inner_cont_rect!.top)) / this.currentChartUI.current_scale);

        const offsetMoveX = (root_cont_rect.width / 2) - ((rect.width / 2) / this.currentChartUI.current_scale);
        const offsetMoveY = (root_cont_rect.height / 2) - (rect.height / 2) / this.currentChartUI.current_scale;

        let moveX = 0;
        let moveY = 0;

        if ((position || this.tree_default_point_position) == 'center') {
            moveX = rel_posX - offsetMoveX;
            moveY = rel_posY - offsetMoveY;
        }else if ((position || this.tree_default_point_position) == 'top') {
            moveX = rel_posX - offsetMoveX;
            moveY = rel_posY - 10;            
        }else if ((position || this.tree_default_point_position) == 'bottom') {
            moveX = rel_posX - offsetMoveX;
            const el_chunk_sizes_y = (root_cont_rect.height / 2) - (rect.height/2)
            moveY = (rel_posY - (offsetMoveY + el_chunk_sizes_y)) + 10;            
        }else if ((position || this.tree_default_point_position) == 'left') {
            moveX = rel_posX - 10;
            moveY = rel_posY - offsetMoveY;
        }else if ((position || this.tree_default_point_position) == 'right') {
            const el_chunk_sizes_x = (root_cont_rect.width / 2) - (rect.width/2)
            moveX = (rel_posX - (offsetMoveX + el_chunk_sizes_x)) + 10;
            moveY = rel_posY - offsetMoveY;
        }

        root_container_el.transition().duration(2500).call(
            this.zoom_instace?.transform,
            d3?.zoomIdentity.translate(-moveX, -moveY),
        );
    }

    private emitEvent (eventName: TEventType, data?: any, cancelable=true) {
        const customEv = new CustomEvent(eventName, {detail: data, bubbles: true, cancelable});
        return this.dispatchEvent(customEv);
    }

    /**
     * @public @method updateChartHeadBg - Method for programmatically updating all chat head's background color
     * @param color - The color value to set the chart heads to, you can pass any CSS color values to it
     */
    public updateChartHeadBg(color: string) {
        if(this.options.chart_head_type == 'rounded') return;
        this.rootWrapperContainer?.querySelectorAll('.main-svg-el').forEach(el => (el.querySelector('rect') as SVGRectElement).style.fill = color);
        this.addEventListener('chart_head.expanded', () => 
            this.rootWrapperContainer?.querySelectorAll('.main-svg-el').forEach(el => (el.querySelector('rect') as SVGRectElement).style.fill = color));
    }
    
    /**
     * The short form for addEventListener
     * @param eventName - The event you want to subscribe to
     * @param callbackFn - The callback function
     */
    public on(eventName: TEventType, callbackFn: (data?: any) => null) {
        this.addEventListener(eventName, callbackFn)
    }

    /**
     * The method to programatically update parameters
     * @param options_to_set - The parameter to update
     */
    public setOptions (options_to_set: Omit<ITreeSpiderMain,'targetContainer'>) {
        this.setObjectValue(this.options, options_to_set)
    }

    /**
     * The method for programatically zooming in and out
     * @param dir - The direction of the zoom, in or out
     */
    public zoom(dir: 'in' | 'out') {
        this.zoomInOut(dir)
    }

    /**
     * The method to start rotating the chart clockwisely
     */
    public startStopRotateCW() {
        this.currentChartUI?.animate_chat()
    }

    /**
     * The method to start rotating the chart anti-clockwisely
     */
    public startStopRotateACW() {
        this.currentChartUI?.animate_chat(false, true)
    }

    /**
     * The method to rotate the chart once clockwisely
     */
    public rotateOnceCW() {
        this.currentChartUI?.animate_chat(true)
    }

    /**
     * The method to rotate the chart once clockwisely
     */
    public rotateOnceACW() {
        this.currentChartUI?.animate_chat(true, true)
    }
    
    
}


export default TreeSpider;