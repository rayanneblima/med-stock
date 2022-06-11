<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar Estoque
        </q-toolbar-title>

        <q-btn-dropdown flat icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section class="row items-center">
                <q-item-label class="flex items-center">
                  <q-icon name="logout" class="q-mr-sm" />
                  <span>Sair</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const linksList = [
  {
    title: 'Home',
    caption: '',
    icon: 'mdi-home-outline',
    routeName: 'me'
  },
  {
    title: 'Categorias',
    caption: '',
    icon: 'mdi-shape-outline',
    routeName: 'categories'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const router = useRouter()
    const { logout } = useAuthUser()
    const { notifyDefault } = useNotify()

    const $q = useQuasar()

    const leftDrawerOpen = ref(false)

    const onLogout = async () => {
      $q.dialog({
        title: 'Sair',
        message: 'Você realmente deseja sair?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await logout()
        notifyDefault('Até breve!')
        router.replace({ name: 'login' })
      })
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      onLogout
    }
  }
})
</script>
