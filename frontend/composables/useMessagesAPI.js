
export function useMessagesAPI() {
  const { get, post } = useApi()

  /**
   * Fetch all messages (optionally with query params)
   * @param {any} params
   * @returns {Promise<any>}
   */
  async function fetchMessages( params = {}) {
    const response = await get('/messages', { params })
    return response.data
  }



  // Send (create) a new message
  const sendMessage = (data) => post('/messages', data)


  return {
    fetchMessages,
    sendMessage,
  }
}