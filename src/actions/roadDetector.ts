import mapboxgl, { LngLat, Marker } from 'mapbox-gl'
import _ from 'lodash'
import { directionMarker } from './marker'
import { getRouteCoordinates } from './mapmatching'
// @ts-ignore
import { map } from '../lib/Map.svelte'
import { addCoordinatesToRoute, removeCoordinatesFromRoute } from './routes'
import {
    type NodeElement,
    type RoadElement,
    getAllNodesOfWay,
    getRoadsOfNode,
} from './overpass'
import anime from 'animejs/lib/anime.es.js'
import { finnishMarkerNode, markersForShortestPath } from './game'
import {
    bestScore,
    correctRouteDistance,
    userRouteDistance,
    totalScore,
} from '../lib/stores'
import {
    addToTotalScore,
    getBestScore,
    getTotalScore,
    saveBestScore,
} from './localStorage'

export let markers: Marker[] = []
export let directionMarkers: Marker[] = []
export let pathForMarkers: [number, number][] = []
export let checkpoints: [number, number][] = []

export function removeAllMarkers() {
    markers.forEach((marker) => {
        marker.remove()
    })
    markers = []
    directionMarkers.forEach((marker) => {
        marker.remove()
    })
    directionMarkers = []
    pathForMarkers = []
}

export function spawnDirectionMarker(nodeElement: NodeElement) {
    const nodeCoordinates = new LngLat(nodeElement.lon, nodeElement.lat)
    const directionMarkerObj = directionMarker(nodeElement)
        .setLngLat(nodeCoordinates)
        .addTo(map)
    directionMarkers.push(directionMarkerObj)
}

export async function findNextCrossRoad(nodeElement: NodeElement) {
    let jumpPosition = new LngLat(nodeElement.lon, nodeElement.lat)
    removeDirectionMarkers()
    const lastCoordinateOfPath: [number, number] = _.last(
        // @ts-ignore
        map.getSource('userRoute')._data.geometry.coordinates
    ) || [0, 0]
    const nextCoordPoint = map.project(jumpPosition)
    const currentCoordPoint = map.project(lastCoordinateOfPath)
    const distanceBetweenPoints = jumpPosition.distanceTo(
        new LngLat(lastCoordinateOfPath[0], lastCoordinateOfPath[1])
    )
    if (currentCoordPoint.x > nextCoordPoint.x) {
        anime({
            targets: '.carMarker',
            rotate: Math.min(45, distanceBetweenPoints / 4),
        })
    } else {
        anime({
            targets: '.carMarker',
            rotate: Math.min(45, distanceBetweenPoints / 4) * -1,
        })
    }
    const lastCheckpoint = checkpoints[checkpoints.length - 2]
    console.log({checkpoints})
    console.log({lastCheckpoint})
    if (
        lastCheckpoint &&
        lastCheckpoint[0] === nodeElement.lon &&
        lastCheckpoint[1] === nodeElement.lat
    ) {
        console.log('going back')
        await removeCoordinatesFromRoute(
            300,
            'userRoute',
            pathForMarkers,
            lastCheckpoint
        )
        checkpoints.pop()
        getAvailableDirections(nodeElement)
        return
    } else {
        console.log([nodeElement.lon, nodeElement.lat])
        checkpoints.push([nodeElement.lon, nodeElement.lat])
    }

    const routeCoords = await getRouteCoordinates([
        lastCoordinateOfPath,
        [jumpPosition.lng, jumpPosition.lat],
    ])
    await addCoordinatesToRoute(
        routeCoords.geometry.coordinates,
        300,
        'userRoute',
        pathForMarkers,
        nodeElement
    )
    if (nodeElement.id === finnishMarkerNode.id) {
        const markersBounds = new mapboxgl.LngLatBounds()
        removeAllMarkers()
        const finalRouteCoords = await getRouteCoordinates([
            [markersForShortestPath[0][0], markersForShortestPath[0][1]],
            [markersForShortestPath[1][0], markersForShortestPath[1][1]],
        ])
        const userRouteCoords = await getRouteCoordinates(checkpoints)
        finalRouteCoords.geometry.coordinates.forEach((coord) =>
            markersBounds.extend([coord[0], coord[1]])
        )

        userRouteDistance.set(Math.round(userRouteCoords.distance))
        correctRouteDistance.set(Math.round(finalRouteCoords.distance))

        if (
            Math.round(userRouteCoords.distance) ===
            Math.round(finalRouteCoords.distance)
        ) {
            addToTotalScore(Math.round(finalRouteCoords.distance))
            const savedTotalScore = getTotalScore()
            totalScore.set(savedTotalScore)

            const bestTotalScore = getBestScore()
            if (!bestTotalScore || bestTotalScore < savedTotalScore) {
                bestScore.set(savedTotalScore)
                saveBestScore(savedTotalScore)
            }
        }

        map.fitBounds(markersBounds, {
            padding: 100,
            pitch: 0,
            bearing: 0,
        }).once('zoomend', async () => {
            await addCoordinatesToRoute(
                finalRouteCoords.geometry.coordinates,
                2000,
                'correctRoute',
                []
            )
            return
        })
        return
    }
    getAvailableDirections(nodeElement)
    return
}

