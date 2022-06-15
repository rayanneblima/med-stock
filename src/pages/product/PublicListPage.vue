<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="products"
        :columns="productColumns"
        row-key="id"
        class="full-width"
        :loading="isLoading"
        loading-label="Buscando registros..."
        :filter="filter"
        grid
      >
        <template v-slot:top>
          <span class="text-h6">Produtos</span>
          <q-space />
          <q-input
            v-model="filter"
            type="text"
            outlined
            dense
            debounce="300"
            placeholder="Buscar produto..."
          >
            <template v-slot:append>
              <q-icon name="mdi-magnify" size="20px" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle-2">{{ currencyFormat(props.row.price) }}</div>
                <div>
                  <q-img
                    v-if="props.row.img_url"
                    :src="props.row.img_url"
                    :ratio="4/3"
                    spinner-color="primary"
                    spinner-size="20px"
                    @error="props.row.img_url = ''"
                  />
                  <q-icon v-else name="mdi-image-off" size="20px" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <template v-slot:no-data v-if="!isLoading">
          <div class="full-width row flex-center text-primary q-gutter-sm">
            <span>Nenhum registro encontrado.</span>
          </div>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>

    <q-page-sticky
      v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-product' }" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import { currencyFormat } from 'src/utils/format'
import { productColumns } from './table'

export default defineComponent({
  name: 'PublicListPage',

  setup () {
    const { notifyError } = useNotify()
    const { publicList } = useAPI()

    const route = useRoute()

    const filter = ref('')
    const isLoading = ref(false)
    const products = ref([])

    const getProducts = async (userId) => {
      try {
        isLoading.value = true
        products.value = await publicList('products', userId)
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      if (route.params.userId) {
        getProducts(route.params.userId)
      }
    })

    return {
      productColumns,
      filter,
      isLoading,
      products,
      currencyFormat
    }
  }
})
</script>
