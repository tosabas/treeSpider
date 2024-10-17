import backgrounds from "./backgrounds.js";
class HCRootContainer extends HTMLDivElement {
    hc_d3 = window.d3;
    main_svg = null;
    tree_data = {};
    static observeAttributes = ['backgroundPattern', 'backgroundSize'];
    backgroundPattern = null;
    backgroundSize = undefined;
    constructor() {
        super();
    }
    connectedCallback() {
        this.className = "hv-root-wrapper-element tree-spider";
        this.backgroundPattern = this.getAttribute('backgroundPattern') || 'default';
        this.backgroundSize = this.getAttribute('backgroundSize');
        this.backgroundSize = this.backgroundSize == 'undefined' ? undefined : this.backgroundSize;
        this.setCanvasBg();
    }
    setCanvasBg() {
        const patterns = {
            default: () => this.defaultDotsPatternBg(),
            flux: () => this.fluxPatternBg(),
            quad: () => this.quadPatternBg(),
            blurry: () => this.blurryBg(),
            chaos: () => this.chaosPatternBg(),
            flurry: () => this.flurryPatternBg(),
            spiral: () => this.spiralPatternBg(),
            circling: () => this.circlingPatternBg(),
            replicate: () => this.replicatePatternBg(),
            scribble: () => this.scribblePatternBg(),
            squiggly: () => this.squigglyPatternBg(),
            gyrrate: () => this.gyrratePatternBg(),
            leaves: () => this.leavesPatternBg(),
            spot: () => this.spotPatternBg()
        };
        if (this.backgroundPattern == 'none')
            return;
        const svgPattern = patterns[this.backgroundPattern]();
        let svgData;
        if (typeof svgPattern == 'object') {
            svgData = new XMLSerializer().serializeToString(svgPattern.node());
        }
        else {
            svgData = svgPattern;
        }
        const encodeSVG = encodeURIComponent(svgData)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29');
        const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeSVG;
        this.style.setProperty('--hc-root-el-bg-image', 'url(' + svgDataUrl + ')');
    }
    defaultDotsPatternBg() {
        const svg = this.hc_d3.create('svg')
            .attr("width", "20")
            .attr("height", "20");
        svg.append('rect')
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", "white");
        svg.append('circle')
            .attr("cx", "10")
            .attr("cy", "10")
            .attr("r", "1")
            .attr("fill", "black");
        this.style.backgroundSize = this.backgroundSize || '2%';
        return svg;
    }
    fluxPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%';
        return backgrounds['flux'];
    }
    quadPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%';
        return backgrounds['quad'];
    }
    blurryBg() {
        this.style.backgroundSize = '20%';
        this.style.backgroundPosition = 'center';
        return backgrounds['blurry'];
    }
    chaosPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '50%';
        this.style.backgroundPosition = 'center';
        return backgrounds['chaos'];
    }
    spiralPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%';
        this.style.backgroundPosition = 'center';
        return backgrounds['spiral'];
    }
    flurryPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '30%';
        this.style.backgroundPosition = 'center';
        return backgrounds['flurry'];
    }
    circlingPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%';
        this.style.backgroundPosition = 'center';
        return backgrounds['circling'];
    }
    replicatePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%';
        this.style.backgroundPosition = 'center';
        return backgrounds['replicate'];
    }
    scribblePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '30%';
        this.style.backgroundPosition = 'center';
        return backgrounds['scribble'];
    }
    squigglyPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%';
        this.style.backgroundPosition = 'center';
        return backgrounds['squiggly'];
    }
    gyrratePatternBg() {
        this.style.backgroundSize = this.backgroundSize || '100%';
        this.style.backgroundPosition = 'center';
        return backgrounds['gyrate'];
    }
    leavesPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '40%';
        this.style.backgroundPosition = 'center';
        return backgrounds['leaves'];
    }
    reflectionPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '20%';
        this.style.backgroundPosition = 'center';
        return backgrounds['reflection'];
    }
    spotPatternBg() {
        this.style.backgroundSize = this.backgroundSize || '40%';
        this.style.backgroundPosition = 'center';
        return backgrounds['spot'];
    }
}
window.customElements.define("hc-root-container", HCRootContainer, { extends: 'div' });
export default HCRootContainer;
