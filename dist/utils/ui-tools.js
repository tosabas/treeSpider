import icons from "./icons.js";
import HCElement from "./st-element.js";
class UITools {
    root_ui_element = undefined;
    zoomInOut = () => null;
    resetZoom = () => null;
    animate_chat = () => null;
    tree_type = undefined;
    animatable_trees = ['goldenRod', 'radialSpiderLeg'];
    constructor({ root_ui_element, zoomInOut, resetZoom, animate_chat }) {
        this.root_ui_element = root_ui_element;
        this.zoomInOut = zoomInOut;
        this.resetZoom = resetZoom;
        this.animate_chat = animate_chat;
        setTimeout(() => {
            this.make_tools();
        }, 0);
    }
    make_tools() {
        const toolWrapperEl = new HCElement();
        toolWrapperEl.className = "tools-container";
        this.root_ui_element?.appendChild(toolWrapperEl);
        const zoomInIcon = document.createElement('div');
        zoomInIcon.className = "tool-item";
        zoomInIcon.innerHTML = icons.zoomIn;
        zoomInIcon.title = "Zoom in";
        zoomInIcon.onclick = (e) => this.zoomInOut();
        const zoomOutIcon = document.createElement('div');
        zoomOutIcon.className = "tool-item";
        zoomOutIcon.innerHTML = icons.zoomOut;
        zoomOutIcon.title = "Zoom out";
        zoomOutIcon.onclick = (e) => this.zoomInOut('out');
        const zoomResetIcon = document.createElement('div');
        zoomResetIcon.className = "tool-item";
        zoomResetIcon.innerHTML = icons.resetZoom;
        zoomResetIcon.title = "Reset zoom & position";
        zoomResetIcon.onclick = (e) => this.resetZoom();
        const rotateIcon = document.createElement('div');
        rotateIcon.className = "tool-item";
        rotateIcon.innerHTML = icons.rotate;
        rotateIcon.title = "Start/Stop Clockwise Rotation";
        const rotateAnticlockwiseIcon = document.createElement('div');
        rotateAnticlockwiseIcon.className = "tool-item";
        rotateAnticlockwiseIcon.innerHTML = icons.rotate_anticlockwise;
        rotateAnticlockwiseIcon.title = "Start/Stop Anticlockwise Rotation";
        const rotateOnceIcon = document.createElement('div');
        rotateOnceIcon.className = "tool-item";
        rotateOnceIcon.innerHTML = icons.rotate_once;
        rotateOnceIcon.title = "Rotate Clockwise Once";
        const rotateOnceAnticlockwiseIcon = document.createElement('div');
        rotateOnceAnticlockwiseIcon.className = "tool-item";
        rotateOnceAnticlockwiseIcon.innerHTML = icons.rotate_once_anti_clockwise;
        rotateOnceAnticlockwiseIcon.title = "Rotate Anticlockwise Once";
        toolWrapperEl.append(zoomInIcon);
        toolWrapperEl.append(zoomOutIcon);
        toolWrapperEl.append(zoomResetIcon);
        console.log("this.tree_type", this.tree_type);
        if (this.animatable_trees.includes(this.tree_type)) {
            toolWrapperEl.append(rotateIcon);
            toolWrapperEl.append(rotateAnticlockwiseIcon);
            toolWrapperEl.append(rotateOnceIcon);
            toolWrapperEl.append(rotateOnceAnticlockwiseIcon);
            rotateIcon.onclick = (e) => this.animate_chat();
            rotateAnticlockwiseIcon.onclick = (e) => this.animate_chat(false, true);
            rotateOnceIcon.onclick = (e) => this.animate_chat(true);
            rotateOnceAnticlockwiseIcon.onclick = (e) => this.animate_chat(true, true);
        }
    }
}
export default UITools;
