var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.font = '20px sans-serif'
  ctx.fillText('Hello world!', 60, 23)
}

function gameLoop (currentTime) {
  draw()
  window.requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop)
