
export function useMessagesAPI() {
  const { get, post, del } = useApi()

  /**
   * Fetch all messages (optionally with query params)
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async function fetchMessages(params = {}) {
    const response = await get('/messages', { params })
    return response.data
  }

  /**
   * Send (create) a new message
   * @param {Object} data
   * @returns {Object}
   */
  async function sendMessage(data) {
    const response = await post('/messages', data)
    return response.data
  }
  
  /**
   * Delete a message
   * @param {Number} id
   * @returns {Number}
   */
  async function deleteMessage(id) {
    const response = await del(`/messages/${id}`)
    return response.status
  }


  return {
    fetchMessages,
    sendMessage,
    deleteMessage,
  }
}