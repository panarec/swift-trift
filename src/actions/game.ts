import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import { map } from '../lib/Map.svelte'
import _ from 'lodash'
import { generateRoute, removeRoute } from './routes'
import {
    checkpoints,
    markers,
    pathForMarkers,
    removeAllCheckpoint,
    removeAllMarkers,
    spawnDirectionMarker,
} from './roadDetector'
import { carMarker, finnishMarker, startMarker } from './marker'
import { menuState } from '../lib/stores'
import { getLevel } from './localStorage'
import { getGame } from './services'
import type { GameParams, NodeElement } from './types'

export let markersForShortestPath: [number, number][] = []

export let startMarkerPosition: LngLat
export let finnishMarkerPosition: LngLat
export let startMarkerNode: NodeElement
export let finnishMarkerNode: NodeElement
export let loadingNextGame: boolean = false

export let carObj: mapboxgl.Marker

let startMarkerObj: Marker
let finnishMarkerObj: Marker

export async function generateGame() {
    await resetGame()

    let gameParams: GameParams
    try {
        menuState.set('loading')
        const currentLevel = getLevel()
        gameParams = await getGame(currentLevel)
    } catch (e) {
        throw new Error((e as Error).message)
    } finally {
        menuState.set('')
    }

    startMarkerPosition = gameParams.startMarkerPosition
    finnishMarkerPosition = gameParams.finnishMarkerPosition
    startMarkerNode = gameParams.startMarkerNode
    finnishMarkerNode = gameParams.finnishMarkerNode

    carObj = carMarker()
    markers.push(carObj)
    const markersBounds = new mapboxgl.LngLatBounds()

    markersBounds.extend(startMarkerPosition)
    markersBounds.extend(finnishMarkerPosition)

    await generateRoute(
        [[startMarkerPosition.lng, startMarkerPosition.lat]],
        'userRoute',
        {
            'line-color': '#FF9F1C',
            'line-width': 10,
            'line-opacity': 0.8,
        },
        {
            'line-join': 'round',
            'line-cap': 'round',
            'line-sort-key': 0,
        }
    )
    await generateRoute(
        [[startMarkerPosition.lng, startMarkerPosition.lat]],
        'correctRoute',
        {
            'line-color': '#00B865',
            'line-width': 10,
            'line-opacity': 0.8,
        },
        {
            'line-join': 'round',
            'line-cap': 'round',
            'line-sort-key': 1,
        }
    )
    checkpoints.push([startMarkerPosition.lng, startMarkerPosition.lat])
    pathForMarkers.push([startMarkerPosition.lng, startMarkerPosition.lat])
    const mapContainer = document.querySelector('#map') as HTMLElement

    if (mapContainer) {
        mapContainer.style.pointerEvents = 'none'
    }
    map.fitBounds(markersBounds, {
        padding: 200,
        pitch: 20,
        bearing: 0,
        speed: 2,
    }).once('zoomend', async () => {
        mapContainer.style.pointerEvents = 'auto'
        menuState.set('gameUI')
        startMarkerObj = startMarker().setLngLat(startMarkerPosition).addTo(map)
        finnishMarkerObj = finnishMarker()
            .setLngLat(finnishMarkerPosition)
            .addTo(map)
        gameParams.availableDirections.forEach((junction) =>
            spawnDirectionMarker(junction)
        )

        markersForShortestPath.push([
            +startMarkerPosition.lng.toFixed(6),
            +startMarkerPosition.lat.toFixed(6),
        ])
        markersForShortestPath.push([
            +finnishMarkerPosition.lng.toFixed(6),
            +finnishMarkerPosition.lat.toFixed(6),
        ])
    })
}

export async function resetGame() {
    removeRoute('userRoute')
    removeRoute('correctRoute')
    if (startMarkerObj !== undefined) {
        startMarkerObj.remove()
    }
    if (finnishMarkerObj !== undefined) {
        finnishMarkerObj.remove()
    }
    removeAllMarkers()
    removeAllCheckpoint()
    markersForShortestPath = []
    if (carObj) {
        carObj.remove()
    }
}

export async function resetView() {
    const mapContainer = document.querySelector('#map') as HTMLElement

    mapContainer.style.pointerEvents = 'none'

    map.flyTo({
        zoom: 1.5, // starting zoom
        pitch: 0,
        bearing: 0,
        speed: 5,
    })
}
