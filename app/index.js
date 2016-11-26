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
