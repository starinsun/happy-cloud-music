<template>
  <div>name</div>
  <div>
    <loading />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Loading from './components/Loading.vue'

export default defineComponent({
  name: 'App',
  components: {
    Loading,
  }
})
</script>>
