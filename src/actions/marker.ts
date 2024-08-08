import mapboxgl, { Marker } from 'mapbox-gl'
import { findNextCrossRoad } from './roadDetector'
import anime from 'animejs/lib/anime.es.js'
import type { NodeElement } from './types'

const getUserMarker = (markerSrc: string): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = markerSrc
    marker.classList.add('customMarker', 'userMarker')
    return new mapboxgl.Marker({
        color: '#ff0000',
        scale: 0.1,
        element: el,
        offset: [0, -280],
    })
}

export const startMarker = (): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = '../../imgs/start.svg'
    marker.classList.add('startMarker', 'customMarker')
    anime({
        targets: marker,
        width: '180px',
        height: '180px',
    })
    return new mapboxgl.Marker({
        color: '#00ff00',
        scale: 0.1,
        element: el,
        offset: [0, 0],
    })
}
export const finnishMarker = (): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = '../../imgs/end2.svg'
    marker.classList.add('finnishMarker', 'customMarker')
    anime({
        targets: marker,
        width: '180px',
        height: '180px',
    })
    anime({
        targets: marker,
        rotate: [0, 35],
        loop: true,
        duration: 5000,
        direction: 'alternate',
    })
    return new mapboxgl.Marker({
        color: '#ff0000',
        scale: 0.1,
        element: el,
        offset: [0, 0],
    })
}
export const orangeScooterMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_scooter_orange.png')
    return userMarker
}

export const orangeVanMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_van_orange.png')
    return userMarker
}

export const blueVanMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_van_blue.png')
    return userMarker
}

export const redVanMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_van_red.png')
    return userMarker
}

export const greenVanMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_van_green.png')
    return userMarker
}

export const purpleVanMarker = (): Marker => {
    const userMarker = getUserMarker('../../imgs/user_van_purple.png')
    return userMarker
}

export const directionMarker = (nodeElement: NodeElement): Marker => {
    const el = document.createElement('button')
    const circle = document.createElement('div')
    const centerDot = document.createElement('div')
    centerDot.className = 'centerDot'
    circle.className = 'circle'
    el.className = 'dirButton'
    el.appendChild(circle)
    circle.appendChild(centerDot)
    el.id = 'marker'
    anime({
        targets: centerDot,
        width: '15px',
        height: '15px',
        loop: true,
        duration: 1000,
        endDelay: 1000,
        direction: 'alternate',
    })
    anime({
        targets: circle,
        rotate: 360,
        width: '30px',
        height: '30px',
        loop: true,
        duration: 1000,
        endDelay: 1000,
        direction: 'alternate',
    })
    el.addEventListener('click', async (e) => {
        await findNextCrossRoad(nodeElement)
    })
    return new mapboxgl.Marker({ element: el })
}
