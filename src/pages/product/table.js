import { currencyFormat } from 'src/utils/format'

const productColumns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'img_url', align: 'center', label: 'Imagem', field: 'img_url' },
  { name: 'name', align: 'center', label: 'Nome', field: 'name', sortable: true },
  { name: 'amount', align: 'center', label: 'Quantidade', field: 'amount', sortable: true },
  { name: 'price', align: 'center', label: 'Preço', field: 'price', sortable: true, format: (val) => currencyFormat(val) },
  { name: 'category_name', align: 'center', label: 'Categoria', field: 'category_name', sortable: true },
  { name: 'actions', align: 'center', label: 'Ações', field: 'actions' }
]

export {
  productColumns
}
