<script context="module" lang="ts">
    export let map: mapboxgl.Map
</script>

<script lang="ts">
    import mapboxgl from 'mapbox-gl' // or "const mapboxgl = require('mapbox-gl');"
    import { onMount, onDestroy } from 'svelte'
    let mapContainer
    let lng: number, lat: number, zoom: number, pitch: number, bearing: number

    lng = -75.1698820066771
    lat = 39.961379306847704
    zoom = 1.5
    pitch = 0
    bearing = 0

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 360
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3

    let userInteracting = false
    let spinEnabled = true

    onMount(() => {
        const mapContainer = document.querySelector('#map') as HTMLElement
        if (mapContainer) {
            mapContainer.style.pointerEvents = 'none'
        }

        const initialState = { lng: lng, lat: lat, zoom: zoom }
        mapboxgl.accessToken =
            'pk.eyJ1IjoicGFuYXJlYyIsImEiOiJja3ZjZXBmMDAwNHlqMzBuM2lrZTQ4MDhmIn0.XLnuvSXKToRxsVNR0WHaKg'
        map = new mapboxgl.Map({
            container: 'map', // container ID
            center: [initialState.lng, initialState.lat], // starting position [lng, lat]
            zoom: initialState.zoom, // starting zoom
            pitch: pitch,
            bearing: bearing,
            antialias: true,
        })

        map.on('idle', function () {
            map.resize()
        })
        function spinGlobe() {
            const zoom = map.getZoom()
            if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
                let distancePerSecond = 360 / secondsPerRevolution
                if (zoom > slowSpinZoom) {
                    // Slow spinning at higher zooms
                    const zoomDif =
                        (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
                    distancePerSecond *= zoomDif
                }
                const center = map.getCenter()
                center.lng -= distancePerSecond
                // Smoothly animate the map over one second.
                // When this animation is complete, it calls a 'moveend' event.
                map.easeTo({ center, duration: 500, easing: (n) => n })
            }
        }
        // When animation is complete, start spinning if there is no ongoing interaction
        map.on('moveend', () => {
            spinGlobe()
        })
        map.on('load', () => {
            spinGlobe()
        })

        map.on('style.load', () => {
            // @ts-ignore
            map.setConfigProperty('basemap', 'showRoadLabels', false)
            // @ts-ignore
            map.setConfigProperty('basemap', 'showPointOfInterestLabels', false)
        })
    })
</script>

<div id="map" bind:this={mapContainer} />

<style>
    #map {
        position: fixed;
        width: 100%;
        
        height: 100%;
        z-index: -1;
    }
</style>
