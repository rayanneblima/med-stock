<template>
  <q-page padding>
    <DataTable
      labelTitle="Categorias"
      routeName="form-category"
      :rowsData="categories"
      :colsData="categoryColumns"
      :isLoading="isLoading"
      @edit="(id) => onEdit(id)"
      @delete="({ key, rowName }) => onDelete(key, rowName)"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import { categoryColumns } from './table'
import DataTable from 'components/DataTable.vue'

export default defineComponent({
  name: 'ListPage',

  components: { DataTable },

  setup () {
    const { notifySuccess, notifyError } = useNotify()
    const { publicList, remove } = useAPI()
    const router = useRouter()
    const $q = useQuasar()

    const isLoading = ref(false)
    const categories = ref([])

    const getCategories = async () => {
      try {
        isLoading.value = true
        categories.value = await publicList('categories')
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      getCategories()
    })

    const onEdit = (id) => {
      router.push({ name: 'form-category', params: { id } })
    }

    const onDelete = async (id, name) => {
      $q.dialog({
        title: 'Excluir categoria',
        message: `Você realmente deseja excluir a categoria <b>${name}</b> ?`,
        cancel: true,
        persistent: true,
        html: true
      }).onOk(async () => {
        try {
          await remove('categories', id)
          notifySuccess()
          getCategories()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

    return {
      categoryColumns,
      isLoading,
      categories,
      onEdit,
      onDelete
    }
  }
})
</script>
