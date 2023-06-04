import { getCssVar, setCssVar } from 'quasar'

export default function useBrandConfigs () {
  const getDefaultBrandColor = (type) => {
    return getCssVar(type) || '#FFFFFF'
  }

  const setBrandColors = (colors) => {
    Object.entries(colors).forEach(([key, value]) => {
      setCssVar(key, value)
    })
  }

  const resetBrandColors = () => {
    setCssVar('primary', '#0e7ba8')
    setCssVar('primary', '#3dcdd4')
  }

  return {
    getDefaultBrandColor,
    setBrandColors,
    resetBrandColors
  }
}
