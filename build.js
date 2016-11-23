(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
require('./window')
require('./game')

},{"./game":1,"./window":3}],3:[function(require,module,exports){
var gameCanvas = document.getElementById('gameCanvas')
var windowWidth = window.innerWidth
var margin = 40
var aspectRatio = 9 / 16
gameCanvas.width = windowWidth - margin
gameCanvas.height = (windowWidth - margin) * aspectRatio

},{}]},{},[2]);
