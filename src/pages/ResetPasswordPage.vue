<template>
  <q-page padding>
    <q-form
      @submit.prevent="onSubmit"
      class="row justify-center"
    >
      <p class="col-12 text-h4 text-center">Resetar senha</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          v-model="password"
          type="password"
          label="New Password"
          outlined
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe a senha.',
            val => (val && (val.length > 0 && val.length > 5)) || 'A senha deve conter, no mínimo, 6 caracteres.'
          ]"
        />

        <q-btn
          label="Salvar"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
          outline
        />

        <q-btn
          label="Voltar"
          color="primary"
          class="full-width q-mt-md"
          flat
          to="/login"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ResetPasswordPage',

  setup () {
    const { resetPassword } = useAuthUser()
    const { notifySuccess, notifyError } = useNotify()

    const route = useRoute()
    const router = useRouter()
    const token = route.query.token

    const password = ref('')

    const onSubmit = async () => {
      try {
        await resetPassword(token, password.value)
        notifySuccess()
        router.push({ name: 'login' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      password,
      onSubmit
    }
  }
})
</script>
