import type { LngLat } from 'mapbox-gl'

export type CoordinatesList = [[number, number]]

export type MatchObject = {
    confidence: number
    weight_name: string
    weight: number
    duration: number
    distance: number
    legs: Leg[]
    geometry: GeoJSON.LineString
}
export type Leg = {
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

export type GameParams = {
    startMarkerPosition: LngLat
    finnishMarkerPosition: LngLat
    startMarkerNode: NodeElement
    finnishMarkerNode: NodeElement
    availableDirections: NodeElement[]
}
export type MoveResponse = {
    routeCoordinates: MatchObject
    availableDirections: NodeElement[]
}

export type FinnishResponse = {
    userRoute: GeoJSON.Position[]
    userRouteDistance: number
    correctRoute: GeoJSON.Position[]
    correctRouteDistance: number
}

export type NodeElement = {
    id: number
    lat: number
    lon: number
    tags: any
    type: string
}

export type RoadElement = {
    geometry: {
        lat: number
        lon: number
    }[]
    id: number
    nodes: number[]
    tags: any
    type: string
}
