<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>Olá, {{ user.user_metadata.name }}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'HomePage',

  setup () {
    const { user } = useAuthUser()

    return {
      user
    }
  }
})
</script>
