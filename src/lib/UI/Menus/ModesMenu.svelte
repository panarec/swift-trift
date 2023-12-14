<script lang="ts">
    import { onMount } from 'svelte'
    import { menuState } from '../../stores'
    import BluePersonIcon from '../Icons/BluePersonIcon.svelte'
    import GreenPersonIcon from '../Icons/GreenPersonIcon.svelte'
    import RedPersonIcon from '../Icons/RedPersonIcon.svelte'
    import MenuCard from './MenuCard.svelte'
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import anime from 'animejs'

    let inAnimation: anime.AnimeInstance

    function setSoloGM() {
        menuState.set('soloMenu')
    }

    function setMultiGM() {
        menuState.set('multiMenu')
    }

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

<MenuContainer class="col-start-4 col-end-10">
    <MenuHeader heading="Game modes" />
    <MenuCard
        class={`col-span-3 flex-column flex-align-center`}
        on:onClick={setSoloGM}
    >
        <header>
            <h3>Solo</h3>
        </header>
        <body>
            <div class="icon-container">
                <BluePersonIcon />
            </div>
        </body>
    </MenuCard>
    <MenuCard
        inAnimationDelay={100}
        class={`col-span-3 flex-column flex-align-center`}
        on:onClick={setMultiGM}
    >
        <header>
            <h3>Duel</h3>
        </header>
        <body>
            <div class="icon-container">
                <div class="left">
                    <RedPersonIcon />
                </div>
                <BluePersonIcon />
                <div class="right">
                    <GreenPersonIcon />
                </div>
            </div>
        </body>
    </MenuCard>
</MenuContainer>

<style>
    h3 {
        font-size: 3em;
        margin-block: 20px;
    }
    .icon-container {
        background-color: #d9d9d925;
        border-radius: 50%;
        padding: 30px;
        margin-bottom: 30px;
        z-index: -10;
    }
    .icon-container .left {
        position: absolute;
        left: 13%;
        top: 45%;
        z-index: -1;
    }
    .icon-container .right {
        position: absolute;
        right: 13%;
        top: 45%;
        z-index: -1;
    }
</style>
