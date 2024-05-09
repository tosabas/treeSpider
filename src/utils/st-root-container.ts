
class HCRootContainer extends HTMLDivElement {
    hc_d3 = window.d3
    main_svg: any = null
    tree_data: any = {}
    static observeAttributes = ['size']

    constructor () {
        super();
        this.setCanvasBg();
    }

    

    connectedCallback () {
        this.className = "hv-root-wrapper-element";
    }

    attributeChangedCallback(name:string, oldValue:any, newValue:any) {
        console.log(
          `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
        );
      }

    setCanvasBg () {
        const svgPattern = this.hc_d3.create('svg')
            .attr("width", "20")
            .attr("height", "20");

        svgPattern.append('rect')
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", "white");

        svgPattern.append('circle')
            .attr("cx", "10")
            .attr("cy", "10")
            .attr("r", "1")
            .attr("fill", "black");

        // Convert the SVG pattern to a data URL
        const svgData = new XMLSerializer().serializeToString(svgPattern.node() as Node);
        const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

        // // Set the SVG pattern as the canvas background
        this.style.setProperty('--hc-root-el-bg-image', "url(" + svgDataUrl + ")");
    }
}

window.customElements.define("hc-root-container", HCRootContainer, {extends: 'div'});
export default HCRootContainer;