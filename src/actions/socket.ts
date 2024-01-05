import io, { Socket } from 'socket.io-client'
import { lobby, menuState } from '../lib/stores'
import type { GameParams, LobbyItem, PlayerItem } from './types'
import { generateGame } from './game'

let socket: Socket

export const createSocketConnection = async () => {
    socket = io('http://localhost:3001/')
    socket.onAny((event) => {
        console.log(event)
    })
    socket.on('lobby-change', (lobbyItem: LobbyItem) => {
        lobby.set(lobbyItem)
    })
    socket.on('game-start', (gameParams: string) => {
        generateGame(JSON.parse(gameParams))
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

export const leaveLobby = async (lobbyNumber: string) => {
    sessionStorage.removeItem('lobbyNumber')
    socket.emit('leave-lobby', lobbyNumber, () => {
        menuState.set('duelMenu')
    })
}

export const readyUp = async (playerReady: boolean) => {
    const gameReadyCallback = (lobbyItem: LobbyItem) => {
        console.log('called')
        lobby.set(lobbyItem)
        return lobbyItem
    }

    socket.emit('game-ready', playerReady, gameReadyCallback)
}
