import HCRootContainer from "../utils/st-root-container.js";
import HCElement from "../utils/st-element.js";
import RandomDataGenerator from "../helpers/randomDataGenerator.js";
import ChartMainHelper from "../helpers/chart-helper.js";
// color handler
import ColorHandler from "../helpers/colorHandler.js";
// trees
import DefaultTree from "../trees/default.tree.js";
import VerticalSpiderWalkTree from "../trees/vSpiderWalk.tree.js";
import HorizontalSpiderTree from "../trees/hSpider.tree.js";
import HorizontalSpiderWalkTree from "../trees/hSpiderWalk.tree.js";
import CellarSpiderTree from "../trees/cellarSpider.tree.js";
import GoldenRodSpider from "../trees/goldenRodSpider.tree.js";
import RadialSpiderLeg from "../trees/radialSpiderLeg.tree.js";
import UITools from "../utils/ui-tools.js";
class SpiderTree extends EventTarget {
    /**
     * The library name
     */
    libraryName = "TreeSpider";
    hc_d3 = null;
    main_svg = null;
    curves = ['curveMonotoneY', 'curveMonotoneX', 'curveNatural', 'curveStep'];
    tree_data = [
        { id: "1", name: "Abayomi AmusaOyediran", role: "Manager", location: "Lagos, Nigeria" },
        { id: "2", parentId: "1", name: "Trey Anderson", role: "Product Manager", location: "California, United States" },
        { id: "3", parentId: "1", name: "Troy Manuel", role: "Software Developer", location: "Alberta, Canada" },
        { id: "4", parentId: "1", name: "Rebecca Oslon", role: "Software Developer", location: "London, United Kingdom" },
        { id: "5", parentId: "1", name: "David Scheg", role: "Product Designer", location: "Jiaozian, China" },
        { id: "6", parentId: "2", name: "James Zucks", role: "DevOps", location: "Accra, Ghana" },
        { id: "7", parentId: "2", name: "Zu Po Xe", role: "Backend Developer", location: "Johanesburg, South Africa" },
        { id: "8", parentId: "2", name: "Scott Ziagler", role: "FrontEnd Developer Intern" },
        { id: "9", parentId: "7", name: "Xervia Allero", role: "FrontEnd Developer Intern" },
        { id: "10", parentId: "3", name: "Adebowale Ajanlekoko", role: "Fullstack Developer" },
    ];
    targetRootContainer = null;
    rootWrapperContainer = null;
    hcInnerContainer = null;
    rootCanvasEl = null;
    // protected head_wrapper: HTMLElement | null = null;
    chartHelper = {};
    currentChartUI;
    zoom_instace;
    // private root: any;
    colorHandler = {};
    tree_default_point_position = '';
    /**
     * SpiderTree options
     */
    options = {
        targetContainer: '',
        placeEl: 'override',
        tree_data: [],
        color_range: [],
        tree_type: 'hSpiderWalk',
        chart_head_type: 'default',
        show_tools: true,
        show_chart_head_border: false,
        animation_rotation_speed: 10,
        animation_rotation_interval: 1
    };
    constructor(options) {
        super();
        if (options.targetContainer == undefined) {
            throw new Error(this.libraryName + ": The target container is required");
        }
        if (options.tree_data != undefined) {
            this.options.tree_data = options.tree_data;
        }
        else {
            const randData = new RandomDataGenerator({ length: 40 });
            // this.options.tree_data = [];
            this.options.tree_data = randData.generated_data;
        }
        this.loadFont();
        this.setOptions(options);
        this.initialize();
    }
    initialize() {
        this.targetRootContainer = document.querySelector(this.options.targetContainer);
        if (this.targetRootContainer === null)
            throw new Error(this.libraryName + ": target container not found");
        console.log("yah", this.options, this.targetRootContainer);
        this.addD3Script();
    }
    addD3Script() {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/d3@7";
        document.body.appendChild(script);
        script.onload = () => {
            this.createUI();
        };
    }
    loadFont() {
        const preconnect = document.createElement('link');
        preconnect.rel = "preconnect";
        preconnect.href = "https://fonts.googleapis.com";
        const crossorgin_preconnect = document.createElement('link');
        crossorgin_preconnect.rel = "preconnect";
        crossorgin_preconnect.href = "https://fonts.gstatic.com";
        crossorgin_preconnect.crossOrigin = '';
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap";
        fontLink.rel = "stylesheet";
        document.body.appendChild(preconnect);
        document.body.appendChild(crossorgin_preconnect);
        document.body.appendChild(fontLink);
    }
    setOptions(options_to_set) {
        this.setObjectValue(this.options, options_to_set);
    }
    setObjectValue(objectParent, value) {
        const setObj = objectParent;
        if (Object.keys(setObj).length == 0)
            return value;
        for (const keyx in setObj) {
            if (!Object.keys(value).includes(keyx))
                continue;
            if (Object.hasOwnProperty.call(setObj, keyx)) {
                if (typeof setObj[keyx] == 'object' && !Array.isArray(setObj[keyx])) {
                    const xc = this.setObjectValue(setObj[keyx], value[keyx]);
                    setObj[keyx] = { ...setObj[keyx], ...xc };
                }
                else {
                    setObj[keyx] = value[keyx];
                }
            }
        }
        return setObj;
    }
    createUI() {
        this.hc_d3 = window.d3;
        this.chartHelper = new ChartMainHelper();
        this.chartHelper.tree_data = this.options.tree_data;
        this.chartHelper.center_elem = this.center_elem.bind(this);
        this.chartHelper.chart_head_type = this.options.chart_head_type;
        this.chartHelper.animation_rotation_speed = this.options.animation_rotation_speed;
        this.chartHelper.animation_rotation_interval = this.options.animation_rotation_interval;
        this.colorHandler = new ColorHandler({
            tree_data: this.options.tree_data,
            // color_range: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'],
            // color_range: ['#b31212', '#b34712', '#b38d12', '#9ab312', '#2fb312', '#12b362', '#12b3a8', '#1278b3', '#1712b3', '#5712b3', '#8d12b3', '#b3128d', '#b3124a', '#b31212'],
            color_range: this.options.color_range,
            // color_range: ["#828282", "#2d2e2e"],
            // color_range: ["#3474eb", "#034659"],
            // color_range: ["#3474eb", "#3474eb"],
            // color_range: ["darkblue", "lightblue"],
            // color_range: ["#1268b3", "#6812b3"],
        });
        this.chartHelper.color_handler = this.colorHandler;
        this.placeRootContainer();
    }
    zoomInOut(dir = 'in') {
        const zoom_level = dir == 'in' ? 1.2 : 0.8;
        this.zoom_instace?.scaleBy(this.hc_d3.select('.hv-root-wrapper-element'), zoom_level);
    }
    resetZoom() {
        const first_svg_el = this.hc_d3.select('.root-svg-el').node().getBoundingClientRect();
        this.center_elem(first_svg_el, this.tree_default_point_position);
    }
    placeRootContainer() {
        this.rootWrapperContainer = new HCRootContainer();
        this.hcInnerContainer = this.chartHelper.createDynamicEl();
        this.hcInnerContainer.className = "hc-inner-container";
        if (this.options.tree_data.length == 0) {
            const empty_content_container = new HCElement();
            empty_content_container.innerText = "No data provided!";
            this.hcInnerContainer.appendChild(empty_content_container);
        }
        this.rootWrapperContainer.appendChild(this.hcInnerContainer);
        if (this.options.placeEl == 'start') {
            this.targetRootContainer?.prepend(this.rootWrapperContainer);
        }
        else if (this.options.placeEl == 'end') {
            this.targetRootContainer?.append(this.rootWrapperContainer);
        }
        else if (typeof this.options.placeEl === 'object' && Object.keys(this.options.placeEl).length > 0) {
            this.targetRootContainer?.insertBefore(this.rootWrapperContainer, this.targetRootContainer.querySelector(this.options.placeEl.beforeEl));
        }
        else {
            this.targetRootContainer.innerHTML = '';
            this.targetRootContainer.appendChild(this.rootWrapperContainer);
        }
        this.bindPanning();
        if (this.options.tree_type == 'default') {
            this.currentChartUI = new DefaultTree({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'vSpiderWalk') {
            this.currentChartUI = new VerticalSpiderWalkTree({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'hSpider') {
            this.currentChartUI = new HorizontalSpiderTree({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'hSpiderWalk') {
            this.currentChartUI = new HorizontalSpiderWalkTree({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'cellar') {
            this.currentChartUI = new CellarSpiderTree({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'goldenRod') {
            this.currentChartUI = new GoldenRodSpider({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else if (this.options.tree_type == 'radialSpiderLeg') {
            this.currentChartUI = new RadialSpiderLeg({
                tree_data: this.options.tree_data,
                hcInnerContainer: this.hcInnerContainer,
                chartHelper: this.chartHelper
            });
        }
        else {
            throw new Error('Not implemented and you are welcome to implement it :)');
        }
        if (this.options.tree_data.length > 0 && this.options.show_tools) {
            const uitool = new UITools({
                root_ui_element: this.rootWrapperContainer,
                zoomInOut: this.zoomInOut.bind(this),
                resetZoom: this.resetZoom.bind(this),
                animate_chat: this.currentChartUI?.animate_chat?.bind(this.currentChartUI)
            });
            uitool.tree_type = this.options.tree_type;
        }
    }
    bindPanning() {
        const root_cont_rect = this.rootWrapperContainer?.getBoundingClientRect();
        const zoomFilter = (event) => {
            event.preventDefault();
            return (!event.ctrlKey || event.type === 'wheel') && !event.button;
        };
        const root_container_el = this.hc_d3?.select('.hv-root-wrapper-element');
        const zoomed = ({ transform }) => {
            this.hcInnerContainer.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
            this.rootWrapperContainer.style.setProperty('--hc-root-container-cursor', 'grabbing');
            this.currentChartUI.current_scale = transform.k;
        };
        this.zoom_instace = this.hc_d3.zoom()
            .filter(zoomFilter)
            .extent([[0, 0], [root_cont_rect.width, root_cont_rect.height]])
            .on("zoom", zoomed)
            .on('end', (e) => {
            this.rootWrapperContainer.style.setProperty('--hc-root-container-cursor', 'grab');
        });
        root_container_el.call(this.zoom_instace).on("dblclick.zoom", (e) => null);
    }
    center_elem(rect, position = 'center') {
        const root_container_el = this.hc_d3?.select('.hv-root-wrapper-element');
        this.tree_default_point_position == '' && (this.tree_default_point_position = position);
        const root_cont_rect = root_container_el.node()?.getBoundingClientRect();
        const inner_cont_rect = this.hcInnerContainer?.getBoundingClientRect();
        const rel_posX = ((rect.left - (inner_cont_rect.left)) / this.currentChartUI.current_scale);
        const rel_posY = ((rect.top - (inner_cont_rect.top)) / this.currentChartUI.current_scale);
        const offsetMoveX = (root_cont_rect.width / 2) - ((rect.width / 2) / this.currentChartUI.current_scale);
        const offsetMoveY = (root_cont_rect.height / 2) - (rect.height / 2) / this.currentChartUI.current_scale;
        let moveX = 0;
        let moveY = 0;
        if (position == 'center') {
            moveX = rel_posX - offsetMoveX;
            moveY = rel_posY - offsetMoveY;
        }
        else if (position == 'top') {
            moveX = rel_posX - offsetMoveX;
            moveY = rel_posY - 10;
        }
        else if (position == 'bottom') {
            moveX = rel_posX - offsetMoveX;
            const el_chunk_sizes_y = (root_cont_rect.height / 2) - (rect.height / 2);
            moveY = (rel_posY - (offsetMoveY + el_chunk_sizes_y)) + 10;
        }
        else if (position == 'left') {
            moveX = rel_posX - 10;
            moveY = rel_posY - offsetMoveY;
        }
        else if (position == 'right') {
            const el_chunk_sizes_x = (root_cont_rect.width / 2) - (rect.width / 2);
            moveX = (rel_posX - (offsetMoveX + el_chunk_sizes_x)) + 10;
            moveY = rel_posY - offsetMoveY;
        }
        root_container_el.transition().duration(2500).call(this.zoom_instace?.transform, this.hc_d3?.zoomIdentity.translate(-moveX, -moveY));
    }
}
export default SpiderTree;
