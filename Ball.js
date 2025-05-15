const INITIAL_VELOCITY = 0.015
const VELOCITY_INCREASE = 0.000002

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem
    this.reset()
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value)
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value)
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    // Center horizontally
    this.x = 50
    // Start at 40% from the top of the game area
    this.y = 40
    this.direction = { x: 0 }
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI)
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta

    // Increase velocity but cap it at a maximum value
    this.velocity = Math.min(this.velocity + VELOCITY_INCREASE * delta, 0.03)

    const rect = this.rect()
    const gameContainer = document.querySelector('.game-container').getBoundingClientRect()

    if (rect.right >= gameContainer.right || rect.left <= gameContainer.left) {
      this.direction.x *= -1
    }

    if (paddleRects.some(r => isCollision(r, rect))) {
      this.direction.y *= -1
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  )
}