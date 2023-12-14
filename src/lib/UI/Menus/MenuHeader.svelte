<script lang="ts">
    import anime from 'animejs'
    import { onMount } from 'svelte'

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

<div class="header card col-start-2 col-end-6">
    <h2>{heading}</h2>
</div>

<style>
    .header h2 {
        margin: 15px;
        padding: 0;
        font-size: 2rem;
    }
</style>
