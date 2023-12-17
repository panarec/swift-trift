import { type Coordinates } from '@mapbox/mapbox-sdk/lib/classes/mapi-request'

type MappingObject = {
    matchings: MatchObject[]
    tracepoints: Tracepoint[]
    code: 'Ok'
    uuid: string
}

type Tracepoint = {
    matchings_index: number
    waypoint_index: number
    alternatives_count: number
    distance: number
    name: string
    location: Coordinates
}

type MatchObject = {
    confidence: number
    weight_name: string
    weight: number
    duration: number
    distance: number
    legs: Leg[]
    geometry: GeoJSON.LineString
}
type Leg = {
    via_waypoints: []
    admins: [
        {
            iso_3166_1_alpha3: string
            iso_3166_1: string
        },
    ]
    weight: number
    duration: number
    steps: []
    distance: number
    summary: string
}
export async function getRouteCoordinates(
    routePath: number[][]
): Promise<MatchObject> {
    const reqCoordinates = routePath.join(';')
    const radiuses = routePath.map((coor) => '1').join(';')
    const response = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/driving/${reqCoordinates}?geometries=geojson&ignore=oneways,restrictions&radiuses=${radiuses}&access_token=pk.eyJ1IjoicGFuYXJlYyIsImEiOiJja3ZjZXBmMDAwNHlqMzBuM2lrZTQ4MDhmIn0.XLnuvSXKToRxsVNR0WHaKg`
    )
    const coords: MappingObject = await response.json()
    return coords.matchings[0]
}
