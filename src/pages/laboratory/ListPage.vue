<template>
  <q-page padding>
    <DataTable
      labelTitle="Laboratórios"
      routeName="form-laboratory"
      :rowsData="laboratories"
      :colsData="tableColumns"
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
import { tableColumns } from '../simpleTable'
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
    const laboratories = ref([])

    const getLaboratories = async () => {
      try {
        isLoading.value = true
        laboratories.value = await publicList('laboratories')
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      getLaboratories()
    })

    const onEdit = (id) => {
      router.push({ name: 'form-laboratory', params: { id } })
    }

    const onDelete = async (id, name) => {
      $q.dialog({
        title: 'Excluir laboratório',
        message: `Você realmente deseja excluir o laboratório <b>${name}</b> ?`,
        cancel: true,
        persistent: true,
        html: true
      }).onOk(async () => {
        try {
          await remove('laboratories', id)
          notifySuccess()
          getLaboratories()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

    return {
      tableColumns,
      isLoading,
      laboratories,
      onEdit,
      onDelete
    }
  }
})
</script>
