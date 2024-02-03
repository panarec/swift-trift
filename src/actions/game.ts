import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import { map } from '../lib/Map.svelte'
import _, { set } from 'lodash'
import {
    addCoordinatesToRoute,
    generateRoute,
    removeAllRoutes,
    removeRoute,
} from './routes'
import {
    checkpoints,
    markers,
    pathForMarkers,
    removeAllCheckpoint,
    removeAllMarkers,
    spawnDirectionMarker,
} from './roadDetector'
import { carMarker, finnishMarker, startMarker } from './marker'
import {
    bestScore,
    correctRouteDistance,
    lobby,
    menuState,
    totalScore,
    userRouteDistance,
} from '../lib/stores'
import {
    addToTotalScore,
    getBestScore,
    getLevel,
    getPlayerName,
    getTotalScore,
    saveBestScore,
} from './localStorage'
import { getGame } from './services'
import type { GameParams, LobbyItem, MatchObject, NodeElement } from './types'

export let markersForShortestPath: [number, number][] = []

export let startMarkerPosition: LngLat
export let finnishMarkerPosition: LngLat
export let startMarkerNode: NodeElement
export let finnishMarkerNode: NodeElement
export let loadingNextGame: boolean = false

export let carObj: mapboxgl.Marker

let startMarkerObj: Marker
let finnishMarkerObj: Marker

export async function generateGame(
    gameParams: GameParams,
    playerColor?: string
) {
    lobby.update((lobbyItem) => {
        return {
            ...lobbyItem,
            game: {
                gameOptions: lobbyItem.game.gameOptions,
                gameParams,
            },
        }
    })
    menuState.set('')
    await resetGame()

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
            'line-color': playerColor ? `#${playerColor}` : '#FF9F1C',
            'line-width': 15,
            'line-opacity': 0.8,
        },
        {
            'line-sort-key': 0,
            'line-cap': 'round',
            'line-join': 'round',
        }
    )
    checkpoints.push([startMarkerPosition.lng, startMarkerPosition.lat])
    pathForMarkers.push([startMarkerPosition.lng, startMarkerPosition.lat])
    const mapContainer = document.querySelector('#map') as HTMLElement

    if (mapContainer) {
        mapContainer.style.pointerEvents = 'none'
    }
    map.fitBounds(markersBounds, {
        padding: 100,
        pitch: 20,
        bearing: 0,
        speed: 2,
    }).once('zoomend', async () => {
        mapContainer.style.pointerEvents = 'auto'

        menuState.set('duelGameUI')
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
    removeAllRoutes()
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

export const getGameParams = async () => {
    let gameParams: GameParams
    try {
        menuState.set('loadingGame')
        const currentLevel = getLevel()
        gameParams = await getGame(currentLevel)
        return gameParams
    } catch (e) {
        throw new Error((e as Error).message)
    } finally {
        menuState.set('')
    }
}

export const duelGameFinnished = async (
    finalRoute: MatchObject,
    currentLobby: LobbyItem
) => {
    lobby.set(currentLobby)
    const player = currentLobby.players.find(
        (player) => player.playerName === getPlayerName()
    )

    const playerDistance = Math.round(player?.distance ?? 0)
    const finalRouteDistance = Math.round(finalRoute.distance)

    userRouteDistance.set(playerDistance)
    correctRouteDistance.set(finalRouteDistance)

    if (playerDistance === finalRouteDistance) {
        addToTotalScore(finalRouteDistance)
        const savedTotalScore = getTotalScore()
        totalScore.set(savedTotalScore)

        const bestTotalScore = getBestScore()
        if (!bestTotalScore || bestTotalScore < savedTotalScore) {
            bestScore.set(savedTotalScore)
            saveBestScore(savedTotalScore)
        }
    }

    removeAllRoutes()
    menuState.set('')
    await generateRoute(
        [finalRoute.geometry.coordinates[0]],
        'correctRoute',
        {
            'line-color': '#00B865',
            'line-width': 20,
            'line-opacity': 1,
        },
        {
            'line-join': 'round',
            'line-cap': 'round',
            'line-sort-key': 0,
        }
    )
    const markersBounds = new mapboxgl.LngLatBounds()
    finalRoute.geometry.coordinates.forEach((coord) =>
        markersBounds.extend([coord[0], coord[1]])
    )
    currentLobby.players.forEach((player, index) => {
        if (player.routeCoordinates.length === 0) return
        player.routeCoordinates.forEach((coord) => {
            markersBounds.extend([coord[0], coord[1]])
        })
        generateRoute(
            player.routeCoordinates,
            index.toString(),
            {
                'line-color': `#${player.color}`,
                'line-width': 15,
                'line-dasharray': [
                    1 - index,
                    currentLobby.players.length - 1,
                    index,
                ],
                'line-opacity': 0.8,
            },
            {
                'line-sort-key': 1,
            }
        )
    })

    const routesIDs = map.getStyle().layers.map((layer) => layer.id)

    map.fitBounds(markersBounds, {
        padding: 100,
        pitch: 0,
        bearing: 0,
    }).once('zoomend', async () => {
        await addCoordinatesToRoute(
            finalRoute.geometry.coordinates,
            2000,
            'correctRoute',
            []
        )
    })

    await Promise.all(
        currentLobby.players.map(async (player, index) => {
            if (player.routeCoordinates.length === 0) return
            await addCoordinatesToRoute(
                player.routeCoordinates,
                2000,
                index.toString(),
                []
            )
        })
    )
}
