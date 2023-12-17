import mapboxgl, { LngLat, LngLatBounds, Marker } from 'mapbox-gl'
import anime from 'animejs/lib/anime.es.js'
import {
    type NodeElement,
    type OverpassResponse,
    getRandomCity,
    getRoadsAroundPoint,
    queryCityById,
} from './overpass'
// @ts-ignore
import { map } from '../lib/Map.svelte'
import { getBoundsOfNodeWithRadius } from './helper'
import _ from 'lodash'
import { generateRoute, removeRoute } from './routes'
import {
    checkpoints,
    getAvailableDirections,
    markers,
    pathForMarkers,
    removeAllCheckpoint,
    removeAllMarkers,
} from './roadDetector'
export let preHeatedParams: PreHeatedParams
import { carMarker, finnishMarker, startMarker } from './marker'
import { menuState } from '../lib/stores'
import { getLevel } from './localStorage'

export let markersForShortestPath: [number, number][] = []

export let startMarkerPosition: LngLat = new LngLat(0, 0)
export let finnishMarkerPosition: LngLat = new LngLat(0, 0)
export let startMarkerNode: NodeElement | null
export let finnishMarkerNode: NodeElement | null
export let loadingNextGame: boolean = false

export let carObj: mapboxgl.Marker

let startMarkerObj: Marker
let finnishMarkerObj: Marker

type PreHeatedParams = {
    startMarkerPosition: LngLat
    finnishMarkerPosition: LngLat
    startMarkerNode: NodeElement
    finnishMarkerNode: NodeElement
}

const getStartMarkerNode = async (
    node: NodeElement,
    bounds: LngLatBounds
): Promise<NodeElement | null> => {
    let loading: boolean = true

    const north = bounds.getNorth()
    const south = bounds.getSouth()
    const west = bounds.getWest()
    const east = bounds.getEast()

    let roads: OverpassResponse<NodeElement>
    let randomJunction: NodeElement

    while (loading) {
        let randomPoints: LngLat[] = []
        for (let i = 0; i < 3; i++) {
            randomPoints.push(
                new LngLat(
                    _.random(west, east, true),
                    _.random(south, north, true)
                )
            )
        }

        roads = await getRoadsAroundPoint(randomPoints)
        if (roads.elements.length > 0) {
            loading = false
            randomJunction =
                roads.elements[_.random(0, roads.elements.length - 1)]
            return randomJunction
        }
    }
    return null
}

const getFinnishMarkerNode = async (
    startMarkerPosition: LngLat,
    maxRadius: number
): Promise<NodeElement> => {
    let loading: boolean = true
    const currentLevel = getLevel()
    let minRadius = 0.002 + (currentLevel - 1) / 10000
    const minimumBounds = startMarkerPosition.toBounds(minRadius)
    let roads: OverpassResponse<NodeElement>
    let finnishNode: NodeElement = {
        id: 0,
        lat: 0,
        lon: 0,
        tags: undefined,
        type: '',
    }
    let points = []
    while (loading) {
        for (let i = 0; i < 360; i++) {
            points.push(
                new LngLat(
                    minRadius * Math.sin(i) * 1.3 + startMarkerPosition.lng,
                    minRadius * Math.cos(i) + startMarkerPosition.lat
                )
            )
        }
        roads = await getRoadsAroundPoint(points)
        if (roads.elements.length > 0) {
            loading = false
            const foundNode: NodeElement =
                roads.elements[_.random(0, roads.elements.length - 1)]
            if (
                foundNode.lat !== startMarkerPosition.lat &&
                foundNode.lon !== startMarkerPosition.lng
            ) {
                finnishNode = foundNode
            }
        } else {
            minRadius += 0.0001
        }
    }

    return finnishNode
}

export async function preheatGame() {
    loadingNextGame = true
    const randomCityId = await getRandomCity()
    const randomCityMetadata = await queryCityById(randomCityId)
    const cityNode = randomCityMetadata.elements[0]
    const maxRadius = cityNode.tags.population
        ? cityNode.tags.population / 60
        : 1000
    const bounds = getBoundsOfNodeWithRadius(cityNode, maxRadius)

    startMarkerNode = await getStartMarkerNode(
        randomCityMetadata.elements[0],
        bounds
    )
    const startMarkerPosition = new LngLat(
        startMarkerNode.lon,
        startMarkerNode.lat
    )

    const finnishMarkerNode = await getFinnishMarkerNode(
        startMarkerPosition,
        maxRadius
    )
    let finnishMarkerPosition: LngLat
    if (finnishMarkerNode) {
        finnishMarkerPosition = new LngLat(
            finnishMarkerNode.lon,
            finnishMarkerNode.lat
        )
    }

    loadingNextGame = false
    preHeatedParams = {
        startMarkerPosition,
        finnishMarkerPosition,
        startMarkerNode,
        finnishMarkerNode,
    }
}

export async function generateGame() {
    await resetGame()

    startMarkerPosition = preHeatedParams.startMarkerPosition
    finnishMarkerPosition = preHeatedParams.finnishMarkerPosition
    startMarkerNode = preHeatedParams.startMarkerNode
    finnishMarkerNode = preHeatedParams.finnishMarkerNode

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
        getAvailableDirections(startMarkerNode)
        markersForShortestPath.push([
            +startMarkerPosition.lng.toFixed(6),
            +startMarkerPosition.lat.toFixed(6),
        ])
        markersForShortestPath.push([
            +finnishMarkerPosition.lng.toFixed(6),
            +finnishMarkerPosition.lat.toFixed(6),
        ])
        await preheatGame()
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
