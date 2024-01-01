const BASE_URL = 'http://localhost:3000/' // TODO

export const sendPostRequest = async (body: object, uri: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    const response = await fetch(BASE_URL + uri, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}
