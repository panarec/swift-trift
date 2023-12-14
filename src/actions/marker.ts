import mapboxgl, { Marker } from 'mapbox-gl'
import { findNextCrossRoad } from './roadDetector'
import anime from 'animejs/lib/anime.es.js'

export const startMarker = (): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = '../../public/imgs/start.svg'
    marker.classList.add('startMarker', 'customMarker')
    anime({
        targets: marker,
        width: '60px',
        height: '60px',
    })
    return new mapboxgl.Marker({
        color: '#00ff00',
        scale: 0.1,
        element: el,
        offset: [0, -250],
    })
}
export const finnishMarker = (): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = '../../public/imgs/end.svg'
    marker.classList.add('finnishMarker', 'customMarker')
    anime({
        targets: marker,
        width: '60px',
        height: '60px',
    })
    return new mapboxgl.Marker({
        color: '#ff0000',
        scale: 0.1,
        element: el,
        offset: [0, -250],
    })
}
export const carMarker = (): Marker => {
    const el = document.createElement('div')
    const marker = document.createElement('img')
    el.appendChild(marker)
    marker.src = '../../public/imgs/car.svg'
    marker.classList.add('carMarker', 'customMarker')
    return new mapboxgl.Marker({
        color: '#ff0000',
        scale: 0.1,
        element: el,
        offset: [0, -250],
    })
}
export const directionMarker = (nodeElement): Marker => {
    const el = document.createElement('button')
    const circle = document.createElement('div')
    const ringring = document.createElement('div')
    ringring.className = 'ringring'
    circle.className = 'circle'
    el.className = 'dirButton'
    el.appendChild(circle)
    circle.appendChild(ringring)
    el.id = 'marker'
    anime({
        targets: circle,
        width: '20px',
        height: '20px',
    })
    el.addEventListener('click', async (e) => {
        await findNextCrossRoad(nodeElement)
    })
    return new mapboxgl.Marker({ element: el })
}
