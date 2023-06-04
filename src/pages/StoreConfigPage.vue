<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-center">
        <p class="text-h6">Configurações da Loja</p>
      </div>
    </div>

    <div class="row justify-center">
      <q-form
        @submit.prevent="onSubmit"
        class="col-md-8 col-sm-10 col-xs-10 q-gutter-y-md"
      >
        <InputImage
          v-model="form.logo_url"
          label="Logomarca"
          :disable="isLoading"
          @update-img-file="(data) => logoFile = data"
          @img-error="(hasError) => showError = !!hasError"
        />

        <q-input
          v-model="form.name"
          label="Nome"
          type="text"
          outline
          :disable="isLoading"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o nome da loja.',
            val => (val && val.length > 3) || 'Por favor, informe um nome válido.'
          ]"
        />

        <q-input
          v-model="form.whatsapp_number"
          label="Número do Whatsapp"
          type="text"
          outline
          mask="(##) #####-####"
          unmasked-value
          :disable="isLoading"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Por favor, informe o número do Whatsapp.',
            val => (val && val.length >= 11) || 'Por favor, informe um número válido.'
          ]"
        />

        <InputImage
          v-model="form.parallax_url"
          label="Imagem do Banner"
          :disable="isLoading"
          @update-img-file="(data) => parallaxFile = data"
          @img-error="(hasError) => showError = !!hasError"
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-field borderless class="col-xs-12 col-sm-5 col-lg-3" label="Cor Principal">
            <q-color v-model="form.primary_color" class="full-width q-mt-md" />
          </q-field>
          <q-field borderless class="col-xs-12 col-sm-5 col-lg-3" label="Cor Secundária">
            <q-color v-model="form.secondary_color" class="full-width q-mt-md" />
          </q-field>
        </div>

        <div class="flex q-gutter-x-md" :class="$q.platform.is.desktop ? 'justify-end' : 'justify-center'">
          <q-btn :label="form.id ? 'Atualizar' : 'Salvar'" type="submit" color="positive" :disable="showError" />
          <q-btn label="Cancelar" color="negative" :to="{ name: 'home' }" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useBrandConfigs from 'src/composables/useBrandConfigs'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import InputImage from 'components/InputImage.vue'

export default defineComponent({
  name: 'StoreConfigPage',

  components: { InputImage },

  setup () {
    const { getByUserId, upsert, uploadImg } = useAPI()
    const { notifySuccess, notifyError } = useNotify()
    const { getDefaultBrandColor, setBrandColors } = useBrandConfigs()

    const isLoading = ref(false)
    const showError = ref(false)

    const form = ref({
      id: '',
      name: '',
      logo_url: '',
      parallax_url: '',
      whatsapp_number: '',
      primary_color: getDefaultBrandColor('primary'),
      secondary_color: getDefaultBrandColor('secondary')
    })

    const logoFile = ref(null)
    const parallaxFile = ref(null)

    onMounted(() => {
      getStoreConfigs()
    })

    const getStoreConfigs = async () => {
      try {
        isLoading.value = true

        const configs = await getByUserId('stores_config')

        if (configs) {
          form.value = configs
        }
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    const onSubmit = async () => {
      try {
        if (logoFile.value) {
          const logoUrl = await uploadImg(logoFile.value, 'store-brand-img')
          form.value.logo_url = logoUrl
        }

        if (parallaxFile.value) {
          const parallaxUrl = await uploadImg(parallaxFile.value, 'store-parallax-img')
          form.value.parallax_url = parallaxUrl
        }

        await upsert('stores_config', form.value)

        setBrandColors({
          primary: form.value.primary_color,
          secondary: form.value.secondary_color
        })

        notifySuccess()
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      isLoading,
      showError,
      onSubmit,
      logoFile,
      parallaxFile
    }
  }
})
</script>
