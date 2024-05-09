class HCElement extends HTMLDivElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log("connectedCallback in custom element called");
    }
}
window.customElements.define('hc-element', HCElement, { extends: 'div' });
export default HCElement;
