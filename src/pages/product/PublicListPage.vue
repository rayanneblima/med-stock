<template>
  <q-page padding>
    <div class="row">
      <q-table
        class="full-width"
        row-key="id"
        loading-label="Buscando registros..."
        :rows="products"
        :loading="isLoading"
        :filter="filter"
        v-model:pagination="initialPagination"
        hide-pagination
        grid
      >
        <template v-slot:top>
          <q-select
            outlined
            v-model="categoryId"
            :options="categories"
            option-label="name"
            option-value="id"
            label="Categorias"
            class="col-12 q-mb-md"
            dense
            clearable
            map-options
            emit-value
            @update:model-value="getProducts"
          />

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
            <q-card id="product-card" @click="handleShowProductDetails(props.row)" v-ripple:primary>
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">{{ currencyFormat(props.row.price) }}</div>
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

      <div class="col-12 q-pa-md">
        <q-pagination
          v-model="initialPagination.page"
          :max="pagesNumber"
          class="flex-center"
          direction-links
          @update:model-value="scrollToTop"
        />
      </div>
    </div>

    <q-page-sticky
      v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-product' }" />
    </q-page-sticky>

    <dialog-product-details
      :showDialog="showProductDetails"
      :product="clickedProduct"
      @hide-dialog="showProductDetails = false"
    />
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import { currencyFormat } from 'src/utils/format'
import DialogProductDetails from 'components/DialogProductDetails'
import { initialPagination } from './table'

export default defineComponent({
  name: 'PublicListPage',

  components: {
    DialogProductDetails
  },

  setup () {
    const { notifyError } = useNotify()
    const { publicList } = useAPI()

    const route = useRoute()

    const filter = ref('')
    const isLoading = ref(false)
    const categories = ref([])
    const categoryId = ref('')
    const products = ref([])
    const clickedProduct = ref({})
    const showProductDetails = ref(false)

    const getCategories = async () => {
      try {
        isLoading.value = true
        categories.value = await publicList('categories')
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    const getProducts = async () => {
      try {
        isLoading.value = true
        products.value = categoryId.value
          ? await publicList('products', 'category_id', categoryId.value)
          : await publicList('products')
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      if (route.params.userId) {
        getCategories()
        getProducts()
      }
    })

    const handleShowProductDetails = (product) => {
      clickedProduct.value = product
      showProductDetails.value = true
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
      filter,
      showProductDetails,
      clickedProduct,
      handleShowProductDetails,
      isLoading,
      products,
      currencyFormat,
      categories,
      getProducts,
      categoryId,
      initialPagination,
      scrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowPerPage))
    }
  }
})
</script>

<style scoped>
#product-card:hover {
  filter: brightness(0.9);
  transition: all .3s ease-in-out;
}
</style>
