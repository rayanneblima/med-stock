<template>
  <q-page padding>
    <p class="text-body-1">Agradecemos por se registrar!</p>
    <p class="text-body-1">
      Por favor, confirme o e-mail para efetivar o cadastro:
      <b>{{ $route.query.email }}</b>
    </p>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-btn
          label="Entrar"
          color="primary"
          class="full-width q-mt-md"
          to="/login"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmailConfirmationPage'
})
</script>
