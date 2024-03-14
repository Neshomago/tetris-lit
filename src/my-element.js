import { LitElement, css, html } from 'lit'
import { pieces, EMPTY, COLORS } from './utils'

/**
 * An Tetris example Lit element.
 *
 */
export class MyElement extends LitElement {
  static get properties() {
    return {
      headerText: { type: String },
      footerText: { type: String },
      blockSize: { type: Number },
      canvas: { type: Object},
      ctx: { type: Object },
      rows: { type:Number },
      cols: { type:Number },
      speed: { type: Number },
      score: { type: Number },
      hitSound: { type: String },
      lineSound: { type: String },
      level: { type: Number },
    }
  }

  constructor() {
    super()
    this.headerText= ''
    this.footerText = ''
    this.canvas = {}
    this.ctx = {}
    this.blockSize = 20
    this.rows = 15
    this.cols = 8
    this.board = Array.from({length: this.rows}, () => Array(this.cols).fill(EMPTY))
    this.speed = 500
    this.lastTime = 0;
    this.timeCounter = 0;
    this.score = 0
    //this.hitSound = './assets/hit.wav'
    //this.lineSound = './assets/line.wav'
    this.level = 1
    this.currentPiece = ''
    this.gameInterval = null
  }

  render() {
    return html`
    <div>
        <h1>${this.headerText}</h1>
        <div>Score: ${this.score}</div>
        <canvas id="tetris-canvas"
        ></canvas>
        <div>Level ${this.level}</div>
    </div>
    <slot></slot>
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
