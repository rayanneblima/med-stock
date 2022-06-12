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
          <q-btn
            v-if="$q.platform.is.desktop"
            color="primary"
            icon="mdi-plus"
            label="Adicionar"
            outline
            :to="{ name: 'form-category' }"
          />
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
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-category' }" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useAPI from 'src/composables/useAPI'
import useNotify from 'src/composables/useNotify'
import { useQuasar } from 'quasar'

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'name', align: 'center', label: 'Nome', field: 'name', sortable: true },
  { name: 'created_at', align: 'center', label: 'Criado em', field: 'created_at' },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' }
]

export default defineComponent({
  name: 'ListPage',

  setup () {
    const { notifySuccess, notifyError } = useNotify()
    const { list, remove } = useAPI()
    const router = useRouter()
    const $q = useQuasar()

    const isLoading = ref(false)
    const categories = ref([])

    const getCategories = async () => {
      try {
        isLoading.value = true

        const response = await list('categories')

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
      columns,
      isLoading,
      categories,
      onEdit,
      onDelete
    }
  }
})
</script>
