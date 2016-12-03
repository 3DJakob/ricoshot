const { UP, DOWN, RIGHT, LEFT } = require('./keyboard')
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
    if (keyboard.isPressed(RIGHT) && keyboard.isPressed(LEFT) && keyboard.isPressed(DOWN) && keyboard.isPressed(UP) || !keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && !keyboard.isPressed(DOWN) && !keyboard.isPressed(UP)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (!keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && keyboard.isPressed(UP) && !keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, -MAX_SPEED, ACCELERATION, dt)
    } if (keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && keyboard.isPressed(UP) && !keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, -DIAGONAL_SPEED, ACCELERATION, dt)
    } if (keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && !keyboard.isPressed(UP) && !keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, MAX_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && !keyboard.isPressed(UP) && keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, DIAGONAL_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(RIGHT) && !keyboard.isPressed(LEFT) && !keyboard.isPressed(UP) && keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, 0, ACCELERATION, dt)
      this.dy = acceleration(this.dy, MAX_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(RIGHT) && keyboard.isPressed(LEFT) && !keyboard.isPressed(UP) && keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, -DIAGONAL_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, DIAGONAL_SPEED, ACCELERATION, dt)
    } if (!keyboard.isPressed(RIGHT) && keyboard.isPressed(LEFT) && !keyboard.isPressed(UP) && !keyboard.isPressed(DOWN)) {
      this.dx = acceleration(this.dx, -MAX_SPEED, ACCELERATION, dt)
      this.dy = acceleration(this.dy, 0, ACCELERATION, dt)
    } if (!keyboard.isPressed(RIGHT) && keyboard.isPressed(LEFT) && keyboard.isPressed(UP) && !keyboard.isPressed(DOWN)) {
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
