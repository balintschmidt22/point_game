<script setup>
import GameButton from '../components/GameButton.vue'
</script>

<script>
export default {
  data() {
    return {
      difficulty: 'easy'
    }
  },
  methods: {
    startGame(difficulty) {
      this.$store.commit('setDifficulty', difficulty)
      this.$router.push({
        name: 'game'
      })
    }
  }
}
</script>

<template>
  <main>
    <div>
      <div id="title_div">
        <h1>Pontösszekötős játék</h1>
        <p>Válassz játékmódot:</p>
      </div>
      <div id="button_div">
        <GameButton msg="Könnyű" @click="startGame('easy')" />
        <GameButton msg="Közepes" @click="startGame('medium')" />
        <GameButton msg="Nehéz" @click="startGame('hard')" />
      </div>
    </div>
  </main>
</template>

<style></style>
