<template>
  <q-page padding>
    <q-form
      @submit.prevent="onSubmit"
      class="row justify-center"
    >
      <p class="col-12 text-h4 text-center">Esqueci a senha</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          v-model="email"
          type="email"
          label="E-mail"
          outlined
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o e-mail.'
          ]"
        />

        <q-btn
          label="Recuperar a senha"
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

export default defineComponent({
  name: 'ForgotPasswordPage',

  setup () {
    const { sendPasswordResetEmail } = useAuthUser()
    const { notifySuccess, notifyError } = useNotify()

    const email = ref('')

    const onSubmit = async () => {
      try {
        await sendPasswordResetEmail(email.value)
        notifySuccess(`O e-mail para resetar a senha foi enviado para: <b>${email.value}</b>`)
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      email,
      onSubmit
    }
  }
})
</script>
