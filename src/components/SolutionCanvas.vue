<script setup>
import GameButton from './GameButton.vue'
</script>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      from: -1,
      to: -1,
      numberOfPoints: 0,
      lastCalculationTime: 0,
      lineDistance: 18, //how close the drawn line should be to the point
      multiplicity: 1, //based on game difficulty, used in algorithms
      isDrawing: false,
      c: null, //canvas element from template/html
      canvas: null, //c.getContext('2d')
      difficulty: '',
      points: [],
      lines: [],
      isTouchDevice: false
    }
  },
  methods: {
    drawLine(x1, y1, x2, y2, color) {
      let ctx = this.canvas
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.closePath()
    },
    beginDrawing(e) {
      e.preventDefault()

      //Touchscreen or Mouse
      if (this.isTouchDevice) {
        this.x = e.touches[0].pageX - e.touches[0].target.offsetLeft
        this.y = e.touches[0].pageY - e.touches[0].target.offsetTop
      } else {
        ;(this.x = e.offsetX), (this.y = e.offsetY)
      }

      this.isDrawing = true

      let closestDistance = Infinity
      let closestPointIndex = -1
      this.from = -1

      this.points.forEach((point, index) => {
        const distance = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
        if (distance <= this.lineDistance && distance < closestDistance) {
          closestDistance = distance
          closestPointIndex = index
        }
      })

      if (closestPointIndex !== -1) {
        // If a point is found nearby
        this.from = closestPointIndex
      }
    },
    keepDrawing(e) {
      e.preventDefault()
      if (this.isDrawing === true) {
        const currentTime = new Date().getTime()
        const timeSinceLastCalculation = currentTime - this.lastCalculationTime

        let offsetX,
          offsetY = 0

        //Touchscreen or Mouse
        if (this.isTouchDevice) {
          offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft
          offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop
        } else {
          ;(offsetX = e.offsetX), (offsetY = e.offsetY)
        }

        if (timeSinceLastCalculation >= 5) {
          this.drawLine(this.x, this.y, offsetX, offsetY, 'black')

          this.lastCalculationTime = currentTime
        }

        this.x = offsetX
        this.y = offsetY
      }
    },
    stopDrawing(e) {
      e.preventDefault()
      if (this.isDrawing === true) {
        let closestDistance = Infinity
        let closestPointIndex = -1
        this.to = -1

        this.points.forEach((point, index) => {
          const distance = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
          if (distance <= this.lineDistance && distance < closestDistance) {
            closestDistance = distance
            closestPointIndex = index
          }
        })

        if (this.from !== -1 && closestPointIndex !== -1) {
          this.to = closestPointIndex
          if (this.from != this.to) {
            this.lines.push({ from: this.from, to: this.to })
          }
        }

        this.drawingLines()

        this.x = 0
        this.y = 0
        this.isDrawing = false
      }
    },
    drawingLines() {
      this.clearCanvas()
      for (let line of this.lines) {
        if (line.from != -1 && line.to != -1) {
          //Checking whether the line connects real of fake points (medium or hard diff.)
          if (
            line.from + 1 == line.to &&
            line.from < this.numberOfPoints / this.multiplicity &&
            line.to < this.numberOfPoints / this.multiplicity &&
            this.points.at(line.to).start === false
          ) {
            this.drawLine(
              this.points[line.from].x,
              this.points[line.from].y,
              this.points[line.to].x,
              this.points[line.to].y,
              'black'
            )
          } else {
            this.drawLine(
              this.points[line.from].x,
              this.points[line.from].y,
              this.points[line.to].x,
              this.points[line.to].y,
              'red'
            )
          }
        }
      }
      var gameDone = document.getElementById('gameDone')
      gameDone.innerHTML = ''
      this.checkIfDone()
    },
    checkIfDone() {
      var gameDone = document.getElementById('gameDone')
      let done = true
      //Check all 'real' points if they are connected with their upper neighbour
      for (let i = 0; i < this.numberOfPoints / this.multiplicity - 1; i++) {
        if (this.points.at(i + 1).start !== true) {
          let found = this.lines.some((l) => {
            return l.from === i && l.to === i + 1
          })
          if (found === false) {
            done = false
            break
          }
        }
      }
      if (done === true) {
        gameDone.innerHTML = 'Kész!'
      }
    },
    clearCanvas() {
      this.canvas.clearRect(0, 0, this.c.width, this.c.height)
      this.canvas.beginPath()
      this.drawPointsOnCanvas()
    },
    drawPointsOnCanvas() {
      let ctx = this.canvas
      let cnt = this.multiplicity // Number next to each point -> Start number is the same as the multiplicity
      ctx.fillStyle = 'red' // Set the color of the points

      for (let point of this.points) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, true) // Draw a circle for each point
        if (point.start === true) {
          ctx.fillStyle = 'blue'
          ctx.fill()
          if (point.x > this.c.width - 17) {
            ctx.fillText(cnt, point.x - 18, point.y + 6, 14)
          } else {
            ctx.fillText(cnt, point.x + 6, point.y + 6, 14)
          }
          ctx.fillStyle = 'red'
        } else {
          //If a point is close to the right edge it's number shows up on the left side
          if (point.x > this.c.width - 17) {
            ctx.fillText(cnt, point.x - 18, point.y + 6, 12)
          } else {
            ctx.fillText(cnt, point.x + 6, point.y + 6, 14)
          }
          ctx.fill()
        }

        if (cnt % this.multiplicity == 0) {
          if (cnt == this.numberOfPoints) {
            //Enters only when real points are over
            cnt = 1
          } else {
            cnt += this.multiplicity
          }
        } else {
          cnt++
          //Skipping the number of real points, they are done already
          if (cnt % this.multiplicity == 0) {
            cnt++
          }
        }
      }
      ctx.closePath()
    },
    cancelLine() {
      this.lines.splice(-1)
      this.drawingLines()
    },
    newGame() {
      this.$router.push('/')
    }
  },
  mounted() {
    this.c = document.getElementById('canvas')

    this.c.width = window.innerWidth
    this.c.height = window.innerHeight * 0.77

    this.canvas = this.c.getContext('2d')
    this.canvas.translate(0, 0)

    this.isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints

    if (!this.isTouchDevice) {
      window.addEventListener(
        'resize',
        () => ((this.c.width = window.innerWidth), (this.c.height = window.innerHeight * 0.77))
      )
    }

    this.points = this.$store.getters.getPoints
    this.difficulty = this.$store.getters.getDifficulty
    this.numberOfPoints = this.$store.getters.getNumberOfPoints

    var instruction = document.getElementById('instruction_div')

    if (this.difficulty === 'easy') {
      instruction.innerHTML =
        '<h4>Kösd össze a pontokat a sorszámok alapján! A pontokat páronként lehet összekötni.</h4>'
      this.multiplicity = 1
    } else if (this.difficulty === 'medium') {
      instruction.innerHTML =
        '<h4>Csak a páros sorszámú pontokat kösd össze! A pontokat páronként lehet összekötni.</h4>'
      this.multiplicity = 2
    } else if (this.difficulty === 'hard') {
      instruction.innerHTML =
        '<h4>Csak a 4-gyel osztható számokat kösd össze! A pontokat páronként lehet összekötni.</h4>'
      this.multiplicity = 4
    }
    instruction.innerHTML += "<h2 id='gameDone'></h2>"

    this.drawPointsOnCanvas()
  }
}
</script>

<template>
  <div id="instruction_div"></div>
  <div id="canvas_div">
    <canvas
      id="canvas"
      @mousedown="beginDrawing"
      @mousemove="keepDrawing"
      @mouseup="stopDrawing"
      @touchstart="beginDrawing"
      @touchmove="keepDrawing"
      @touchend="stopDrawing"
    ></canvas>
  </div>
  <div id="button_div">
    <GameButton msg="Visszavonás" @click="cancelLine" />
    <GameButton msg="Új játék" @click="newGame" />
  </div>
</template>
