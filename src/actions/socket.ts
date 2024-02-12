import io, { Socket } from 'socket.io-client'
import { lobby, menuState } from '../lib/stores'
import type {
    GameOptions,
    GameParams,
    LobbyItem,
    MatchObject,
    PlayerItem,
} from './types'
import { duelGameFinnished, generateGame, resetGame, resetView } from './game'
import { gameTimer, lobbyTimer } from './helper'

let socket: Socket | undefined

export const createSocketConnection = async () => {
    socket = io(import.meta.env.VITE_SERVER_WS_URL as string)
    socket.onAny((event) => {
        console.log(event)
    })
    socket.on('lobby-change', async (lobbyItem: LobbyItem) => {
        lobby.set(lobbyItem)
        console.log(lobbyItem)
        if (
            lobbyItem.players.length === 1 &&
            lobbyItem.game.gameOptions.gameStarted
        ) {
            let promises: Promise<void>[] = []
            promises.push(resetGame())
            promises.push(resetView())
            gameTimer.stop()
            await Promise.allSettled(promises)
            menuState.set('duelLobby')
            socket?.emit('change-lobby-options', lobbyItem.lobbyNumber, {
                ...lobbyItem.game.gameOptions,
                gameStarted: false,
            })
        }
    })
    socket.on('game-start', (gameParams: GameParams) => {
        let playerColor: string | undefined
        lobby.subscribe((lobbyItem) => {
            if (lobbyItem) {
                playerColor = lobbyItem.players.find(
                    (player) => player.socketId === socket?.id
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
    socket.on('disconnect', (reason) => {
        console.log(reason)
        socket = undefined
    })
}
export const createLobby = async (playerName: string) => {
    if (!socket) await createSocketConnection()

    const createLobbyCallback = (lobbyItem: LobbyItem) => {
        sessionStorage.setItem('lobbyNumber', lobbyItem.lobbyNumber)
        menuState.set('duelLobby')
        lobby.set(lobbyItem)
    }
    if (socket) socket.emit('create-lobby', playerName, createLobbyCallback)
}

export const joinLobby = async (lobbyNumber: string, playerName: string) => {
    try {
        if (!socket) await createSocketConnection()
    } catch (error) {
        console.log(error)
    }

    const joinLobbyCallback = (lobbyItem: LobbyItem) => {
        if (lobbyItem) {
            sessionStorage.setItem('lobbyNumber', lobbyNumber)
            menuState.set('duelLobby')
            lobby.set(lobbyItem)
            return
        }
        alert(
            `Lobby ${lobbyNumber} does not exist or game has already started!`
        )
    }
    if (socket)
        socket.emit('join-lobby', lobbyNumber, playerName, joinLobbyCallback)
}

export const leaveLobby = async (lobbyNumber: string) => {
    if (!socket) return
    socket.emit('leave-lobby', lobbyNumber, () => {
        sessionStorage.removeItem('lobbyNumber')
        menuState.set('duelMenu')
    })
}

export const readyUp = async (playerStatus: boolean, lobbyNumber: string) => {
    if (!socket) return
    socket.emit('game-ready', playerStatus, lobbyNumber)
}

export const finnishLevel = async (
    lobbyNumber: string,
    routeCoordinates: [number, number][],
    time: number
) => {
    if (!socket) return
    socket.emit('finnish-level', lobbyNumber, routeCoordinates, time)
}

export const changeLobbySettings = async (
    lobbyNumber: string,
    lobbySettings: GameOptions
) => {
    if (!socket) return
    socket.emit('change-lobby-options', lobbyNumber, lobbySettings)
}
