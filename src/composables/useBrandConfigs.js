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

  return {
    getDefaultBrandColor,
    setBrandColors
  }
}
