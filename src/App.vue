<template>
  <div id="app">
    <MailBoard />
  </div>
</template>

<script>
import MailBoard from './components/MailBoard.vue'

export default {
  name: 'App',
  components: {
    MailBoard
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
