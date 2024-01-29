import { writable, type Writable } from 'svelte/store'
import { getBestScore, getLevel, getTotalScore } from '../actions/localStorage'
import type { LobbyItem } from '../actions/types'
import Timer from 'easytimer.js'

export const menuState = writable('intro')

export const userRouteDistance = writable(0)
export const correctRouteDistance = writable(0)
export const bestScore = writable(getBestScore())
export const totalScore = writable(getTotalScore())
export const level = writable(getLevel())

export const modalYesCallback = writable(() => {})
export const modalNoCallback = writable(() => {})

export const lobby: Writable<LobbyItem> = writable()
