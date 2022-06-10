import { useQuasar } from 'quasar'

export default function useNotify () {
  const $q = useQuasar()

  $q.notify.setDefaults({
    position: 'top-right',
    timeout: 2500
  })

  const notifyDefault = (message) => {
    $q.notify({
      color: 'gray',
      message: message || '',
      html: true
    })
  }

  const notifySuccess = (message) => {
    $q.notify({
      type: 'positive',
      message: message || 'Ok!',
      html: true
    })
  }

  const notifyError = (message) => {
    $q.notify({
      type: 'negative',
      message: message || 'Falhou!',
      html: true
    })
  }

  return {
    notifyDefault,
    notifySuccess,
    notifyError
  }
}
