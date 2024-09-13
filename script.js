const pt = document.getElementById('obj')
const editkp = document.getElementById('kp')
const editki = document.getElementById('ki')
const editkd = document.getElementById('kd')
const showfps = document.getElementById('fps')
const editX = document.getElementById('x')
const editY = document.getElementById('y')

// state object
class Object {
  static redrawDelay = 1 // ms

  constructor(targetPos, kp, ki, kd) {
    this.x = 0
    this.y = 0
    
    this.target = targetPos
    this.kp = kp
    this.ki = ki
    this.kd = kd
  }

  draw() {
    pt.style.top = obj.y + 'px'
    pt.style.left = obj.x + 'px'
  }

  set pos(val) {
    this.x = val[0]
    this.y = val[1]
    this.draw()
  }

  loop() {
    let eiX = this.target[0]
    let elastX = this.target[0]
    let eiY = this.target[1]
    let elastY = this.target[1]

    const interval = setInterval(() => {
      if (Math.abs(this.target[0] - this.x) > 0.2 || Math.abs(this.target[1] - this.y) > 0.2) {

        // x-dim
        const errX = this.target[0] - this.x

        const epX = this.kp * errX
        eiX = eiX + this.ki * errX
        const edX = this.kd * (errX - elastX)

        this.x += epX + eiX + edX

        elastX = errX

        // y-dim
        const errY = this.target[1] - this.y

        const epY = this.kp * errY
        eiY = eiY + this.ki * errY
        const edY = this.kd * (errY - elastY)

        this.y += epY + eiY + edY

        elastY = errY

        this.draw()

      } else {
        eiX = eiY = this.target[0]
        elastX = elastY = this.target[1]
        clearInterval(interval)
      }
    }, this.redrawDelay)
  }
}
const obj = new Object([0, 0], 0.07, 0.02, 0.2)
obj.draw()

// hold & drag handler
pt.addEventListener('mousedown', (e) => {
  e.preventDefault()

  const mouseX = e.offsetX - e.target.offsetWidth/2
  const mouseY = e.offsetY - e.target.offsetHeight/2
  
  const dragController = new AbortController()

  window.addEventListener('mousemove', (e) => {
    const newX = e.clientX - window.innerWidth/2 - mouseX
    const newY = e.clientY - window.innerHeight/2 - mouseY

    obj.pos = [newX, newY]
  }, dragController)

  window.addEventListener('mouseup', (e) => {
    e.preventDefault()
    obj.loop()
  
    dragController.abort()
  }, dragController)
})

// ------- HUD elements -------

// display MAX fps, kp, ki, kd, targetPos values
showfps.innerHTML = Math.round(1000 / Object.redrawDelay)

editkp.value = obj.kp
editki.value = obj.ki
editkd.value = obj.kd
editX.value = obj.target[0]
editY.value = obj.target[1]

editkp.addEventListener('change', e => { obj.kp = e.target.value })
editki.addEventListener('change', e => { obj.ki = e.target.value })
editkd.addEventListener('change', e => { obj.kd = e.target.value })
editX.addEventListener('change', e => { obj.target[0] = Number(e.target.value); obj.loop(); })
editY.addEventListener('change', e => { obj.target[1] = Number(e.target.value); obj.loop(); })
