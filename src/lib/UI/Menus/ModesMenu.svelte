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
    import BackButton from '../BackButton.svelte'

    let inAnimation: anime.AnimeInstance

    function setSoloGM() {
        sessionStorage.setItem('gameMode', 'solo')
        menuState.set('soloMenu')
    }

    function setDuelGM() {
        sessionStorage.setItem('gameMode', 'duel')
        menuState.set('duelMenu')
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

<MenuContainer class="">
    <MenuHeader heading="Game modes" />
    <body class="col-md-2">
            <MenuCard
            class={`flex-column flex-align-center`}
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
            class={`flex-column flex-align-center`}
            on:onClick={setDuelGM}
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
    </body>
    <footer>
        <BackButton state='login' class={`cursor-pointer`} />
    </footer>
</MenuContainer>

<style>
    body {
        width: 100%;
        max-width: 600px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
        gap: 20px 30px;
    }
    footer{
        width: 100%;
        max-width: 100px;
    }
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
