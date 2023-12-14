import {
    type AnySourceData,
    type LineLayer,
    type LineLayout,
    type LinePaint,
    LngLat,
} from 'mapbox-gl'
import anime from 'animejs/lib/anime.es.js'
import { carObj } from './game'
import { type NodeElement } from './overpass'
import _ from 'lodash'
import { map } from '../lib/Map.svelte'
import { menuState } from '../lib/stores'

export async function generateRoute(
    startCoordinate: GeoJSON.Position[],
    id: string,
    paint: LinePaint,
    layout: LineLayout
) {
    const geometry: GeoJSON.Geometry = {
        type: 'LineString',
        coordinates: startCoordinate,
    }
    const geojson: AnySourceData = {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: geometry,
        },
    }
    map.addSource(id, geojson)
    const layer: LineLayer = {
        id,
        type: 'line',
        source: id,
        layout,
        paint,
    }
    map.addLayer(layer)
}
export function removeRoute(routeId: string) {
    if (map.getLayer(routeId)) {
        map.removeLayer(routeId)
        map.removeSource(routeId)
    }
}
export async function addCoordinatesToRoute(
    routeCoordinates,
    duration: number,
    sourceId: string,
    pathForMarkers: [number, number][],
    lastCoord?: NodeElement
) {
    let startTime = performance.now()

    const totalDistance = routeCoordinates.reduce((prev, current, index) => {
        let distance = 0
        if (index < routeCoordinates.length - 1) {
            distance = new LngLat(current[0], current[1]).distanceTo(
                new LngLat(
                    routeCoordinates[index + 1][0],
                    routeCoordinates[index + 1][1]
                )
            )
        }
        return prev + distance
    }, 0)
    let iterations = routeCoordinates.length - 1
    let currentIteration = 0

    function animate(currentTime) {
        if (currentIteration < iterations) {
            const elapsedTime = currentTime - startTime
            const startLng = routeCoordinates[currentIteration][0]
            const startLat = routeCoordinates[currentIteration][1]
            const endLng = routeCoordinates[currentIteration + 1][0]
            const endLat = routeCoordinates[currentIteration + 1][1]
            const distance = new LngLat(startLng, startLat).distanceTo(
                new LngLat(endLng, endLat)
            )
            const timePeriod = distance / totalDistance
            const progress = Math.min(elapsedTime / (duration * timePeriod), 1)
            const currentLng = startLng + (endLng - startLng) * progress
            const currentLat = startLat + (endLat - startLat) * progress
            pathForMarkers.push([currentLng, currentLat])
            if (sourceId === 'userRoute') {
                carObj.setLngLat([currentLng, currentLat]).addTo(map)
            }
            const geometry: GeoJSON.LineString = {
                type: 'LineString',
                coordinates: pathForMarkers,
            }
            const geojson: GeoJSON.GeoJSON = {
                type: 'Feature',
                properties: {},
                geometry: geometry,
                id: sourceId,
            }
            // @ts-ignore
            map.getSource(sourceId).setData(geojson)
            if (progress < 1) {
                requestAnimationFrame(animate)
                return
            } else {
                currentIteration += 1
                requestAnimationFrame(animate)
                startTime = performance.now()
                return
            }
        }
        anime({
            targets: '.carMarker',
            rotate: 0,
        })
        if(sourceId === "userRoute"){pathForMarkers.push([lastCoord.lon, lastCoord.lat])}
        if(sourceId === "correctRoute"){
            menuState.set('levelCompleted')
        }
        return
    }

    requestAnimationFrame(animate)
}

export async function removeCoordinatesFromRoute(
    duration: number,
    sourceId: string,
    pathForMarkers: [number, number][],
    toCoord?: [number, number]
) {
    let startTime = performance.now()
    const foundIndex = _.findLastIndex(
        pathForMarkers,
        (marker) => marker[0] === toCoord[0] && marker[1] === toCoord[1]
    )
    function animate(currentTime) {
        const lastActual = _.last(pathForMarkers)
        const currentLng = lastActual[0]
        const currentLat = lastActual[1]
        if (toCoord[0] !== currentLat && toCoord[1] !== currentLng) {
            const elapsedTime = currentTime - startTime
            const progress = Math.min(elapsedTime / duration, 1)

            pathForMarkers.pop()
            if (sourceId === 'userRoute') {
                carObj.setLngLat(lastActual).addTo(map)
            }
            const geometry: GeoJSON.LineString = {
                type: 'LineString',
                coordinates: pathForMarkers,
            }
            const geojson: GeoJSON.GeoJSON = {
                type: 'Feature',
                properties: {},
                geometry: geometry,
                id: sourceId,
            }
            // @ts-ignore
            map.getSource(sourceId).setData(geojson)
            if (progress < 1) {
                requestAnimationFrame(animate)
                return
            }
            const lastRemained = _.last(pathForMarkers)
            if (
                lastRemained[0] !== toCoord[0] &&
                lastRemained[1] !== toCoord[1]
            ) {
                pathForMarkers = _.slice(pathForMarkers, 0, foundIndex + 1)
                carObj.setLngLat(_.last(pathForMarkers)).addTo(map)
                const geometry: GeoJSON.LineString = {
                    type: 'LineString',
                    coordinates: pathForMarkers,
                }
                const geojson: GeoJSON.GeoJSON = {
                    type: 'Feature',
                    properties: {},
                    geometry: geometry,
                    id: sourceId,
                }
                // @ts-ignore
                map.getSource(sourceId).setData(geojson)
            }
        } else {
            if (sourceId === 'userRoute') {
                carObj.setLngLat(lastActual).addTo(map)
            }
            const geometry: GeoJSON.LineString = {
                type: 'LineString',
                coordinates: pathForMarkers,
            }
            const geojson: GeoJSON.GeoJSON = {
                type: 'Feature',
                properties: {},
                geometry: geometry,
                id: sourceId,
            }
            // @ts-ignore
            map.getSource(sourceId).setData(geojson)
        }
        anime({
            targets: '.carMarker',
            rotate: 0,
        })
        return
    }

    requestAnimationFrame(animate)
}
