<template>
  <q-toggle
    v-model="isDarkMode"
    color="accent"
    checked-icon="mdi-weather-night"
    unchecked-icon="mdi-white-balance-sunny"
    size="lg"
  />
</template>

<script>
import { defineComponent, onMounted, ref, watch } from '@vue/runtime-core'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ThemeToggle',

  setup () {
    const isDarkMode = ref(false)
    const $q = useQuasar()

    watch(isDarkMode, (isDarkMode) => {
      $q.dark.set(isDarkMode)
      $q.localStorage.set('dark-mode', isDarkMode)
    })

    onMounted(() => {
      isDarkMode.value = $q.localStorage.getItem('dark-mode') || false
    })

    return {
      isDarkMode
    }
  }
})
</script>
