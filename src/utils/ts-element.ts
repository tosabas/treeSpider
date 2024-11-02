class TSElement extends HTMLElement implements HTMLDivElement {
    align: string = "auto"
    constructor () {
        super();
    }

    connectedCallback () {}
}

window.customElements.define('ts-element', TSElement)

export default TSElement;