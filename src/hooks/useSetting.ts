import { SettingContext } from '../provider/Setting'
import { useContext } from 'react'

const useSetting = () => {
  return useContext(SettingContext)
}

export default useSetting
