export const sendPostRequest = async (body: object, uri: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const url =
        import.meta.env.VITE_SERVER_NODE_ENV === 'development'
            ? import.meta.env.VITE_SERVER_HTTP_URL + uri
            : uri

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}
