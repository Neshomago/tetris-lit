import { LitElement, css, html } from 'lit'
import { pieces, EMPTY, COLORS } from './utils'

/**
 * An Tetris example Lit element.
 *
 */
export class MyElement extends LitElement {
  static get properties() {
    return {
    }
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <>
    </>
    `
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }
    `
  }
}

window.customElements.define('my-element', MyElement)
