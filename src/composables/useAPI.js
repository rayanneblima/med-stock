import useSupabase from 'src/boot/supabase'
import useAuthUser from './useAuthUser'

export default function useAPI () {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()

  const list = async (table, select) => {
    const { data, error } = await supabase
      .from(table)
      .select(select || '*')

    if (error) throw error
    return data
  }

  const publicList = async (table, userId) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)

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

  return {
    list,
    publicList,
    getById,
    post,
    update,
    remove,
    getPublicURL,
    uploadImg
  }
}
