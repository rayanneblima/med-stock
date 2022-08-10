<template>
  <q-page padding>
    <DataTable
      labelTitle="Produtos"
      routeName="form-product"
      :rowsData="products"
      :colsData="productColumns"
      :isLoading="isLoading"
      :customSlots="['img_url']"
      @edit="(id) => onEdit(id)"
      @delete="({ key, rowName }) => onDelete(key, rowName)"
    >
      <template v-slot:top-buttons>
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
        <q-btn
          color="primary"
          icon-right="archive"
          label="Exportar Tabela"
          size="sm"
          rounded
          class="q-ml-sm"
          @click="exportTable"
        />
      </template>

      <template v-slot:body-cell-img_url="{ item }">
        <q-td :props="item" :class="item.row.img_url && 'product__img'">
          <q-img
            v-if="item.row.img_url"
            :src="item.row.img_url"
            :ratio="16/9"
            spinner-color="primary"
            spinner-size="20px"
            @error="item.row.img_url = ''"
          />
          <q-icon v-else name="mdi-image-off" size="20px" />
        </q-td>
      </template>
    </DataTable>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { exportFile, useQuasar, openURL, copyToClipboard } from 'quasar'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'
import DataTable from 'components/DataTable.vue'
import { productColumns, excelColumns } from './table'

function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)
  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

export default defineComponent({
  components: { DataTable },
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

    const exportTable = () => {
      const content = [excelColumns.map((col) => wrapCsvValue(col.label))]
        .concat(
          products.value.map((row) =>
            excelColumns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(',')
          )
        )
        .join('\r\n')

      const status = exportFile('table-export.csv', content, 'text/csv')

      if (status !== true) {
        $q.notify({
          message:
            'Não foi possível exportar a tabela. Tente novamente mais tarde.',
          color: 'negative',
          icon: 'warning'
        })
      }
    }

    const onEdit = (id) => {
      router.push({ name: 'form-product', params: { id } })
    }

    const onDelete = async (id, name) => {
      $q.dialog({
        title: 'Excluir produto',
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
      exportTable,
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
