import * as data from './cities.json' assert { type: 'json' }
import { LngLat } from 'mapbox-gl'
import _ from 'lodash'
export type OverpassResponse<ElementsType> = {
    elements: ElementsType[]
    generator: string
    osm3s: any
    version: number
}
export type RelationElement = {
    bounds: {
        maxlat: number
        maxlon: number
        minlat: number
        minlon: number
    }
    id: number
    nodes: number[]
    tags: any
    type: string
}
export type NodeElement = {
    id: number
    lat: number
    lon: number
    tags: any
    type: string
}

export type RoadElement = {
    geometry: {
        lat: number
        lon: number
    }[]
    id: number
    nodes: number[]
    tags: any
    type: string
}
export async function getAllNodesOfWay(way: RoadElement) {
    const rawQuery = {
        data: `[out:json][timeout:25];
        way(${way.id});
        node(w);
        out geom;`,
    }

    const requestBody = parseRequestBody(rawQuery)
    const result: OverpassResponse<NodeElement> =
        await sendOverpassApiRequest(requestBody)
    return result
}

function parseRequestBody(body: any) {
    let requestBodyArr: string[] = []
    for (const property in body) {
        const encodedKey = encodeURIComponent(property)
        const encodedValue = encodeURIComponent(body[property])
        requestBodyArr.push(encodedKey + '=' + encodedValue)
    }
    const requestBody = requestBodyArr.join('&')
    return requestBody
}

export async function getJunctionsWithinArea(
    north: number,
    south: number,
    east: number,
    west: number
) {
    const rawQuery = {
        data: `[out:json][timeout:25][bbox:${south},${west},${north},${east}];

    // The public street network
    way["highway"~"^(trunk|primary|motorway|living_street|secondary|tertiary|unclassified|residential|tertiary_link|service|motorway_junction|motorway_link|trunk_link|primary_link|secondary_link|road)$"]->.streets;
    
    // Get nodes that connect between three or more street segments
    node(way_link.streets:3-)->.connections;
    
    // Get intersections between distinct streets
    foreach .connections->.connection(
        // Get adjacent streets
        way(bn.connection);
        // If the names don't all match, add the node to the set of intersections
        if (u(t["name"]) == "< multiple values found >") {
        (.connection; .intersections;)->.intersections;
    }
    );
    .intersections out geom;`,
    }

    const requestBody = parseRequestBody(rawQuery)
    const result: OverpassResponse<NodeElement> =
        await sendOverpassApiRequest(requestBody)
    return result
}
export async function getRoadsOfNode(node: NodeElement) {
    const rawQuery = {
        data: `[out:json][timeout:25];
        node(${node.id});
     
	way(bn)[highway~"^(motorway|trunk|primary|unclassified|living_street|service|secondary|residential|tertiary|(motorway|trunk|primary|tertiary|secondary)_link)$"]->.allways;
       	node(w.allways)->.allnodes;
		foreach .allnodes -> .currentnode(
            way(bn.currentnode)[highway~"^(motorway|trunk|unclassified|primary|living_street|service|secondary|residential|tertiary|(motorway|trunk|primary|tertiary|secondary)_link)$"]->.allroads;
          node(way_link.allroads:3-)->.currentnode;
          (.currentnode; .intersections;)->.intersections;
        
       );
		 (.allways; .intersections;)->.union; 
        .union out geom;
`,
    }
    const requestBody = parseRequestBody(rawQuery)
    const result: OverpassResponse<RoadElement & NodeElement> =
        await sendOverpassApiRequest(requestBody)
    return result
}

async function sendOverpassApiRequest(requestBody: any) {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: requestBody,
    })
    const responseBody = await response.json()
    return responseBody
}

export async function getRandomCity() {
    // @ts-ignore
    const result = data.default
    return result[_.random(0, result.length - 1)]
}

export async function queryCityById(cityId: number) {
    const rawQuery = {
        data: `[out:json][timeout:25];
        node(${cityId})->.city;
        rel(bn.city)->.areas;
        (.city; .areas;)->.union;
        .union out geom;`,
    }

    const requestBody = parseRequestBody(rawQuery)
    const result: OverpassResponse<RelationElement & NodeElement> =
        await sendOverpassApiRequest(requestBody)
    return result
}

export async function getRoadsAroundPoint(coordinates: LngLat[]) {
    const points: number[][] = coordinates.map((coor) => [coor.lat, coor.lng])
    const rawQuery = {
        data: `[out:json][timeout:25];
        node(around:100.0,${points.join(',')})->.allnodes;
        foreach .allnodes ->.currentNode(
            way["highway"~"^(trunk|primary|motorway|living_street|secondary|tertiary|unclassified|residential|tertiary_link|service|motorway_junction|motorway_link|trunk_link|primary_link|secondary_link|road)$"](bn.currentNode)->.road;
            (.road;.road >;)->.road;
            node(way_link.road:3-)->.connections;
            .connections out;
        )
        `,
    }
    const requestBody = parseRequestBody(rawQuery)
    const result: OverpassResponse<NodeElement> =
        await sendOverpassApiRequest(requestBody)
    return result
}
