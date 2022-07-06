<template>
  <q-card flat>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="pasteUrl" label="Colar url" />
      <q-tab name="upload" label="Enviar do computador" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="pasteUrl">
        <q-input
          type="text"
          outline
          error-message="Por favor, verifique a URL informada."
          :label="label"
          :error="!!errorClass"
          :disable="disable"
          :model-value="modelValue"
          @update:model-value="handleUpdateImgURL"
        />
      </q-tab-panel>

      <q-tab-panel name="upload">
        <q-file
          v-model="imgFile"
          accept="image/*"
          outline
          :label="label"
          :disable="disable"
          @update:model-value="handleUpdateImgFile"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </q-tab-panel>
    </q-tab-panels>

    <q-img
      v-if="modelValue || fileUrl"
      spinner-color="primary"
      spinner-size="20px"
      class="data__img"
      :src="modelValue || fileUrl"
      :ratio="4/3"
      :class="errorClass"
      @error="handleErrorClass"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          URL inválida
        </div>
      </template>
    </q-img>
  </q-card>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'InputImage',

  emits: ['imgError', 'update:modelValue', 'updateImgFile'],

  props: {
    disable: {
      default: false,
      required: false,
      type: Boolean
    },

    label: {
      default: 'Imagem',
      required: false,
      type: String
    },

    modelValue: {
      default: '',
      required: false,
      type: String
    }
  },

  setup (_, { emit }) {
    const tab = ref('pasteUrl')
    const imgFile = ref(null)
    const fileUrl = ref('')
    const errorClass = ref('')

    watch(errorClass, (errorClass) => {
      emit('imgError', errorClass)
    })

    const handleErrorClass = (event) => {
      event && event.type === 'error'
        ? errorClass.value = 'error'
        : errorClass.value = ''
    }

    const clearImgFile = () => {
      imgFile.value = null
      fileUrl.value = ''
      emit('updateImgFile', imgFile.value)
    }

    const clearImgUrl = () => {
      handleErrorClass()
      emit('update:modelValue', '')
    }

    const handleUpdateImgURL = (data) => {
      handleErrorClass()
      if (!errorClass.value && data) {
        clearImgFile()
        emit('update:modelValue', data)
      }
    }

    const handleUpdateImgFile = () => {
      handleErrorClass()
      if (!errorClass.value && imgFile.value) {
        clearImgUrl()
        fileUrl.value = URL.createObjectURL(imgFile.value)
        emit('updateImgFile', imgFile.value)
      }
    }

    return {
      tab,
      imgFile,
      errorClass,
      handleUpdateImgURL,
      handleUpdateImgFile,
      handleErrorClass,
      fileUrl
    }
  }
})
</script>

<style scoped>
.data__img {
  height: 100px;
  width: 100px;
}
.data__img:not(.error):hover {
  height: 400px;
  width: 400px;
  z-index: 999;
}
</style>
