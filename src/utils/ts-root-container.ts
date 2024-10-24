import { Selection } from "d3";
import backgrounds from "./backgrounds.js";

class TSRootContainer extends HTMLDivElement {
    ts_d3 = window.d3
    main_svg: any = null
    tree_data: any = {}
    static observeAttributes = ['backgroundPattern', 'backgroundSize', 'customBackground']
    private backgroundPattern: string | null = null
    private backgroundSize: string | null | undefined = undefined
    private customBackground: SVGSVGElement | string | null | undefined = undefined
    private backgroundPosition: string | undefined = 'center'

    constructor () {
        super();
    }

    connectedCallback () {
        this.className = "ts-root-wrapper-element tree-spider";
        this.backgroundPattern = this.getAttribute('backgroundPattern') || 'default'
        this.backgroundSize = this.getAttribute('backgroundSize')
        this.backgroundSize = this.backgroundSize == 'undefined' ? undefined : this.backgroundSize
        this.customBackground = this.getAttribute('customBackground')
        this.customBackground = this.customBackground == 'undefined' ? undefined : this.customBackground
        this.backgroundPosition = this.getAttribute('backgroundPosition') as string;
        this.backgroundPosition = this.backgroundPosition == 'undefined' ? undefined : this.backgroundPosition
        this.setCanvasBg();
    }

    setCanvasBg () {
        const patterns = {
            default: () => this.defaultDotsPatternBg(), 
            flux: () => this.fluxPatternBg(), 
            quad: () => this.quadPatternBg(), 
            blurry: () => this.blurryBg(), 
            chaos: () => this.chaosPatternBg(), 
            flurry: () => this.flurryPatternBg(), 
            spiral: () => this.spiralPatternBg(), 
            whirling: () => this.whirlingPatternBg(), 
            replicate: () => this.replicatePatternBg(), 
            scribble: () => this.scribblePatternBg(), 
            squiggly: () => this.squigglyPatternBg(), 
            gyrrate: () => this.gyrratePatternBg(), 
            leaves: () => this.leavesPatternBg(), 
            spot: () => this.spotPatternBg()
        }

        if (this.backgroundPattern == 'none') return;
        
        const svgPattern = this.customBackground || patterns[this.backgroundPattern as keyof typeof patterns]()

        let svgData;
        if (typeof svgPattern == 'object') {
            svgData = new XMLSerializer().serializeToString((svgPattern as Selection<SVGSVGElement, undefined, null, undefined>).node() as Node);
        }else{
            svgData = svgPattern;
        }

        const encodeSVG = encodeURIComponent(svgData)
        .replace(/\(/g, '%28')  
        .replace(/\)/g, '%29')  

        this.backgroundSize != undefined && (this.style.backgroundSize = this.backgroundSize || '40%');
        this.backgroundPosition != undefined && (this.style.backgroundPosition = this.backgroundPosition || 'center');
        
        const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeSVG;
        this.style.setProperty('--ts-root-el-bg-image', 'url(' + svgDataUrl + ')');
    }

    defaultDotsPatternBg () {
        const svg =  this.ts_d3.create('svg')
            .attr("width", "20")
            .attr("height", "20");
            
        svg.append('rect')
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", "transparent");

        svg.append('circle')
            .attr("cx", "10")
            .attr("cy", "10")
            .attr("r", "1")
            .attr("fill", "rgb(150,150,150)");

        this.style.backgroundSize = this.backgroundSize || '2%'
        return svg
    }

    fluxPatternBg () {
        this.style.backgroundSize = this.backgroundSize || '20%'
        return backgrounds['flux']
    }

    quadPatternBg () {
        this.style.backgroundSize = this.backgroundSize || '20%'
        return backgrounds['quad']
    }

    blurryBg () {
        this.style.backgroundSize = '20%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['blurry']
    }

    chaosPatternBg () {
        this.style.backgroundSize = this.backgroundSize || '50%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['chaos']
    }

    spiralPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['spiral']
    }

    flurryPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '30%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['flurry']
    }

    whirlingPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['whirling']
    }

    replicatePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['replicate']
    }

    scribblePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '30%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['scribble']
    }

    squigglyPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['squiggly']
    }

    gyrratePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['gyrate']
    }

    leavesPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '40%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['leaves']
    }

    reflectionPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['reflection']
    }

    spotPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '40%'
        this.style.backgroundPosition = this.backgroundPosition || 'center'
        return backgrounds['spot']
    }

}

window.customElements.define("ts-root-container", TSRootContainer, {extends: 'div'});
export default TSRootContainer;