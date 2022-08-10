<template>
  <q-page padding>
    <DataTable
      labelTitle="Tipo de Apresentação do Medicamento"
      routeName="form-presentation"
      :rowsData="presentations"
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
    const presentations = ref([])

    const getPresentations = async () => {
      try {
        isLoading.value = true
        presentations.value = await publicList('presentations')
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      getPresentations()
    })

    const onEdit = (id) => {
      router.push({ name: 'form-presentation', params: { id } })
    }

    const onDelete = async (id, name) => {
      $q.dialog({
        title: 'Excluir laboratório',
        message: `Você realmente deseja excluir a presentação <b>${name}</b>?`,
        cancel: true,
        persistent: true,
        html: true
      }).onOk(async () => {
        try {
          await remove('presentations', id)
          notifySuccess()
          getPresentations()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

    return {
      tableColumns,
      isLoading,
      presentations,
      onEdit,
      onDelete
    }
  }
})
</script>
