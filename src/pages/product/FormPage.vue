<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-center">
        <p class="text-h6">{{ isUpdate ? 'Atualização' : 'Cadastro'}} de Produto</p>
      </div>
    </div>

    <div class="row justify-center">
      <q-form
        @submit.prevent="onSubmit"
        class="col-md-8 col-sm-10 col-xs-10 q-gutter-y-md"
      >
        <InputImage
          v-model="form.img_url"
          label="Imagem Principal"
          :disable="isUpdate && isLoading"
          @update-img-file="(data) => imgFile = data"
          @img-error="(hasError) => showError = !!hasError"
        />

        <q-input
          v-model="form.name"
          label="Nome"
          type="text"
          outline
          :disable="isUpdate && isLoading"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o nome do produto.',
            val => (val && val.length > 3) || 'Por favor, informe um nome válido.'
          ]"
        />

        <q-editor
          v-model="form.description"
          placeholder="Descrição"
          min-height="5rem"
          :disable="isUpdate && isLoading"
        />

        <q-input
          v-model="form.amount"
          label="Quantidade"
          type="number"
          outline
          min="0"
          :disable="isUpdate && isLoading"
          lazy-rules
          :rules="[
            val => !!val || 'Por favor, informe a quantidade do produto.'
          ]"
        />

        <q-input
          v-model="form.price"
          label="Preço"
          type="number"
          outline
          min="0"
          prefix="R$"
          :disable="isUpdate && isLoading"
          lazy-rules
          :rules="[
            val => !!val || 'Por favor, informe o preço do produto.'
          ]"
        />

        <q-select
          v-model="form.category_id"
          label="Categoria"
          :options="optionsCategory"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          outline
          :disable="isUpdate && isLoading"
          lazy-rules
          :rules="[
            val => !!val || 'Por favor, informe a categoria do produto.'
          ]"
        />

        <q-input
          v-if="isUpdate"
          v-model="createdAt"
          label="Criado em"
          type="text"
          outline
          disable
        />

        <div class="flex q-gutter-x-md" :class="$q.platform.is.desktop ? 'justify-end' : 'justify-center'">
          <q-btn :label="isUpdate ? 'Atualizar' : 'Cadastrar'" type="submit" color="positive" :disable="showError" />
          <q-btn label="Cancelar" color="negative" :to="{ name: 'products' }" />
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
import { dateTimeFormat } from 'src/utils/format'
import InputImage from 'components/InputImage.vue'

export default defineComponent({
  components: { InputImage },
  name: 'FormPage',

  setup () {
    const router = useRouter()
    const route = useRoute()
    const { publicList, getById, post, update, uploadImg } = useAPI()
    const { notifySuccess, notifyError } = useNotify()

    const isLoading = ref(false)

    const form = ref({
      img_url: '',
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: ''
    })
    const createdAt = ref('')

    const imgFile = ref([])
    const showError = ref(false)

    const optionsCategory = ref([])

    const isUpdate = computed(() => !!route.params.id)

    onMounted(() => {
      getCategories()

      if (isUpdate.value) {
        getProduct()
      }
    })

    const getCategories = async () => {
      try {
        isLoading.value = true
        const categoriesList = await publicList('categories')
        optionsCategory.value = categoriesList
      } catch (error) {
        notifyError(error.message)
      }
      isLoading.value = false
    }

    const getProduct = async () => {
      try {
        isLoading.value = true

        const product = await getById('products', route.params.id)

        form.value = product
        createdAt.value = dateTimeFormat(product.created_at)
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    const onSubmit = async () => {
      try {
        if (imgFile.value) {
          const imgUrl = await uploadImg(imgFile.value, 'products-img')
          form.value.img_url = imgUrl
        }

        isUpdate.value
          ? await update('products', form.value)
          : await post('products', form.value)

        notifySuccess()
        router.push({ name: 'products' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      createdAt,
      isLoading,
      isUpdate,
      onSubmit,
      optionsCategory,
      imgFile,
      showError
    }
  }
})
</script>
