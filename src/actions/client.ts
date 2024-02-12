export const sendPostRequest = async (body: object, uri: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    const url = process.env.VITE_SERVER_HTTP_URL

    const response = await fetch(url + uri, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}
