import {
    type AnySourceData,
    type LineLayer,
    type LineLayout,
    type LinePaint,
    LngLat,
} from 'mapbox-gl'
import anime from 'animejs/lib/anime.es.js'
import { carObj } from './game'
import _ from 'lodash'
import { map } from '../lib/Map.svelte'
import type { NodeElement } from './types'
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

export const removeAllRoutes = () => {
    const routesIDs = map.getStyle().layers.map((layer) => layer.id)
    routesIDs.forEach((id) => {
        removeRoute(id)
    })
}

export async function addCoordinatesToRoute(
    routeCoordinates: any,
    duration: number,
    sourceId: string,
    pathForMarkers: [number, number][],
    lastCoord?: NodeElement
) {
    const totalDistance =
        getTotalDistanceFromListOfCoordinates(routeCoordinates)
    const keyframes: { lng: number; lat: number }[] = routeCoordinates.map(
        (
            coordinates: [number, number],
            index: number,
            arr: [number, number][]
        ) => {
            let frameDuration = 0
            if (index > 0) {
                const distance = new LngLat(
                    coordinates[0],
                    coordinates[1]
                ).distanceTo(new LngLat(arr[index - 1][0], arr[index - 1][1]))
                frameDuration = (distance / totalDistance) * duration
            }
            return {
                lng: coordinates[0],
                lat: coordinates[1],
                duration: frameDuration,
            }
        }
    )

    const route = keyframes[0]
    anime({
        targets: route,
        keyframes: keyframes,
        easing: 'linear',
        update: () => {
            pathForMarkers.push([route.lng, route.lat])
            if (sourceId === 'userRoute') {
                carObj.setLngLat([route.lng, route.lat]).addTo(map)
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
            //@ts-ignore
            map.getSource(sourceId).setData(geojson)
        },
    }).finished.then(() => {
        const gameMode = sessionStorage.getItem('gameMode')
        anime({
            targets: '.userMarker',
            rotate: 0,
        })
        if (sourceId === 'userRoute' && lastCoord) {
            pathForMarkers.push([lastCoord.lon, lastCoord.lat])
        }
        if (sourceId === 'correctRoute' && gameMode === 'solo') {
            menuState.set('levelCompleted')
        }
        if (sourceId === 'correctRoute' && gameMode === 'duel') {
            menuState.set('levelCompletedDuel')
        }
    })
}

export async function removeCoordinatesFromRoute(
    duration: number,
    sourceId: string,
    pathForMarkers: [number, number][],
    toCoord: [number, number]
) {
    const indexOfReturningCoordinate = _.findLastIndex(
        pathForMarkers,
        (coor) => {
            return coor[0] === toCoord[0] && coor[1] === toCoord[1]
        }
    )
    pathForMarkers = [
        ...pathForMarkers.slice(0, indexOfReturningCoordinate + 1),
    ]

    if (sourceId === 'userRoute') {
        carObj.setLngLat([toCoord[0], toCoord[1]]).addTo(map)
    }

    anime({
        targets: '#map',
        keyframes: [{ filter: 'opacity(20%)' }, { filter: 'opacity(100%)' }],
        easing: 'easeOutQuint',
        duration: 200,
        loop: 1,
    })

    anime({
        targets: '.userMarker',
        rotate: 0,
    })
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
    return pathForMarkers
}

const getTotalDistanceFromListOfCoordinates = (
    listOfCoordinates: [number, number][]
) => {
    return listOfCoordinates.reduce((prev, current, index) => {
        let distance = 0
        if (index < listOfCoordinates.length - 1) {
            distance = new LngLat(current[0], current[1]).distanceTo(
                new LngLat(
                    listOfCoordinates[index + 1][0],
                    listOfCoordinates[index + 1][1]
                )
            )
        }
        return prev + distance
    }, 0)
}
