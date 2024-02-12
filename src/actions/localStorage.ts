import { level, totalSoloScore } from '../lib/stores'
import { v4 } from 'uuid'

const DEFAULT_PLAYER_NAME = 'Guest'

export const addToTotalSoloScore = (score: number) => {
    const totalScore = localStorage.getItem('totalSoloScore')
    if (totalScore) {
        localStorage.setItem(
            'totalSoloScore',
            (parseInt(totalScore, 10) + score).toString()
        )
    } else {
        localStorage.setItem('totalSoloScore', score.toString())
    }
}
export const getTotalSoloScore = () => {
    const totalScore = localStorage.getItem('totalSoloScore')
    if (totalScore) return +totalScore
    else return 0
}

export const resetTotalSoloScore = () => {
    localStorage.setItem('totalSoloScore', '0')
    totalSoloScore.set(0)
}

export const saveBestSoloScore = (score: number) => {
    localStorage.setItem('bestSoloScore', score.toString())
}

export const getBestSoloScore = () => {
    const bestScore = localStorage.getItem('bestSoloScore')
    if (bestScore) return +bestScore
    else return 0
}

export const addToTotalDuelScore = (score: number) => {
    const totalScore = localStorage.getItem('totalDuelScore')
    if (totalScore) {
        localStorage.setItem(
            'totalScore',
            (parseInt(totalScore, 10) + score).toString()
        )
    } else {
        localStorage.setItem('totalDuelScore', score.toString())
    }
}
export const getTotalDuelScore = () => {
    const totalScore = localStorage.getItem('totalDuelScore')
    if (totalScore) return +totalScore
    else return 0
}

export const resetTotalDuelScore = () => {
    localStorage.setItem('totalDuelScore', '0')
    totalSoloScore.set(0)
}

export const saveBestDuelScore = (score: number) => {
    localStorage.setItem('bestDuelScore', score.toString())
}

export const getBestDuelScore = () => {
    const bestScore = localStorage.getItem('bestDuelScore')
    if (bestScore) return +bestScore
    else return 0
}

export const getSoloBestLevel = () => {
    const bestLevel = localStorage.getItem('bestLevel')
    if (bestLevel) return +bestLevel
    else return 0
}

export const saveBestLevel = (level: number) => {
    localStorage.setItem('bestLevel', level.toString())
}

export const increaseLevel = () => {
    const currentLevel = localStorage.getItem('level')
    const bestLevel = localStorage.getItem('bestLevel')
    if (currentLevel) {
        localStorage.setItem(
            'level',
            (parseInt(currentLevel, 10) + 1).toString()
        )
        if (bestLevel && parseInt(bestLevel, 10) < parseInt(currentLevel, 10)) {
            saveBestLevel(parseInt(currentLevel, 10))
        }
    } else {
        localStorage.setItem('level', '1')
    }
}

export const getSoloGamesPlayed = () => {
    const gamesPlayed = localStorage.getItem('soloGamesPlayed')
    if (gamesPlayed) return +gamesPlayed
    else return 0
}

export const increaseSoloGamesPlayed = () => {
    const gamesPlayed = getSoloGamesPlayed()
    localStorage.setItem('soloGamesPlayed', (gamesPlayed + 1).toString())
}

export const getDuelGamesPlayed = () => {
    const gamesPlayed = localStorage.getItem('duelGamesPlayed')
    if (gamesPlayed) return +gamesPlayed
    else return 0
}

export const increaseDuelGamesPlayed = () => {
    const gamesPlayed = getDuelGamesPlayed()
    localStorage.setItem('duelGamesPlayed', (gamesPlayed + 1).toString())
}

export const getLevel = () => {
    const currentLevel = localStorage.getItem('level')
    if (currentLevel) return +currentLevel
    else localStorage.setItem('level', '1')
    return 1
}

export const resetLevel = () => {
    localStorage.setItem('level', '1')
    level.set(1)
}

export const setPlayerName = (name: string) => {
    if (name) {
        localStorage.setItem('playerName', name)
    } else {
        localStorage.setItem('playerName', DEFAULT_PLAYER_NAME)
    }
}

export const getPlayerName = () => {
    return localStorage.getItem('playerName') || DEFAULT_PLAYER_NAME
}
