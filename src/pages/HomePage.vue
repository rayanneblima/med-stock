<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <DashboardCard
          table="categories"
          label="Categorias"
          icon="mdi-shape-outline"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <DashboardCard
          table="products"
          label="Produtos"
          icon="mdi-archive"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',

  components: {
    DashboardCard: defineAsyncComponent(() => import('components/DashboardCard.vue'))
  }
})
</script>
