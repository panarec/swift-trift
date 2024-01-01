import { LngLat } from 'mapbox-gl'
import type { NodeElement } from './types'

export function getBoundsOfNodeWithRadius(node: NodeElement, radius: number) {
    const bounds = new LngLat(node.lon, node.lat).toBounds(radius)
    return bounds
}
