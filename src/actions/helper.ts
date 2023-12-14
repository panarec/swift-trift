import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import { type NodeElement } from './overpass'

export const getRandomFloatNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}

export function haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    lat1 = lat1 * (Math.PI / 180)
    lon1 = lon1 * (Math.PI / 180)
    lat2 = lat2 * (Math.PI / 180)
    lon2 = lon2 * (Math.PI / 180)

    const earthRadius = 6371

    const dlon = lon2 - lon1
    const dlat = lat2 - lat1
    const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadius * c

    return distance
}

export function isPointInsideCircle(
    pointLat: number,
    pointLon: number,
    circleCenterLat: number,
    circleCenterLon: number,
    radius: number
) {
    const distance = haversine(
        pointLat,
        pointLon,
        circleCenterLat,
        circleCenterLon
    )
    return distance / 100 <= radius
}

export function calculateCenterPoint(point1: LngLat, point2: LngLat) {
    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * point1.lat) / 180
    const radLon1 = (Math.PI * point1.lng) / 180
    const radLat2 = (Math.PI * point2.lat) / 180
    const radLon2 = (Math.PI * point2.lng) / 180

    // Calculate the center latitude and longitude in radians
    const centerLat = (radLat1 + radLat2) / 2
    const centerLon = (radLon1 + radLon2) / 2

    // Convert the center latitude and longitude back to degrees
    const centerLatDegrees = (centerLat * 180) / Math.PI
    const centerLonDegrees = (centerLon * 180) / Math.PI

    return new mapboxgl.LngLat(centerLonDegrees, centerLatDegrees)
}

export function normalizeLngLat(coordinate: LngLat) {
    let longitude
    if (coordinate.lng > 180) {
        longitude = coordinate.lng - 360
    }
    if (coordinate.lng < -180) {
        longitude = coordinate.lng + 360
    } else longitude = coordinate.lng
    return new LngLat(longitude, coordinate.lat)
}

export function getPointsBetweenCoordinates(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    numPoints: number
) {
    const points = []

    for (let i = 0; i < numPoints; i++) {
        const fraction = i / (numPoints - 1)
        const lat = startLat + fraction * (endLat - startLat)
        const lng = startLng + fraction * (endLng - startLng)
        points.push({ lat, lng })
    }

    return points
}

export function getBoundsOfNodeWithRadius(node: NodeElement, radius: number) {
    const bounds = new LngLat(node.lon, node.lat).toBounds(radius)
    return bounds
}
