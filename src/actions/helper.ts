import { LngLat } from 'mapbox-gl'
import type { NodeElement } from './types'
import Timer from 'easytimer.js'

export function getBoundsOfNodeWithRadius(node: NodeElement, radius: number) {
    const bounds = new LngLat(node.lon, node.lat).toBounds(radius)
    return bounds
}

export const gameTimer = new Timer()
export const lobbyTimer = new Timer()
