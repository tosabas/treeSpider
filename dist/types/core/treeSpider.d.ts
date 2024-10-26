import { ITreeSpiderMain } from "../types/MainTypes";
import { TEventType } from "../types/utils.js";
import ColorHandler from "../helpers/colorHandler.js";
declare class TreeSpider extends EventTarget {
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
