<script lang="ts">
    import anime from 'animejs'
    import { onMount } from 'svelte'
    export let inAnimationDelay: number = 0
    let card: string | object | HTMLElement | SVGElement | NodeList | null
    let clazz = ''
    export { clazz as class }
    let inAnimation: anime.AnimeInstance

    onMount(() => {
        inAnimation = anime({
            targets: [card],
            height: ['0%', '100%'],
            autoplay: false,
            duration: 500,
            delay: inAnimationDelay,
        })
        inAnimation.play()
    })
</script>

<div class={`card ${clazz}`} bind:this={card}>
    <slot />
</div>

<style>
    .padding-1 {
        padding-inline: min(1rem, 5vw);
    }
</style>
