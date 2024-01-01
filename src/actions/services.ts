import type { LngLat } from 'mapbox-gl'
import type { NodeElement } from './overpass'
import { sendPostRequest } from './client'
import type { FinnishResponse, GameParams, MoveResponse } from './types'

export const getGame = async (currentLevel: number) => {
    const body = {
        currentLevel,
    }

    const responseData = await sendPostRequest(body, 'getGame')
    return responseData as GameParams
}

export const move = async (
    currentPosition: [number, number],
    nextNode: NodeElement
): Promise<MoveResponse> => {
    const body = {
        currentPosition,
        nextNode,
    }

    const responseData = await sendPostRequest(body, 'move')
    return responseData as MoveResponse
}

export const finnishGame = async (
    startPosition: [number, number],
    finnishPosition: [number, number],
    userRouteCoordinates: [number, number][]
) => {
    const body = {
        startPosition,
        finnishPosition,
        userRouteCoordinates,
    }

    const responseData = await sendPostRequest(body, 'finnishGame')
    return responseData as FinnishResponse
}
