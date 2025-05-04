import { useNuxtApp } from '#app'

export const useApi = () => {
  const { $axios } = useNuxtApp()

  const get = (url, config = {}) => $axios.get('/api' + url, config)
  const post = (url, data, config = {}) => $axios.post('/api' + url, data, config)

  return { get, post }
}