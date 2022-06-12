<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-center">
        <p class="text-h6">{{ isUpdate ? 'Atualização' : 'Cadastro'}} de Categoria</p>
      </div>
    </div>

    <div class="row justify-center">
      <q-form
        @submit.prevent="onSubmit"
        class="col-md-8 col-sm-10 col-xs-10 q-gutter-y-md"
      >
        <q-input
          v-model="form.name"
          label="Nome"
          type="text"
          outline
          :disable="isUpdate && isLoading"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o nome.',
            val => (val && val.length > 3) || 'Por favor, informe um nome válido.'
          ]"
        />

        <div class="flex q-gutter-x-md" :class="isDesktop ? 'justify-end' : 'justify-center'">
          <q-btn :label="isUpdate ? 'Atualizar' : 'Cadastrar'" type="submit" color="positive" />
          <q-btn label="Cancelar" color="negative" :to="{ name: 'categories' }" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'FormPage',

  setup () {
    const router = useRouter()
    const route = useRoute()
    const { getById, post, update } = useAPI()
    const { notifySuccess, notifyError } = useNotify()

    const $q = useQuasar()

    const isDesktop = computed(() => $q.platform.is.desktop)

    const isLoading = ref(false)
    const form = ref({
      name: ''
    })

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
      if (isUpdate.value) {
        getCategory()
      }
    })

    const getCategory = async () => {
      try {
        isLoading.value = true
        const category = await getById('categories', route.params.id)
        form.value = category
      } catch (error) {
        notifyError(error.message)
      }
      isLoading.value = false
    }

    const onSubmit = async () => {
      try {
        isUpdate.value
          ? await update('categories', form.value)
          : await post('categories', form.value)

        notifySuccess()
        router.push({ name: 'categories' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      isDesktop,
      isLoading,
      isUpdate,
      onSubmit
    }
  }
})
</script>
