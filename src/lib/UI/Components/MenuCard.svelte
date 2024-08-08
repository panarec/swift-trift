<script lang="ts">
    import anime from 'animejs'
    import { createEventDispatcher, onMount } from 'svelte'
    import { tooltip } from '../../../actions/tooltip'
    import Tooltip from './Tooltip.svelte'
    let clazz = ''
    export let inAnimationDelay: number = 0
    export { clazz as class }
    export let disabled: boolean = false
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
    class={`card card-hover cursor-pointer ${clazz} ${
        disabled ? 'disabled' : ''
    }`}
    bind:this={card}
    on:click={onClick}
    {disabled}
>
    <slot />
    {#if disabled}
        <span class="coming-soon-ribbon"> Coming soon </span>
    {/if}
</button>

<style>
    .disabled {
        pointer-events: none;
        opacity: 0.5;
    }
    .coming-soon-ribbon {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        background-color: #fc5f3c;
        color: white;
        padding: 0.5rem 1rem;
        box-sizing: border-box;
        font-size: 1rem;
        font-weight: 900;
    }
</style>
