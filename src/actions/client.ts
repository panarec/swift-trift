export const sendPostRequest = async (body: object, uri: string) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    const url = "https://mapbox-svelte-server-test.up.railway.app:3000"

    const response = await fetch(url + uri, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}
