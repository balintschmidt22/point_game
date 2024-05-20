<script setup>
import GameButton from './GameButton.vue'
</script>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      lastPoint: { x: 0, y: 0 },
      POINT_DISTANCE: 30, //distance of the points when generating
      numberOfPoints: 0,
      lastCalculationTime: 0,
      isDrawing: false,
      showButton: false,
      firstGenerated: false, //true when the first point of a new line is generated
      c: null, // canvas element from template/html
      canvas: null, //c.getContext('2d')
      difficulty: '',
      isTouchDevice: false
    }
  },
  methods: {
    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas
      ctx.beginPath()
      ctx.strokeStyle = 'black'
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

      let close = this.$store.getters.getPoints.some((p) => {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2)) < 14
      })
      if (close === false) {
        this.generatePoints(this.x, this.y, true)
        this.firstGenerated = true
        this.lastPoint = { x: this.x, y: this.y }
      }
    },
    keepDrawing(e) {
      e.preventDefault()
      if (this.isDrawing === true) {
        let offsetX,
          offsetY = 0

        //Touchscreen or Mouse
        if (this.isTouchDevice) {
          offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft
          offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop
        } else {
          ;(offsetX = e.offsetX), (offsetY = e.offsetY)
        }

        let dx = offsetX - this.lastPoint.x
        let dy = offsetY - this.lastPoint.y

        this.drawLine(this.x, this.y, offsetX, offsetY)

        let distance = Math.sqrt(dx * dx + dy * dy)

        // Generate points only if the distance is greater than or equal to the given pixels
        if (distance >= this.POINT_DISTANCE) {
          let close = this.$store.getters.getPoints.some((p) => {
            return Math.sqrt(Math.pow(offsetX - p.x, 2) + Math.pow(offsetY - p.y, 2)) < 22
          })
          if (close === false) {
            if (this.firstGenerated === false) {
              this.generatePoints(offsetX, offsetY, true)
              this.firstGenerated = true
            } else {
              this.generatePoints(offsetX, offsetY, false)
            }
            this.lastPoint = { x: offsetX, y: offsetY }
          }
        }

        //The drawing shouldn't leave the canvas or get really close to the edges
        if (offsetX < 3 || offsetX > this.c.width - 3 || offsetY < 0 || offsetY > this.c.height) {
          this.clearCanvas()
          this.isDrawing = false
        }

        this.x = offsetX
        this.y = offsetY
      }
    },
    stopDrawing(e) {
      e.preventDefault()
      if (this.isDrawing === true) {
        let close = this.$store.getters.getPoints.some((p) => {
          return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2) < 14
        })
        if (close === false) {
          this.generatePoints(this.x, this.y, false)
        }
        this.x = 0
        this.y = 0

        this.numberOfPoints = this.$store.getters.getNumberOfPoints

        if (this.numberOfPoints < 2) {
          this.showButton = false
          this.clearCanvas()
        } else {
          this.showButton = true
        }

        //Limits
        //Phone
        if (window.innerWidth < 500) {
          if (
            this.numberOfPoints > 170 ||
            (this.difficulty === 'medium' && this.numberOfPoints > 120) ||
            (this.difficulty === 'hard' && this.numberOfPoints > 70)
          ) {
            this.clearCanvas()
          }
          //Tablet
        } else if (window.innerWidth > 500 && window.innerWidth < 1000) {
          if (
            this.numberOfPoints > 220 ||
            (this.difficulty === 'medium' && this.numberOfPoints > 150) ||
            (this.difficulty === 'hard' && this.numberOfPoints > 85)
          ) {
            this.clearCanvas()
          }
          //Laptop
        } else if (window.innerWidth > 1000 && window.innerWidth < 1500) {
          if (
            this.numberOfPoints > 500 ||
            (this.difficulty === 'medium' && this.numberOfPoints > 300) ||
            (this.difficulty === 'hard' && this.numberOfPoints > 150)
          ) {
            this.clearCanvas()
          }
          //PC
        } else {
          if (
            this.numberOfPoints > 600 ||
            (this.difficulty === 'medium' && this.numberOfPoints > 340) ||
            (this.difficulty === 'hard' && this.numberOfPoints > 180)
          ) {
            this.clearCanvas()
          }
        }
      }

      this.isDrawing = false
      this.firstGenerated = false
    },

    clearCanvas() {
      this.canvas.clearRect(0, 0, this.c.width, this.c.height)
      this.canvas.beginPath()
      this.showButton = false
      this.$store.commit('reset')
    },
    generatePoints(x1, y1, s) {
      this.$store.commit('addToPoints', { x: x1, y: y1, start: s })
    },
    generateFakePoints(n) {
      for (let i = 0; i < this.numberOfPoints * n; i++) {
        let x, y, start
        let validPoint = false

        while (!validPoint) {
          x = this.randomInteger(10, this.c.width - 30)
          y = this.randomInteger(10, this.c.height - 10)
          start = false

          // Check if the point is too close to any existing point
          let tooClose = this.$store.getters.getPoints.some((p) => {
            return Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2)) < 20
          })

          if (!tooClose) {
            validPoint = true
          }
        }

        this.generatePoints(x, y, start)
      }
    },
    jumpToSolution() {
      //"real" points can't exceed this limit, it could crash the game on hard diff., also the game is near unplayable that way because the canvas is full of points
      if (this.difficulty === 'medium') {
        this.generateFakePoints(1)
      } else if (this.difficulty === 'hard') {
        this.generateFakePoints(3)
      }
      this.$router.push({
        name: 'solution'
      })
    },
    randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
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

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
        e.stopPropagation()
        this.clearCanvas()
        this.firstGenerated = false
      }
    })

    this.difficulty = this.$store.getters.getDifficulty
    this.clearCanvas()
  }
}
</script>

<template>
  <div id="instruction_div">
    <h6>
      Rajzolj egy ábrát vagy alakzatot egy vagy több vonallal! Ügyelj arra, hogy a vonal ne legyen
      nagyon hosszú <small>(ilyenkor előfordulhat hogy újra kell rajzolni)</small> és ne hagyja el a
      vásznat!
    </h6>
  </div>
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
    <GameButton msg="Törlés" v-if="showButton" @click="clearCanvas" />
    <GameButton msg="Kész!" v-if="showButton" @click="jumpToSolution" />
  </div>
</template>
