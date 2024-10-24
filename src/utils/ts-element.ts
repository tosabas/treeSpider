class TSElement extends HTMLDivElement {
    constructor () {
        super();
    }

    connectedCallback () {}
}

window.customElements.define('ts-element', TSElement, {extends: 'div'})

export default TSElement;