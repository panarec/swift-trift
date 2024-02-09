export const sendPostRequest = async (body: object, uri: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    const url = import.meta.env.VITE_SERVER_HTTP_URL
    const httpPort = import.meta.env.VITE_SERVER_HTTP_PORT

    const response = await fetch(url + ':' + httpPort + uri, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}
