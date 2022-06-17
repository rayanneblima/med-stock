<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Quasar Estoque
          <span class="text-bold" v-if="storeConfigs.name"> - {{storeConfigs.name}}</span>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import useAPI from 'src/composables/useAPI'

export default defineComponent({
  name: 'LoginLayout',

  setup () {
    const { storeConfigs, setStoreConfigs } = useAPI()

    onMounted(() => {
      setStoreConfigs()
    })

    return {
      storeConfigs
    }
  }
})
</script>
