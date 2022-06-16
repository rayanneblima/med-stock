<template>
  <q-page padding>
    <q-form
      @submit.prevent="onSubmit"
      class="row justify-center"
    >
      <p class="col-12 text-h4 text-center">Login</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
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
            val => (val && val.length >= 6) || 'A senha deve conter, no mínimo, 6 caracteres.'
          ]"
        />

        <q-btn
          label="Entrar"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
          outline
        />

        <div class="flex justify-center">
          <q-btn
            label="Esqueceu a senha?"
            color="primary"
            class="q-mt-md"
            flat
            to="/forgot-password"
            size="sm"
          />

          <q-btn
            label="Registre-se"
            color="primary"
            class="q-mt-md"
            flat
            to="/register"
            size="sm"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',

  setup () {
    const router = useRouter()

    const { login, isLoggedIn } = useAuthUser()
    const { notifySuccess, notifyError } = useNotify()

    const form = ref({
      email: '',
      password: ''
    })

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: 'home' })
      }
    })

    const onSubmit = async () => {
      try {
        await login(form.value)
        notifySuccess()
        router.push({ name: 'home' })
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
