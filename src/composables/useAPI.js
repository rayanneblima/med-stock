import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import useSupabase from 'src/boot/supabase'
import useAuthUser from './useAuthUser'
import useBrandConfigs from './useBrandConfigs'

const storeConfigs = ref({
  name: '',
  logo_url: '',
  parallax_url: '',
  whatsapp_number: '',
  primary_color: '',
  secondary_color: ''
})

export default function useAPI () {
  const route = useRoute()
  const { supabase } = useSupabase()
  const { user } = useAuthUser()
  const { setBrandColors } = useBrandConfigs()

  const $q = useQuasar()

  const list = async (table, select) => {
    const { data, error } = await supabase
      .from(table)
      .select(select || '*')

    if (error) throw error
    return data
  }

  const publicList = async (table, columnFilter = '', filterValue = '') => {
    const userId = route.params.userId || user?.value?.id

    if (userId) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .eq(columnFilter, filterValue)

      if (error) throw error
      return data
    }
  }

  const fetchCount = async (table) => {
    const userId = user?.value?.id

    if (userId) {
      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)

      if (error) throw error
      return {
        data,
        count
      }
    }
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)

    if (error) throw error
    return data[0]
  }

  const getByUserId = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.value.id || id)

    if (error) throw error
    return data[0]
  }

  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form,
          user_id: user.value.id
        }
      ])

    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({
        ...form
      })
      .match({ id: form.id })

    if (error) throw error
    return data
  }

  const upsert = async (table, form) => {
    const { id, ...restForm } = form

    const { data, error } = await supabase
      .from(table)
      .upsert({
        ...(!!form.id && { id: form.id }),
        ...restForm,
        user_id: user.value.id
      }, { onConflict: 'id' })

    if (error) throw error
    return data
  }

  const remove = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id })

    if (error) throw error
    return data
  }

  const getPublicURL = async (fileName, storage) => {
    const { publicURL, error } = await supabase
      .storage
      .from(storage)
      .getPublicUrl(fileName)

    if (error) throw error
    return publicURL
  }

  const uploadImg = async (file, storage) => {
    const fileName = crypto.randomUUID()

    const { error } = await supabase
      .storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    const publicURL = await getPublicURL(fileName, storage)

    if (error) throw error
    return publicURL
  }

  const setStoreConfigs = async () => {
    const userId = route.params.userId || user?.value?.id

    $q.loading.show()

    if (userId) {
      const { data, error } = await supabase
        .from('stores_config')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error

      if (data.length) {
        storeConfigs.value = data[0]
        setBrandColors({
          primary: storeConfigs.value.primary_color,
          secondary: storeConfigs.value.secondary_color
        })
      }
    }

    $q.loading.hide()
  }

  return {
    list,
    publicList,
    fetchCount,
    getById,
    getByUserId,
    post,
    update,
    upsert,
    remove,
    getPublicURL,
    uploadImg,
    storeConfigs,
    setStoreConfigs
  }
}
