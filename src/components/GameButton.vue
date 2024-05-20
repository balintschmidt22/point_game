<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <button>{{ msg }}</button>
  </div>
</template>
