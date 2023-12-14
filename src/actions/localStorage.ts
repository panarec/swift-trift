import { level, totalScore } from '../lib/stores'

export const addToTotalScore = (score: number) => {
    const totalScore = localStorage.getItem('totalScore')
    if (totalScore) {
        localStorage.setItem(
            'totalScore',
            (parseInt(totalScore, 10) + score).toString()
        )
    } else {
        localStorage.setItem('totalScore', score.toString())
    }
}
export const getTotalScore = () => {
    const totalScore = localStorage.getItem('totalScore')
    if (totalScore) return +totalScore
    else return 0
}

export const resetTotalScore = () => {
    localStorage.setItem('totalScore', '0')
    totalScore.set(0)
}

export const saveBestScore = (score: number) => {
    localStorage.setItem('bestScore', score.toString())
}

export const getBestScore = () => {
    const bestScore = localStorage.getItem('bestScore')
    if (bestScore) return +bestScore
    else return 0
}

export const increaseLevel = () => {
    const currentLevel = localStorage.getItem('level')
    if (currentLevel) {
        localStorage.setItem(
            'level',
            (parseInt(currentLevel, 10) + 1).toString()
        )
    } else {
        localStorage.setItem('level', '1')
    }
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
