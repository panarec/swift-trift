import io, { Socket } from 'socket.io-client'
import { lobby, menuState } from '../lib/stores'
import type {
    GameOptions,
    GameParams,
    LobbyItem,
    MatchObject,
    PlayerItem,
} from './types'
import { duelGameFinnished, generateGame } from './game'
import { lobbyTimer } from './helper'

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
        lobbyTimer.stop()
        menuState.set('loadingGame')
    })
}
export const createLobby = async (playerName: string) => {
    if (!socket) await createSocketConnection()

    const createLobbyCallback = (lobbyItem: LobbyItem) => {
        menuState.set('duelLobby')
        lobby.set(lobbyItem)
    }

    socket.emit('create-lobby', playerName, createLobbyCallback)
}

export const joinLobby = async (lobbyNumber: string, playerName: string) => {
    if (!socket) await createSocketConnection()

    const joinLobbyCallback = (lobbyItem: LobbyItem) => {
        if (lobbyItem) {
            sessionStorage.setItem('lobbyNumber', lobbyNumber)
            menuState.set('duelLobby')
            lobby.set(lobbyItem)
            return
        } 
        alert(`Lobby ${lobbyNumber} does not exist`)
    }

    socket.emit('join-lobby', lobbyNumber, playerName, joinLobbyCallback)
}

export const leaveLobby = async (lobbyNumber: string) => {
    socket.emit('leave-lobby', lobbyNumber, () => {
        sessionStorage.removeItem('lobbyNumber')
        menuState.set('duelMenu')
    })
}

export const readyUp = async (playerStatus: boolean, lobbyNumber: string) => {
    socket.emit('game-ready', playerStatus, lobbyNumber)
}

export const finnishLevel = async (
    lobbyNumber: string,
    routeCoordinates: [number, number][],
    time: number
) => {
    socket.emit('finnish-level', lobbyNumber, routeCoordinates, time)
}

export const changeLobbySettings = async (
    lobbyNumber: string,
    lobbySettings: GameOptions
) => {
    socket.emit('change-lobby-options', lobbyNumber, lobbySettings)
}
