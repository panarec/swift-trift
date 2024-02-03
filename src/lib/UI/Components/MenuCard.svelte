<script lang="ts">
    import anime from 'animejs'
    import { createEventDispatcher, onMount } from 'svelte'
    let clazz = ''
    export let inAnimationDelay: number = 0
    export { clazz as class }
    let card: string | object | HTMLElement | SVGElement | NodeList | null
    const dispatch = createEventDispatcher()
    function onClick() {
        dispatch('onClick', {})
    }

    let inAnimation: anime.AnimeInstance

    onMount(() => {
        inAnimation = anime({
            targets: [card],
            height: ['0%', '100%'],
            autoplay: false,
            duration: 50,
            delay: inAnimationDelay,
        })
        inAnimation.play()
    })
</script>

<button
    class={`card card-hover cursor-pointer ${clazz}`}
    bind:this={card}
    on:click={onClick}
>
    <slot />
</button>

<style>
</style>
