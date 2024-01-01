import io from 'socket.io-client'
import type { Socket } from 'socket.io-client/debug'
import { lobbyPlayers, menuState } from '../lib/stores'

type LobbyItem = {
    lobbyNumber: string
    players: {
        socketId: string
        playerName: string
    }[]
}

let socket: Socket

export const createSocketConnection = async () => {
    socket = io('http://localhost:3001/')
    socket.onAny((event) => {
        console.log(event)
    })
    socket.on('player-joined', (lobbyItem: LobbyItem) => {
        lobbyPlayers.set(lobbyItem.players)
    })
    socket.on('player-left', (lobbyItem: LobbyItem) => {
        lobbyPlayers.set(lobbyItem.players)
    })
}

export const joinLobby = async (lobbyNumber: string, playerName: string) => {
    sessionStorage.setItem('lobbyNumber', lobbyNumber)

    if (!socket) await createSocketConnection()

    socket.emit(
        'join-lobby',
        lobbyNumber,
        playerName,
        (lobbyItem: LobbyItem) => {
            menuState.set('duelRoom')
            lobbyPlayers.set(lobbyItem.players)
        }
    )
}

export const leaveLobby = async (lobbyNumber: string) => {
    sessionStorage.removeItem('lobbyNumber')
    socket.emit('leave-lobby', lobbyNumber, () => {
        menuState.set('duelMenu')
    })
}
