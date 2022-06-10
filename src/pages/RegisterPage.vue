<template>
  <q-page padding>
    <q-form
      @submit.prevent="onSubmit"
      class="row justify-center"
    >
      <p class="col-12 text-h4 text-center">Cadastre-se</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          v-model="form.name"
          type="text"
          label="Nome Completo"
          outlined
          lazy-rules
          :rules="[
            val => (val && val.length >= 6) || 'Por favor, informe o nome completo.'
          ]"
        />

        <q-input
          v-model="form.email"
          type="email"
          label="E-mail"
          outlined
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o e-mail.'
          ]"
        />

        <q-input
          v-model="form.password"
          type="password"
          label="Senha"
          outlined
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe a senha.',
            val => (val && (val.length > 0 && val.length > 5)) || 'A senha deve conter, no mínimo, 6 caracteres.'
          ]"
        />

        <q-btn
          label="Registrar"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
          outline
        />

        <q-btn
          label="Entrar"
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
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterPage',

  setup () {
    const router = useRouter()

    const { register } = useAuthUser()
    const { notifySuccess, notifyError } = useNotify()

    const form = ref({
      name: '',
      email: '',
      password: ''
    })

    const onSubmit = async () => {
      try {
        await register(form.value)
        notifySuccess()
        router.push({
          name: 'email-confirmation',
          query: { email: form.value.email }
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      onSubmit
    }
  }
})
</script>
