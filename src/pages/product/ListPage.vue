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
      >
        <template v-slot:top>
          <span class="text-h6">Produtos</span>
          <q-btn
            color="primary"
            icon="mdi-store"
            label="Minha Loja"
            outline
            size="sm"
            rounded
            class="q-ml-sm"
            @click="redirectToStore"
          />
          <q-btn
            color="secondary"
            icon="mdi-content-copy"
            label="Copiar link"
            outline
            size="sm"
            rounded
            class="q-ml-sm"
            @click="copyPublicStoreUrl"
          />
          <q-space />
          <q-btn
            v-if="$q.platform.is.desktop"
            color="primary"
            icon="mdi-plus"
            label="Adicionar"
            outline
            :to="{ name: 'form-product' }"
          />
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props" :class="props.row.img_url && 'product__img'">
            <q-img
              v-if="props.row.img_url"
              :src="props.row.img_url"
              :ratio="16/9"
              spinner-color="primary"
              spinner-size="20px"
              @error="props.row.img_url = ''"
            />
            <q-icon v-else name="mdi-image-off" size="20px" />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn color="info" icon="mdi-pencil-outline" outline size="sm" @click="onEdit(props.key)">
              <q-tooltip anchor="top middle" self="center middle">
                Editar
              </q-tooltip>
            </q-btn>

            <q-btn
              color="negative"
              icon="mdi-delete-outline"
              size="sm"
              outline
              @click="onDelete(props.key, props.row.name)"
            >
              <q-tooltip anchor="top middle" self="center middle" class="q-mb-sm">
                Excluir
              </q-tooltip>
            </q-btn>
          </q-td>
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
import { useRouter } from 'vue-router'
import { useQuasar, openURL, copyToClipboard } from 'quasar'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'
import { productColumns } from './table'

export default defineComponent({
  name: 'ListPage',

  setup () {
    const { notifySuccess, notifyError } = useNotify()
    const { list, remove } = useAPI()
    const { user } = useAuthUser()

    const router = useRouter()
    const $q = useQuasar()

    const isLoading = ref(false)
    const products = ref([])

    const getProducts = async () => {
      try {
        isLoading.value = true

        const response = await list('products', '*, categories (name)', user.value.id)

        products.value = response.map((product) => {
          return {
            ...product,
            category_name: product.categories.name
          }
        })
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      getProducts()
    })

    const redirectToStore = () => {
      const userId = user.value.id
      const externalLink = router.resolve({ name: 'products-public', params: { userId } })
      openURL(window.origin + externalLink.href)
    }

    const copyPublicStoreUrl = () => {
      const userId = user.value.id
      const externalLink = router.resolve({ name: 'products-public', params: { userId } })
      copyToClipboard(window.origin + externalLink.href)
        .then(() => notifySuccess('Copiado!'))
        .catch((error) => notifyError(error.message))
    }

    const onEdit = (id) => {
      router.push({ name: 'form-product', params: { id } })
    }

    const onDelete = async (id, name) => {
      $q.dialog({
        title: 'Excluir categoria',
        message: `Você realmente deseja excluir o produto <b>${name}</b> ?`,
        cancel: true,
        persistent: true,
        html: true
      }).onOk(async () => {
        try {
          await remove('products', id)
          notifySuccess()
          getProducts()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

    return {
      productColumns,
      isLoading,
      products,
      onEdit,
      onDelete,
      redirectToStore,
      copyPublicStoreUrl
    }
  }
})
</script>

<style scoped>
.product__img:hover {
  position: absolute;
  width: 260px;
  z-index: 999;
}
</style>
