<script lang="ts">
    import { onMount } from "svelte"
    import BackArrowIcon from "./Icons/BackArrowIcon.svelte"
    import { menuState } from '../stores'
    import anime from "animejs"
    let inAnimation: anime.AnimeInstance

    /**
     * @type {string}
     */
    export let state: string
    function onClick() {
        menuState.set(state)
    }

    let clazz = '';
	export {clazz as class}; 


    onMount(() => {
        const backButton = document.querySelector('#backButton')
        inAnimation = anime({
            targets: [backButton],
            scale: [0, 1],
            autoplay: false,
            duration: 750,
        })
        inAnimation.play()
    })
</script>

<button class={`card card-hover ${clazz}`} on:click={onClick} id="backButton">
    <BackArrowIcon />
</button>

<style>
    .card {
        padding: 10px 0px 10px 0px;
    }
</style>
