import Ball from "./Ball.js"
import Paddle from "./Paddle.js"

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

// Track the current input mode
let isTouchDevice = false

let lastTime
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
    computerPaddle.update(delta, ball.y)
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    )

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

    if (isLose()) handleLose()
  }

  lastTime = time
  window.requestAnimationFrame(update)
}

function isLose() {
  const rect = ball.rect()
  return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLose() {
  const rect = ball.rect()
  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
  }
  ball.reset()
  computerPaddle.reset()
}

// Handle touch movement
function handleTouchMove(e) {
  if (!isTouchDevice) return
  e.preventDefault()
  const touch = e.touches[0]
  playerPaddle.position = (touch.clientY / window.innerHeight) * 100
}

// Handle mouse movement
function handleMouseMove(e) {
  if (isTouchDevice) return
  playerPaddle.position = (e.y / window.innerHeight) * 100
}

// Detect touch capability and set up appropriate listeners
function initializeInputHandlers() {
  // Check if device supports touch
  isTouchDevice = ('ontouchstart' in window) || 
                  (navigator.maxTouchPoints > 0) || 
                  (navigator.msMaxTouchPoints > 0)

  if (isTouchDevice) {
    // Touch device setup
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchstart", handleTouchMove, { passive: false })
    document.addEventListener("touchend", e => e.preventDefault())
  }

  // Always add mouse listener for desktop devices
  document.addEventListener("mousemove", handleMouseMove)

  // Switch input mode if user changes input method
  document.addEventListener("touchstart", () => {
    isTouchDevice = true
  }, { once: false })

  document.addEventListener("mousemove", () => {
    if (!event.sourceCapabilities?.firesTouchEvents) {
      isTouchDevice = false
    }
  }, { once: false })
}

// Initialize the game
initializeInputHandlers()
window.requestAnimationFrame(update)