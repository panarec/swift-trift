<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import anime from 'animejs'
    let inAnimation: anime.AnimeInstance

    const dispatch = createEventDispatcher()
    function onClick() {
        dispatch('click', {})
    }

    let clazz = ''
    let button: HTMLButtonElement
    export let disabled: boolean = false
    export { clazz as class }

    onMount(() => {
        if (!button) return
        anime({
            targets: [button],
            scale: [0, 1],
            autoplay: true,
            duration: 50,
        })
    })
</script>

<button
    class={`card card-hover cursor-pointer ${clazz}`}
    bind:this={button}
    {disabled}
    on:click={onClick}
>
    <slot />
</button>

<style>
    .card {
        padding-block: min(1rem, 4vw);
        font-weight: 900;
        font-size: clamp(0.75rem, 5vw, 1.25rem);
    }

    .btn-primary {
        background: #ffcb13;
    }
    .btn-secondary {
        background: #fc5f3c;
    }
    .btn-disabled {
        background: #e0e0e0;
    }
</style>
