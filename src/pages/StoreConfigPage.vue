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
        <q-file
          v-model="logo"
          label="Logomarca"
          accept="image/*"
          :disable="isLoading"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-paperclip" />
          </template>
        </q-file>

        <q-input
          v-model="form.name"
          label="Nome da Loja"
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

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-field borderless class="col-xs-12 col-sm-5" label="Cor Principal">
            <q-color v-model="form.primary_color" class="q-mt-md" />
          </q-field>
          <q-field borderless class="col-xs-12 col-sm-5" label="Cor Secundária">
            <q-color v-model="form.secondary_color" class="q-mt-md" />
          </q-field>
        </div>

        <div class="flex q-gutter-x-md" :class="$q.platform.is.desktop ? 'justify-end' : 'justify-center'">
          <q-btn :label="form.id ? 'Atualizar' : 'Salvar'" type="submit" color="positive" />
          <q-btn label="Cancelar" color="negative" :to="{ name: 'home' }" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import useBrandConfigs from 'src/composables/useBrandConfigs'

export default defineComponent({
  name: 'StoreConfigPage',

  setup () {
    const { getByUserId, upsert, uploadImg } = useAPI()
    const { notifySuccess, notifyError } = useNotify()
    const { getDefaultBrandColor, setBrandColors } = useBrandConfigs()

    const isLoading = ref(false)

    const form = ref({
      id: '',
      name: '',
      logo_url: '',
      whatsapp_number: '',
      primary_color: getDefaultBrandColor('primary'),
      secondary_color: getDefaultBrandColor('secondary')
    })

    const logo = ref([])

    onMounted(() => {
      getStoreConfigs()
    })

    const getStoreConfigs = async () => {
      try {
        isLoading.value = true

        const configs = await getByUserId('store_configs')

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
        if (logo.value.name) {
          const logoUrl = await uploadImg(logo.value, 'store-brand-img')
          form.value.logo_url = logoUrl
        }

        await upsert('store_configs', form.value)

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
      onSubmit,
      logo
    }
  }
})
</script>
