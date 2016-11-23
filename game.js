var canvas = document.getElementById('gameCanvas')
var ctx = canvas.getContext('2d')

var canvasX
var canvasY

// Player variables
var playerReady = false
var playerImage = new Image()
playerImage.onload = function () { playerReady = true }
playerImage.src = 'assets/graphics/player.png'
var playerX = canvasX / 2
var playerY = canvasY / 2
var playerDX
var playerDY

//  Player draw
function drawPlayer () {
  if (playerReady) {
    ctx.drawImage(playerImage, playerX, playerY)
  }
}

// Text draw
function drawHello () {
  ctx.textAlign = 'center'
  ctx.font = '16px sans-serif'
  ctx.fillText('Size: ' + canvas.width, canvasX / 4, 23)
  ctx.fillText('X: ' + playerX, canvasX / 2, 23)
  ctx.fillText('Y: ' + playerY, canvasX * 3 / 4, 23)
  // ctx.fillText('canvasX: ' + canvasX, canvasX * 3 / 4, 23)
}

// Draw
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawHello()
  drawPlayer()
}

// Game loop
function gameLoop (currentTime) {
  draw()
  canvasX = canvas.width
  canvasY = canvas.height
  if (isNaN(playerX)) {
    playerX = canvasX / 2
  }
  if (isNaN(playerY)) {
    playerY = canvasY / 2
  }
  window.requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop)

window.addEventListener('resize', () => {

})
