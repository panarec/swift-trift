import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import _ from 'lodash'
import { directionMarker } from './marker'
import { map } from '../lib/Map.svelte'
import {
    addCoordinatesToRoute,
    generateRoute,
    removeCoordinatesFromRoute,
} from './routes'
import anime from 'animejs/lib/anime.es.js'
import { finnishMarkerNode, markersForShortestPath } from './game'
import {
    bestSoloScore,
    correctRouteDistance,
    userRouteDistance,
    totalSoloScore,
    menuState,
    lobby,
} from '../lib/stores'
import {
    addToTotalSoloScore,
    getBestSoloScore,
    getTotalSoloScore,
    saveBestSoloScore,
} from './localStorage'
import { finnishGame, move } from './services'
import type { NodeElement } from './types'
import { finnishLevel } from './socket'
import { gameTimer } from './helper'

export let markers: Marker[] = []
export let directionMarkers: Marker[] = []
export let pathForMarkers: [number, number][] = []
export let checkpoints: [number, number][] = []

export async function findNextCrossRoad(nodeElement: NodeElement) {
    let jumpPosition = new LngLat(nodeElement.lon, nodeElement.lat)
    removeDirectionMarkers()
    const lastCoordinateOfPath: [number, number] = _.last(
        // @ts-ignore
        map.getSource('userRoute')._data.geometry.coordinates
    ) || [0, 0]
    const response = await move(lastCoordinateOfPath, nodeElement)

    const nextCoordPoint = map.project(jumpPosition)
    const currentCoordPoint = map.project(lastCoordinateOfPath)
    const distanceBetweenPoints = jumpPosition.distanceTo(
        new LngLat(lastCoordinateOfPath[0], lastCoordinateOfPath[1])
    )
    if (currentCoordPoint.x > nextCoordPoint.x) {
        anime({
            targets: '.userMarker',
            rotate: Math.min(45, distanceBetweenPoints / 4),
        })
    } else {
        anime({
            targets: '.userMarker',
            rotate: Math.min(45, distanceBetweenPoints / 4) * -1,
        })
    }
    const lastCheckpoint = checkpoints[checkpoints.length - 2]
    if (
        lastCheckpoint &&
        lastCheckpoint[0] === jumpPosition.lng &&
        lastCheckpoint[1] === jumpPosition.lat
    ) {
        const newPathForMarkers = await removeCoordinatesFromRoute(
            300,
            'userRoute',
            pathForMarkers,
            lastCheckpoint
        )
        pathForMarkers = newPathForMarkers
        checkpoints.pop()
        response.availableDirections.forEach((junction) =>
            spawnDirectionMarker(junction)
        )
        return
    } else {
        checkpoints.push([nodeElement.lon, nodeElement.lat])
    }
    const routeCoords = response.routeCoordinates
    await addCoordinatesToRoute(
        routeCoords.geometry.coordinates,
        300,
        'userRoute',
        pathForMarkers,
        nodeElement
    )
    if (nodeElement.id === finnishMarkerNode.id) {
        await generateRoute(
            [checkpoints[0]],
            'correctRoute',
            {
                'line-color': '#00B865',
                'line-width': 20,
                'line-opacity': 0.8,
            },
            {
                'line-join': 'round',
                'line-cap': 'round',
                'line-sort-key': 0,
            }
        )
        const markersBounds = new mapboxgl.LngLatBounds()
        removeAllMarkers()

        const gameMode = sessionStorage.getItem('gameMode')

        if (gameMode === 'solo') {
            const finnishGameParams = await finnishGame(
                [markersForShortestPath[0][0], markersForShortestPath[0][1]],
                [markersForShortestPath[1][0], markersForShortestPath[1][1]],
                checkpoints
            )

            finnishGameParams.correctRoute.forEach((coord) =>
                markersBounds.extend([coord[0], coord[1]])
            )
            checkpoints.forEach((coord) => markersBounds.extend(coord))

            userRouteDistance.set(
                Math.round(finnishGameParams.userRouteDistance)
            )
            correctRouteDistance.set(
                Math.round(finnishGameParams.correctRouteDistance)
            )

            if (
                Math.round(finnishGameParams.userRouteDistance) ===
                Math.round(finnishGameParams.correctRouteDistance)
            ) {
                addToTotalSoloScore(
                    Math.round(finnishGameParams.correctRouteDistance)
                )
                const savedTotalScore = getTotalSoloScore()
                totalSoloScore.set(savedTotalScore)

                const bestTotalScore = getBestSoloScore()
                if (!bestTotalScore || bestTotalScore < savedTotalScore) {
                    bestSoloScore.set(savedTotalScore)
                    saveBestSoloScore(savedTotalScore)
                }
            }

            map.fitBounds(markersBounds, {
                padding: 100,
                pitch: 0,
                bearing: 0,
            }).once('zoomend', async () => {
                await addCoordinatesToRoute(
                    finnishGameParams.correctRoute,
                    1000,
                    'correctRoute',
                    []
                )
                return
            })
            return
        }

        if (gameMode === 'duel') {
            menuState.set('waitingForPlayers')
            triggerFinnishLevel()
            return
        }
    }
    response.availableDirections.forEach((junction) =>
        spawnDirectionMarker(junction)
    )
    return
}

export const triggerFinnishLevel = async () => {
    const lobbyNumber = sessionStorage.getItem('lobbyNumber')
    const time = gameTimer.getTotalTimeValues().seconds
    if (time > 0) {
        gameTimer.stop()
    }
    // @ts-ignore
    finnishLevel(lobbyNumber, checkpoints, time)
}

function removeDirectionMarkers() {
    directionMarkers.forEach((marker) => {
        anime({
            targets: ['.circle', '.ringring'],
            width: '0px',
            height: '0px',
            opacity: 0,
        }).finished.then(() => marker.remove())
    })
}

export function removeAllCheckpoint() {
    checkpoints = []
}

export function removeAllMarkers() {
    markers.forEach((marker) => {
        marker.remove()
    })
    markers = []
    directionMarkers.forEach((marker) => {
        marker.remove()
    })
    directionMarkers = []
    pathForMarkers = []
}

export function spawnDirectionMarker(nodeElement: NodeElement) {
    const nodeCoordinates = new LngLat(nodeElement.lon, nodeElement.lat)
    const directionMarkerObj = directionMarker(nodeElement)
        .setLngLat(nodeCoordinates)
        .addTo(map)
    directionMarkers.push(directionMarkerObj)
}
