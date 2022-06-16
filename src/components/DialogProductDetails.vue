<template>
  <q-dialog
    :model-value="showDialog"
    :full-width="$q.platform.is.mobile"
    persistent
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ product.name }}</div>
      </q-card-section>

      <q-card-section>
        <q-img
          v-if="product.img_url"
          :src="product.img_url"
          :ratio="16/9"
          spinner-color="primary"
          spinner-size="20px"
        />
        <q-icon v-else name="mdi-image-off" size="20px" />
      </q-card-section>

      <q-card-section>
        <div class="text-body2" v-html="product.description"></div>
        <div class="text-subtitle2">{{ currencyFormat(product.price) }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup @click="sendEmitOnClose" />
        <q-btn
          flat
          label="Enviar pedido"
          color="green-7"
          icon="mdi-whatsapp"
          @click="sendOrderToWpp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { openURL } from 'quasar'
import { currencyFormat } from 'src/utils/format'

export default defineComponent({
  name: 'DialogProductDetails',

  emits: ['hideDialog'],

  props: {
    showDialog: {
      default: false,
      required: true,
      type: Boolean
    },

    product: {
      default: () => {},
      required: true,
      type: Object
    }
  },

  setup (props, { emit }) {
    const sendEmitOnClose = () => {
      emit('hideDialog')
    }

    const sendOrderToWpp = () => {
      const phoneToReceiveOrder = ''
      const message = `Olá, tenho interesse no produto: **${props.product.name}**.`

      const link = encodeURI(`https://api.whatsapp.com/send?phone=55${phoneToReceiveOrder}&text=${message} - ${currencyFormat(props.product.price)}`)
      openURL(link)
    }

    return {
      sendEmitOnClose,
      currencyFormat,
      sendOrderToWpp
    }
  }
})
</script>
