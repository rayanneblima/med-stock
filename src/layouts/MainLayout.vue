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
          <span class="text-bold" v-if="storeConfigs.name"> - {{storeConfigs.name}}</span>
        </q-toolbar-title>

        <ThemeToggle />

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
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'
import useAPI from 'src/composables/useAPI'
import EssentialLink from 'components/EssentialLink.vue'
import ThemeToggle from 'components/ThemeToggle.vue'

const linksList = [
  {
    title: 'Home',
    caption: '',
    icon: 'mdi-home-outline',
    routeName: 'home'
  },
  {
    title: 'Categorias',
    caption: '',
    icon: 'mdi-shape-outline',
    routeName: 'categories'
  },
  {
    title: 'Produtos',
    caption: '',
    icon: 'mdi-archive',
    routeName: 'products'
  },
  {
    title: 'Configurações',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'configurations'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    ThemeToggle
  },

  setup () {
    const router = useRouter()
    const { logout } = useAuthUser()
    const { notifyDefault } = useNotify()
    const { storeConfigs, setStoreConfigs } = useAPI()

    const $q = useQuasar()

    const leftDrawerOpen = ref(false)

    onMounted(() => {
      setStoreConfigs()
    })

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
      storeConfigs,
      onLogout
    }
  }
})
</script>
