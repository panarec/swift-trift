import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import { map } from '../lib/Map.svelte'
import _, { set } from 'lodash'
import { addCoordinatesToRoute, generateRoute, removeAllRoutes } from './routes'
import {
    checkpoints,
    markers,
    pathForMarkers,
    removeAllCheckpoint,
    removeAllMarkers,
    spawnDirectionMarker,
} from './roadDetector'
import {
    orangeScooterMarker,
    finnishMarker,
    startMarker,
    orangeVanMarker,
    blueVanMarker,
    redVanMarker,
    greenVanMarker,
    purpleVanMarker,
} from './marker'
import {
    bestDuelScore,
    correctRouteDistance,
    lobby,
    menuState,
    totalDuelScore,
    userRouteDistance,
} from '../lib/stores'
import {
    addToTotalDuelScore,
    getBestDuelScore,
    getLevel,
    getPlayerName,
    getTotalDuelScore,
    increaseDuelGamesPlayed,
    saveBestDuelScore,
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

const vanColorMapper = new Map()

vanColorMapper.set('FF9F1C', orangeVanMarker)
vanColorMapper.set('3772FF', blueVanMarker)
vanColorMapper.set('DF2935', redVanMarker)
vanColorMapper.set('00BF63', greenVanMarker)
vanColorMapper.set('CD38FF', purpleVanMarker)

export async function generateGame(
    gameParams: GameParams,
    playerColor?: string
) {
    await resetGame()
    const gameMode = sessionStorage.getItem('gameMode')
    if (gameMode === 'duel') {
        lobby.update((lobbyItem) => {
            return {
                ...lobbyItem,
                game: {
                    gameOptions: lobbyItem.game.gameOptions,
                    gameParams,
                },
            }
        })
        carObj = vanColorMapper.get(playerColor ?? 'FF9F1C')()
    } else {
        carObj = orangeScooterMarker()
    }

    menuState.set('')

    startMarkerPosition = gameParams.startMarkerPosition
    finnishMarkerPosition = gameParams.finnishMarkerPosition
    startMarkerNode = gameParams.startMarkerNode
    finnishMarkerNode = gameParams.finnishMarkerNode

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

        if (gameMode === 'duel') {
            menuState.set('duelGameUI')
        } else {
            menuState.set('gameUI')
        }
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
    increaseDuelGamesPlayed()
    const player = currentLobby.players.find(
        (player) => player.playerName === getPlayerName()
    )

    const playerDistance = Math.round(player?.distance ?? 0)
    const finalRouteDistance = Math.round(finalRoute.distance)

    userRouteDistance.set(playerDistance)
    correctRouteDistance.set(finalRouteDistance)

    if (playerDistance === finalRouteDistance) {
        addToTotalDuelScore(finalRouteDistance)
        const savedTotalScore = getTotalDuelScore()
        totalDuelScore.set(savedTotalScore)

        const bestTotalScore = getBestDuelScore()
        if (!bestTotalScore || bestTotalScore < savedTotalScore) {
            bestDuelScore.set(savedTotalScore)
            saveBestDuelScore(savedTotalScore)
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

    map.fitBounds(markersBounds, {
        padding: 100,
        pitch: 0,
        bearing: 0,
    }).once('zoomend', async () => {
        await Promise.all([
            currentLobby.players.map(async (player, index) => {
                if (player.routeCoordinates.length === 0) return
                await addCoordinatesToRoute(
                    player.routeCoordinates,
                    2000,
                    index.toString(),
                    []
                )
            }),
            addCoordinatesToRoute(
                finalRoute.geometry.coordinates,
                2000,
                'correctRoute',
                []
            ),
        ])
    })
}