export async function getAvailableDirections(currentJunctionNode: NodeElement) {
    const roads = await getRoadsOfNode(currentJunctionNode)
    const juctionNodes: NodeElement[] = roads.elements.filter(
        (element) => element.type === 'node'
    )
    const ways: RoadElement[] = roads.elements.filter(
        (element) => element.type === 'way'
    )
    let availableJunctions: NodeElement[] = []
    for (const way of ways) {
        const closestWayJunctions = await getClosesJunctionsOfWay(
            way,
            juctionNodes,
            currentJunctionNode
        )
        availableJunctions.push(...closestWayJunctions)
    }
    availableJunctions = availableJunctions.filter(
        (junction) => junction.id !== currentJunctionNode.id
    )
    availableJunctions.forEach((junction) => spawnDirectionMarker(junction))
}

async function getClosesJunctionsOfWay(
    way: RoadElement,
    juctionNodes: NodeElement[],
    currentJunctionNode: NodeElement
) {
    let foundJunctionNodes: NodeElement[] = []
    const currentJunctionIndex = way.nodes.findIndex(
        (el) => el === currentJunctionNode.id
    )
    if (currentJunctionIndex > 0) {
        let foundNode: NodeElement
        for (let i = currentJunctionIndex; i > 0; i--) {
            foundNode = juctionNodes.find(
                (node) => node.id === way.nodes[i - 1]
            )
            if (foundNode) {
                foundJunctionNodes.push(foundNode)
                break
            }
        }
        if (!foundNode) {
            const nodes = await getAllNodesOfWay(way)

            foundJunctionNodes.push(
                nodes.elements.find((nd) => nd.id === way.nodes[0])
            )
        }
    }
    let foundNode: NodeElement
    for (let i = currentJunctionIndex; i < way.nodes.length - 1; i++) {
        foundNode = juctionNodes.find((node) => node.id === way.nodes[i + 1])
        if (foundNode) {
            foundJunctionNodes.push(foundNode)
            break
        }
    }
    if (!foundNode) {
        const nodes = await getAllNodesOfWay(way)

        foundJunctionNodes.push(
            nodes.elements.find(
                (nd) => nd.id === way.nodes[nodes.elements.length - 1]
            )
        )
    }
    return foundJunctionNodes
}

function removeDirectionMarkers() {
    directionMarkers.forEach((marker) => {
        anime({
            targets: ['.circle', '.ringring'],
            width: '0px',
            height: '0px',
            opacity: 0,
        }).finished.then(() => marker.remove())
    })
}

export function removeAllCheckpoint() {
    checkpoints = []
}
