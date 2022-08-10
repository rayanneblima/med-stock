import { currencyFormat } from 'src/utils/format'
import { ref } from 'vue'

const productColumns = [
  { name: 'img_url', align: 'center', label: 'Imagem', field: 'img_url' },
  { name: 'name', align: 'center', label: 'Nome', field: 'name', sortable: true },
  { name: 'laboratory_name', align: 'center', label: 'Laboratório', field: 'laboratory_name', sortable: true },
  { name: 'presentation_name', align: 'center', label: 'Apresentação', field: 'presentation_name', sortable: true },
  { name: 'category_name', align: 'center', label: 'Categoria', field: 'category_name', sortable: true },
  { name: 'price', align: 'center', label: 'Preço', field: 'price', sortable: true, format: (val) => currencyFormat(val) },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' }
]

const excelColumns = [
  { label: 'Imagem', field: 'img_url' },
  { label: 'Nome', field: 'name' },
  { label: 'Laboratório', field: 'laboratory_name' },
  { label: 'Apresentação', field: 'presentation_name' },
  { label: 'Categoria', field: 'category_name' },
  { label: 'Preço', field: 'price' }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  productColumns,
  excelColumns,
  initialPagination
}
