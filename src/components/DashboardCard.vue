<template>
  <q-card class="my-card" bordered v-ripple:primary>
    <q-skeleton height="50px" type="text" animation="wave" v-if="isLoading" />
    <q-card-section horizontal v-else>
      <div class="col flex flex-center text-h5">
        {{ count }} - {{ label }}
      </div>

      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="secondary" :icon="icon" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useAPI from 'src/composables/useAPI'

export default defineComponent({
  name: 'DashboardCard',

  props: {
    table: {
      default: '',
      required: true,
      type: String
    },

    label: {
      default: '',
      required: true,
      type: String
    },

    icon: {
      default: 'mdi-database-outline',
      required: false,
      type: String
    }
  },

  setup (props) {
    const isLoading = ref(false)
    const { fetchCount } = useAPI()
    const count = ref(0)

    onMounted(async () => {
      isLoading.value = true
      const response = await fetchCount(props.table)
      count.value = response.count
      isLoading.value = false
    })

    return {
      isLoading,
      count
    }
  }
})
</script>
