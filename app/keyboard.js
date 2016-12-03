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
