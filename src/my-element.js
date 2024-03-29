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
    this.rows = 5
    this.cols = 8
    this.board = Array.from({length: this.rows}, () => Array(this.cols).fill(EMPTY))
    this.speed = 500
    this.lastTime = 0;
    this.timeCounter = 0;
    this.score = 0
    //this.hitSound = './assets/hit.wav'
    //this.lineSound = './assets/line.wav'
    this.level = 1
    this.currentPiece = this.generatePiece()
    this.gameInterval = null
    this.isGameOver = false
  }

  connectedCallback() {
    super.connectedCallback();
    this.gameInterval = setInterval(() => {
      this.gameLoop()
      this.requestUpdate();
    }, this.speed);
    document.addEventListener('keydown' || 'click', (event) => { this.handleKeyDown(event) });
    document.addEventListener('keyup', (event) => { this.handleKeyUp(event) });
  }
 
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.gameInterval);
    document.removeEventListener('keydown' || 'click', (event) => { this.handleKeyDown(event) });
    document.removeEventListener('keyup', (event) => { this.handleKeyUp(event) });
  }

  handleKeyDown = (event) => {
    event.stopPropagation();
    const keyCode = event.key;
    switch (keyCode) {
      case 'ArrowUp':
        this.rotate()
        break;
      case 'ArrowLeft':
        this.move(-1)
        break;
      case 'ArrowRight':
        this.move(1)
        break;
      case 'ArrowDown':
        this.timeTemporaryIncrement(50)
        break;
      default:
        break;
    }
  };

  handleKeyUp = (event) => {
    const keyCode = event.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keyCode)) {
        if (keyCode === 'ArrowDown') this.timeTemporaryIncrement(this.speed);
        console.log(`${keyCode} released`);
      }
  }

  firstUpdated() {
    super.firstUpdated();
   
    this.canvas = this.shadowRoot.querySelector("#tetris-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.setupGame();
  }

  setupGame() {
    this.canvas.width = this.cols * this.blockSize
    this.canvas.height = this.rows * this.blockSize
  }

  generatePiece() {
    const ramdonPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const piece = {
      shape: ramdonPiece.shape,
      color: ramdonPiece.color,
      x: Math.floor(this.cols / 2) - Math.floor(ramdonPiece.shape[0].length / 2),
      y: 0,
    }

    if (this.isCollision(piece)) {
      clearInterval(this.gameInterval);
      this.isGameOver = true;
      alert("GAME OVER Man! \n" + this.score)
    }

    return piece
  }

  drawBoard() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.drawBlock(col, row, this.board[row][col])
      }
    }
  }

  drawPiece() {
    this.currentPiece.shape.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value !== EMPTY) {
          this.drawBlock(this.currentPiece.x + j, this.currentPiece.y + i, this.currentPiece.color);
        }
      })
    })
  }

  drawBlock(x, y, color) {
    this.ctx.fillStyle = COLORS[color];
    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize)
    this.ctx.strokeStyle = "#333"
    this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize)
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard()
    this.drawPiece()
  }

  updateFrame() {
    this.currentPiece.y++;
    if(this.isCollision(this.currentPiece)) {
      this.currentPiece.y--;
      this.solidifyPiece();
      this.checkLines();
      this.currentPiece = this.generatePiece();
      this.requestUpdate();
    }
  }

  gameLoop() {
    this.updateFrame()
    this.draw()
  }

  handleReset() {
    this.isGameOver = false;
    this.score = 0;
    this.level = 1;
    this.board = Array.from({length: this.rows}, () => Array(this.cols).fill(EMPTY));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    clearInterval(this.gameInterval, this.speed);
    this.gameInterval = setInterval(() => {
      this.gameLoop();
      this.requestUpdate();
    }, this.speed); 
  }

  timeTemporaryIncrement(tempSpeed) {
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.gameLoop();
      this.requestUpdate();
    }, tempSpeed)
  }

  isCollision(piece) {
    return piece.shape.some(
      (row, i) =>
        row.some(
          (value, j) =>
            value !== EMPTY && (this.board[piece.y + i] && this.board[piece.y +i][piece.x + j]) !== EMPTY
      )
    )
  }

  rotate() {
    const rotatedPiece = {
      shape: this.currentPiece.shape[0].map((_, i) => this.currentPiece.shape.map(row => row[i])).reverse(),
      color: this.currentPiece.color,
      x: this.currentPiece.x,
      y: this.currentPiece.y,
    }

    if (!this.isCollision(rotatedPiece)) {
      this.currentPiece.shape = rotatedPiece.shape
    }
  }

  solidifyPiece() {
    this.currentPiece.shape.forEach((row, i) => {
    row.forEach((value, j) => {
        if (value !== EMPTY) {
        this.board[this.currentPiece.y + i][this.currentPiece.x + j] = this.currentPiece.color;
        }
    });
    });
    //this.soundPlayer(this.hitSound);
  }

  move(direction) {
    this.currentPiece.x += direction;
    this.isCollision(this.currentPiece) ? this.currentPiece.x -= direction : 0
  }

  updateScoreAndLevel() {
    if (this.score >= this.level * 500) {
    this.level++;
    this.speed -= 50; // decrease speed
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(this.gameLoop, this.speed);
    }
  }

  checkLines() {
    let linesToRemove = [];
    for (let i = this.rows - 1; i >= 0; i--) {
    if (this.board[i].every(block => block !== EMPTY)) {
        linesToRemove.push(i);
        this.score += 100;
    }
    }

    linesToRemove.forEach(line => {
    this.board.splice(line, 1);
    this.board.unshift(Array(this.cols).fill(EMPTY));
    });

    if (linesToRemove.length > 0) {
    this.updateScoreAndLevel();
    //soundPlayer(this.lineSound);
    }
  }

  render() {
    return html`
    <div>
        <h1>${this.headerText}</h1>
        <div>Score: ${this.score}</div>
        <canvas id="tetris-canvas"></canvas>
        <div>Level ${this.level}</div>
        ${this.isGameOver 
          ? html`<button @click="${this.handleReset}">Reset Game</button>` 
          : ``}
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
