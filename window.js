var gameCanvas = document.getElementById('gameCanvas')
var windowWidth = window.innerWidth
var margin = 40
var aspectRatio = 9 / 16
gameCanvas.width = windowWidth - margin
gameCanvas.height = (windowWidth - margin) * aspectRatio
