<script lang="ts">
    import ScooterIcon from '../Icons/ScooterIcon.svelte'
    import VanIcon from '../Icons/VanIcon.svelte'
    import TruckIcon from '../Icons/TruckIcon.svelte'
    import { generateGame, loadingNextGame } from '../../../actions/game'
    import MenuCard from './MenuCard.svelte'
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import { resetLevel } from '../../../actions/localStorage'
    import BackButton from '../BackButton.svelte'
    let inAnimation: anime.AnimeInstance

    function runGame() {
        // resetLevel()
        // menuState.set('loading')
        // function checkIfLoaded() {
        //     if (loadingNextGame) {
        //         return
        //     }
            generateGame()
        //     menuState.set('')
        //     clearInterval(checkingInterval)
        // }
        // const checkingInterval = setInterval(checkIfLoaded, 1000)
    }

    function showTutorial() {
        menuState.set('howtoplay')
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

<MenuContainer class="col-start-3 col-end-11">
    <MenuHeader heading="Game modes" />
    <MenuCard
        on:onClick={runGame}
        class="col-span-2 flex-column flex-align-center"
    >
        <header class="card-header m-6">
            <h3 class="h2">Chill</h3>
        </header>
        <div class="icon-container">
            <ScooterIcon />
        </div>
        <section class="p-4 text-center">
            <ul>
                <li>Find shortest route</li>
                <li>No time limit</li>
                <li>Without oneways</li>
            </ul>
        </section>
        <footer class="card-footer"></footer>
    </MenuCard>
    <MenuCard
        inAnimationDelay={100}
        on:onClick={showTutorial}
        class="col-span-2 flex-column flex-align-center"
    >
        <header class="card-header m-6">
            <h3 class="h2">Pro</h3>
        </header>
        <div class="icon-container">
            <VanIcon />
        </div>
        <section class="p-4 text-center">
            <ul>
                <li>Find fastest route</li>
                <li>Time limit</li>
                <li>Oneways</li>
            </ul>
        </section>
        <footer class="card-footer"></footer>
    </MenuCard>
    <MenuCard
        on:onClick={runGame}
        inAnimationDelay={200}
        class="col-span-2 flex-column flex-align-center"
    >
        <header class="card-header m-6">
            <h3 class="h2">Extreme</h3>
        </header>
        <div class="icon-container">
            <TruckIcon />
        </div>
        <section class="p-4 text-center">
            <ul>
                <li>Find fastest route</li>
                <li>Traffic</li>
                <li>Random events</li>
            </ul>
        </section>
        <footer class="card-footer"></footer>
    </MenuCard>
    <BackButton state='modesMenu' class={`col-end-5 col-start-3 cursor-pointer`} />

</MenuContainer>

<style>
    .card-header {
        text-align: center;
    }
    .card-header h3 {
        font-size: 2rem;
    }
    .icon-container {
        background-color: #d9d9d920;
        border-radius: 50%;
        padding: 25px;
        margin-bottom: 30px;
        z-index: -10;
    }
    ul {
        padding: 0;
        list-style: none;
        margin-bottom: 30px;
    }
    li {
        font-weight: 600;
    }
    ul li:not(:last-child) {
        margin-bottom: 10px;
    }
</style>
