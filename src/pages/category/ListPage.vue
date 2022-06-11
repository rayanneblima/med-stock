<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="categories"
        :columns="columns"
        row-key="id"
        class="full-width"
        :loading="isLoading"
        loading-label="Buscando registros..."
      >
        <template v-slot:top>
          <span class="text-h6">Categorias</span>
          <q-space />
          <q-btn color="primary" icon="mdi-plus" label="Adicionar" outline :to="{ name: 'categories-create' }" />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn color="info" icon="mdi-pencil-outline" outline size="sm" @click="onEdit(props.key)">
              <q-tooltip anchor="top middle" self="center middle">
                Editar
              </q-tooltip>
            </q-btn>

            <q-btn color="negative" icon="mdi-delete-outline" outline size="sm" @click="onDelete(props.key)">
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
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'name', align: 'center', label: 'Nome', field: 'name', sortable: true },
  { name: 'created_at', align: 'center', label: 'Criado em', field: 'created_at' },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' }
]

export default defineComponent({
  name: 'ListPage',

  setup () {
    const { notifyError } = useNotify()
    const { list } = useAPI()

    const isLoading = ref(false)
    const categories = ref([])

    const getCategories = async () => {
      try {
        isLoading.value = true

        const response = await list('category')

        categories.value = response.map((category) => {
          const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
          const data = category.created_at
          category.created_at = new Date(data).toLocaleDateString('pt-BR', options)
          return category
        })
      } catch (error) {
        notifyError(error.message)
      }

      isLoading.value = false
    }

    onMounted(() => {
      getCategories()
    })

    const onAdd = () => {

    }

    const onEdit = (id) => {

    }

    const onDelete = (id) => {

    }

    return {
      columns,
      isLoading,
      categories,
      onAdd,
      onEdit,
      onDelete
    }
  }
})
</script>
