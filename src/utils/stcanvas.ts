class HCCanvas extends HTMLCanvasElement {
    context: CanvasRenderingContext2D | null = null;

    constructor() {
        super();
    }

    connectedCallback () {
        this.className = "hv-canvas";
        this.setCanvasBg()
    }

    setCanvasBg () {
        const svgPattern = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgPattern.setAttribute("width", "20");
        svgPattern.setAttribute("height", "20");

        const patternRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        patternRect.setAttribute("width", "20");
        patternRect.setAttribute("height", "20");
        patternRect.setAttribute("fill", "white");

        const patternCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        patternCircle.setAttribute("cx", "10");
        patternCircle.setAttribute("cy", "10");
        patternCircle.setAttribute("r", "1");
        patternCircle.setAttribute("fill", "black");

        svgPattern.appendChild(patternRect);
        svgPattern.appendChild(patternCircle);

        // Convert the SVG pattern to a data URL
        const svgData = new XMLSerializer().serializeToString(svgPattern);
        const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

        // Set the SVG pattern as the canvas background
        document.documentElement.style.setProperty('--canvas-bg-image', "url(" + svgDataUrl + ")");
    }
}
customElements.define("hc-canvas", HCCanvas, {extends: 'canvas'});
export default HCCanvas;