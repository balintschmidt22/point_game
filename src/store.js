import { createStore } from 'vuex'

export default createStore({
  state: {
    points: [],
    difficulty: 'easy'
  },
  mutations: {
    addToPoints(state, { x, y, start }) {
      state.points.push({ x, y, start })
    },
    reset(state) {
      state.points = []
    },
    setDifficulty(state, diff) {
      state.difficulty = diff
    }
  },
  getters: {
    getPoints(state) {
      return state.points
    },
    getNumberOfPoints(state) {
      return state.points.length
    },
    getDifficulty(state) {
      return state.difficulty
    }
  }
})
