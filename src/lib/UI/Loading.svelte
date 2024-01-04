<script lang="ts">
    import { onMount } from 'svelte'
    import SpinnerIcon from './Icons/SpinnerIcon.svelte'
    import anime from 'animejs'
    import MenuContainer from './Menus/MenuContainer.svelte'

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

<MenuContainer>
    <div class="loading-container card col-start-5 col-end-9">
        <SpinnerIcon />
        <h2>Looking for deliveries...</h2>
    </div>
</MenuContainer>


<style>
    .loading-container {
        padding: 30px;
        max-width: max(300px, calc(100% - 1200px));

    }
</style>
