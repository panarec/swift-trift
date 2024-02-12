import { writable, type Writable } from 'svelte/store'
import {
    getBestDuelScore,
    getBestSoloScore,
    getLevel,
    getTotalDuelScore,
    getTotalSoloScore,
} from '../actions/localStorage'
import type { LobbyItem } from '../actions/types'
import Timer from 'easytimer.js'

export const menuState = writable('intro')

export const userRouteDistance = writable(0)
export const correctRouteDistance = writable(0)

export const bestSoloScore = writable(getBestSoloScore())
export const totalSoloScore = writable(getTotalSoloScore())
export const bestDuelScore = writable(getBestDuelScore())
export const totalDuelScore = writable(getTotalDuelScore())

export const level = writable(getLevel())

export const modalYesCallback = writable(() => {})
export const modalNoCallback = writable(() => {})

export const lobby: Writable<LobbyItem> = writable()
