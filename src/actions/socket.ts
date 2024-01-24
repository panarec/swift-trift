import io, { Socket } from 'socket.io-client'
import { lobby, menuState } from '../lib/stores'
import type { GameParams, LobbyItem, MatchObject, PlayerItem } from './types'
import { duelGameFinnished, generateGame } from './game'

let socket: Socket

export const createSocketConnection = async () => {
    socket = io(import.meta.env.VITE_SERVER_WS_URL as string)
    socket.onAny((event) => {
        console.log(event)
    })
    socket.on('lobby-change', (lobbyItem: LobbyItem) => {
        lobby.set(lobbyItem)
    })
    socket.on('game-start', (gameParams: GameParams) => {
        let playerColor: string | undefined
        lobby.subscribe((lobbyItem) => {
            if (lobbyItem) {
                playerColor = lobbyItem.players.find(
                    (player) => player.socketId === socket.id
                )?.color
            }
        })

        generateGame(gameParams, playerColor as string)
    })
    socket.on(
        'game-finnished',
        ({
            finalRoute,
            currentLobby,
        }: {
            finalRoute: MatchObject
            currentLobby: LobbyItem
        }) => {
            duelGameFinnished(finalRoute, currentLobby)
        }
    )
    socket.on('all-ready', () => {
        menuState.set('loadingGame')
    })
}

export const joinLobby = async (lobbyNumber: string, playerName: string) => {
    sessionStorage.setItem('lobbyNumber', lobbyNumber)

    if (!socket) await createSocketConnection()

    const joinLobbyCallback = (lobbyItem: LobbyItem) => {
        menuState.set('duelRoom')
        lobby.set(lobbyItem)
    }

    socket.emit('join-lobby', lobbyNumber, playerName, joinLobbyCallback)
}

export const leaveLobby = async () => {
    socket.emit('leave-lobby', () => {
        menuState.set('duelMenu')
    })
}

export const readyUp = async (playerStatus: boolean) => {
    const options = {
        levelsPerGame: 2,
        timeLimit: 60,
    }

    const gameReadyCallback = (lobbyItem: LobbyItem) => {
        lobby.set(lobbyItem)
        return lobbyItem
    }

    socket.emit('game-ready', playerStatus, options, gameReadyCallback)
}

export const finnishLevel = async (routeCoordinates: [number, number][]) => {
    socket.emit('finnish-level', routeCoordinates)
}

export const changeLobbySettings = async (lobbySettings: {
    levelsPerGame: number
    timeLimit: number
}) => {
    socket.emit('change-lobby-options', lobbySettings)
}
