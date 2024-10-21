const SPEED = 0.02
const TOUCH_SENSITIVITY = 0.5 // Adjust this value to change touch sensitivity

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem
    this.reset()
    this.bindEvents()
    this.isTouching = false
    this.lastTouchY = 0
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    )
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value)
  }

  rect() {
    return this.paddleElem.getBoundingClientRect()
  }

  reset() {
    this.position = 50
  }

  update(delta, ballHeight) {
    if (!this.isTouching) {
      this.position += SPEED * delta * (ballHeight - this.position)
    }
  }

  bindEvents() {
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this))
    this.paddleElem.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.paddleElem.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.paddleElem.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleOrientation(event) {
    if (event.gamma) {
      // Convert the rotation to a percentage (assuming 90 degree rotation is full movement)
      const newPosition = ((event.gamma + 90) / 180) * 100
      this.position = Math.max(0, Math.min(100, newPosition))
    }
  }

  handleTouchStart(event) {
    this.isTouching = true
    this.lastTouchY = event.touches[0].clientY
  }

  handleTouchMove(event) {
    if (!this.isTouching) return

    const touch = event.touches[0]
    const deltaY = touch.clientY - this.lastTouchY
    this.lastTouchY = touch.clientY

    // Update position based on touch movement
    this.position += (deltaY / window.innerHeight) * 100 * TOUCH_SENSITIVITY
    this.position = Math.max(0, Math.min(100, this.position))
  }

  handleTouchEnd() {
    this.isTouching = false
  }
}