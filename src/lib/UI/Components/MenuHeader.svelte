<script lang="ts">
    import anime from 'animejs'
    import { onMount } from 'svelte'
    let clazz = ''
    export { clazz as class }

    /**
     * @type {string}
     */
    export let heading: string
    let inAnimation: anime.AnimeInstance

    onMount(() => {
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            scale: [0, 1],
            autoplay: false,
            duration: 750,
        })
        inAnimation.play()
    })
</script>

<div class={`header card ${clazz}`}>
    <h2>{heading}</h2>
</div>

<style>
    .header {
        width: 100%;
        max-width: 500px;
        margin-top: 40px;
    }
    .header h2 {
        margin: 15px;
        padding: 0;
        font-size: min(7vw, 40px);
    }
</style>
