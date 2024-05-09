import HCRootContainer from "../utils/st-root-container.js";
import RandomDataGenerator from "../helpers/randomDataGenerator.js";
import ChartMainHelper from "../helpers/chart-helper.js";
import VerticalSpider from "../trees/vSpider.tree.js";
class SpiderTree extends EventTarget {
    /**
     * The library name
     */
    libraryName = "SpiderTree";
    hc_d3 = null;
    main_svg = null;
    curves = ['curveMonotoneY', 'curveMonotoneX', 'curveNatural', 'curveStep'];
    current_move_x = 0;
    last_client_x = 0;
    current_move_y = 0;
    last_client_y = 0;
    current_scale = 1;
    current_scale_offsetX = 0;
    current_scale_offsetY = 0;
    zoom_factor = 0.05;
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
    random_data = [];
    targetRootContainer = null;
    rootWrapperContainer = null;
    hcInnerContainer = null;
    rootCanvasEl = null;
    // protected head_wrapper: HTMLElement | null = null;
    chartHelper = new ChartMainHelper();
    currentChartUI;
    /**
     * SpiderTree options
     */
    options = {
        targetContainer: '',
        placeEl: 'override',
        tree_data: [],
    };
    constructor(options) {
        super();
        if (options.targetContainer == undefined) {
            throw new Error(this.libraryName + ": The target container is required");
        }
        const randData = new RandomDataGenerator({ length: 100 });
        this.random_data = randData.generated_data;
        this.options.tree_data = randData.generated_data;
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
        script.src = "https://d3js.org/d3.v4.min.js";
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
        this.placeRootContainer();
    }
    placeRootContainer() {
        this.rootWrapperContainer = new HCRootContainer();
        this.hcInnerContainer = this.chartHelper.createDynamicEl();
        this.hcInnerContainer.className = "hc-inner-container";
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
        // this.currentChartUI = new DefaultTree({
        //     tree_data: this.options.tree_data,
        //     hcInnerContainer: this.hcInnerContainer
        // });
        this.currentChartUI = new VerticalSpider({
            tree_data: this.options.tree_data,
            hcInnerContainer: this.hcInnerContainer
        });
    }
    bindPanning() {
        this.rootWrapperContainer.onmousedown = (e) => {
            e.preventDefault();
            this.last_client_x = e.clientX;
            this.last_client_y = e.clientY;
            this.rootWrapperContainer.onmousemove = (e) => this.handleMouseMove(e);
        };
        this.rootWrapperContainer.onmouseleave = (e) => {
            this.rootWrapperContainer.onmousemove = () => null;
            this.rootWrapperContainer.style.setProperty('--hc-root-container-cursor', 'default');
        };
        this.rootWrapperContainer.onmouseup = (e) => {
            this.rootWrapperContainer.onmousemove = () => null;
            this.rootWrapperContainer.style.setProperty('--hc-root-container-cursor', 'default');
        };
        this.rootWrapperContainer.onwheel = (e) => {
            e.preventDefault();
            if (this.current_scale < 0.5) {
                this.current_scale = 0.5;
            }
            else if (this.current_scale > 3) {
                this.current_scale = 3;
            }
            const delta = -e.deltaY / 100; // Adjust sensitivity as needed
            const newScale = Math.max(0.5, this.current_scale + delta); // Limit zoom range
            const rect = this.hcInnerContainer.getBoundingClientRect();
            console.log("current_scale_offset rect", rect);
            this.rootWrapperContainer?.style.setProperty('--zoom-level', newScale.toString());
            this.current_scale = newScale;
            this.currentChartUI.current_scale = this.current_scale;
            // last_scale_offset_X = e.layerX;
            // last_scale_offset_Y = e.layerY;
        };
    }
    handleMouseMove(e) {
        e.preventDefault();
        this.rootWrapperContainer.style.setProperty('--hc-root-container-cursor', 'grab');
        this.current_move_x += e.clientX - this.last_client_x;
        this.current_move_y += e.clientY - this.last_client_y;
        this.rootWrapperContainer?.style.setProperty('--move-x', this.current_move_x + "px");
        this.rootWrapperContainer?.style.setProperty('--move-y', this.current_move_y + "px");
        this.last_client_x = e.clientX;
        this.last_client_y = e.clientY;
    }
}
export default SpiderTree;
