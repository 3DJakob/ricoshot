class Game {
  constructor ({ keyboard }) {
    this.keyboard = keyboard

    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')

    this.entities = []

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
      entity.draw(this.ctx)
    }

    this.ctx.restore()
  }
}

module.exports = Game
