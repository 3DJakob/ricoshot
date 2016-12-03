(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Game {
  constructor ({ keyboard }) {
    this.keyboard = keyboard

    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')

    this.entities = []

    this.canvas.addEventListener('mousemove', ev => {
      this.mouseX = (ev.clientX - this.canvas.offsetLeft) / this.scale
      this.mouseY = (ev.clientY - this.canvas.offsetTop) / this.scale
    })

    window.addEventListener('resize', () => this.resize())
    this.resize()
  }

  resize () {
    if (window.innerWidth > 1600 && window.innerHeight - 150 > 900) {
      this.scale = 1
    } else {
      this.scale = 0.5
    }

    this.canvas.width = 1600 * this.scale
    this.canvas.height = 900 * this.scale
  }

  addEntity (entity) {
    this.entities.push(entity)
  }

  startGameLoop () {
    let lastTime = null

    const gameLoop = (currentTime) => {
      if (lastTime !== null) {
        this.step(currentTime - lastTime)
      }

      this.draw()

      lastTime = currentTime
      window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
  }

  step (dt) {
    for (const entity of this.entities) {
      entity.step(dt, { keyboard: this.keyboard })
    }
  }

  draw () {
    this.ctx.save()

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.scale(this.scale, this.scale)

    for (const entity of this.entities) {
      entity.draw(this, this.ctx)
    }

    this.ctx.restore()
  }
}

module.exports = Game

},{}],2:[function(require,module,exports){
const Keyboard = require('./keyboard')
const Player = require('./player')
const Game = require('./game')

const keyboard = new Keyboard()
const game = new Game({ keyboard })

const player = new Player(game.canvas.width / 2 / game.scale, game.canvas.height / 2 / game.scale)

player.load()
  .then(() => {
    game.addEntity(player)
    game.startGameLoop()
  })
  .catch(err => {
    console.error(err)
  })

},{"./game":1,"./keyboard":3,"./player":4}],3:[function(require,module,exports){
class Keyboard {
  constructor () {
    this.pressedButtons = new Set()

    window.addEventListener('keydown', ev => {
      this.pressedButtons.add(ev.keyCode)
    })

    window.addEventListener('keyup', ev => {
      this.pressedButtons.delete(ev.keyCode)
    })
  }

  isPressed (key) {
    return this.pressedButtons.has(key)
  }
}

Keyboard.LEFT = 37
Keyboard.UP = 38
Keyboard.RIGHT = 39
Keyboard.DOWN = 40

Keyboard.A = 65
Keyboard.D = 68
Keyboard.S = 83
Keyboard.W = 87

module.exports = Keyboard

},{}],4:[function(require,module,exports){
const { W, S, D, A } = require('./keyboard')
const { Image } = window

const playerImage = new Promise(resolve => {
  const img = new Image()

  img.onload = () => resolve(img)
  img.src = 'assets/graphics/player.png'
})

const ACCELERATION = 0.5 / 1000 // 0.5 pixels per second^2
const MAX_SPEED = 200 / 1000 // 200 pixels per second
const DIAGONAL_SPEED = Math.sqrt(Math.pow(MAX_SPEED, 2) / 2)

function acceleration (current, target, acceleration, dt) {
  if (target < 0) {
    if (current > target) {
      return current - acceleration * dt
    }
    return target
  } else if (target > 0) {
    if (current < target) {
      return current + acceleration * dt
    }
    return target
  } else {
    if (current > 0) {
      if (acceleration * dt < current) {
        return 0
      } else {
        return current - acceleration * dt
      }
    } else if (current < 0) {
      if (acceleration * dt < current) {
        return 0
      } else {
        return current + acceleration * dt
      }
    } else {
      return 0
    }
  }
}

class Player {
  constructor (x, y) {
    this.x = x
    this.y = y

    this.dx = 0
    this.dy = 0
  }

  load () {
    return playerImage.then(img => {
      this.img = img

      this.anchorX = img.width / 2
      this.anchorY = img.height / 2
    })
  }

  step (dt, { keyboard }) {
    if (keyboard.isPressed(D) && keyboard.isPressed(A) && keyboard.isPressed(S) && keyboard.isPressed(W) || !keyboard.isPressed(D) && !keyboard.isPressed(A) && !keyboard.isPressed(S) && !keyboard.isPressed(W)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (!keyboard.isPressed(D) && !keyboard.isPressed(A) && keyboard.isPressed(W) && !keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, -MAX_SPEED, ACCELERATION, dt)
    } if (keyboard.isPressed(D) && !keyboard.isPressed(A) && keyboard.isPressed(W) && !keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, -DIAGONAL_SPEED, ACCELERATION, dt)
    } if (keyboard.isPressed(D) && !keyboard.isPressed(A) && !keyboard.isPressed(W) && !keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, MAX_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (keyboard.isPressed(D) && !keyboard.isPressed(A) && !keyboard.isPressed(W) && keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, DIAGONAL_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(D) && !keyboard.isPressed(A) && !keyboard.isPressed(W) && keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, MAX_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(D) && keyboard.isPressed(A) && !keyboard.isPressed(W) && keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, -DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, DIAGONAL_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(D) && keyboard.isPressed(A) && !keyboard.isPressed(W) && !keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, -MAX_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (!keyboard.isPressed(D) && keyboard.isPressed(A) && keyboard.isPressed(W) && !keyboard.isPressed(S)) {
      this.dx = acceleration(this.dx, -DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, -DIAGONAL_SPEED, ACCELERATION, dt)
    }

    this.x += this.dx * dt
    this.y += this.dy * dt
  }

  draw (game, ctx) {
    const { mouseX, mouseY } = game

    ctx.save()

    ctx.translate(this.x, this.y)
    ctx.translate(-this.anchorX, -this.anchorY)

    ctx.drawImage(this.img, 0, 0)

    ctx.restore()
    ctx.save()

    // Crossair
    ctx.beginPath()
    ctx.moveTo(mouseX + 0.5, mouseY - 20 + 0.5)
    ctx.lineTo(mouseX + 0.5, mouseY + 20 + 0.5)
    ctx.moveTo(mouseX - 20 + 0.5, mouseY + 0.5)
    ctx.lineTo(mouseX + 20 + 0.5, mouseY + 0.5)
    ctx.stroke()

    //  Projectory
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(mouseX, mouseY)
    ctx.setLineDash([10, 100])
    ctx.stroke()

    ctx.restore()
  }
}

module.exports = Player

},{"./keyboard":3}]},{},[2]);
