<script lang="ts">
    import ScooterIcon from '../Icons/ScooterIcon.svelte'
    import VanIcon from '../Icons/VanIcon.svelte'
    import TruckIcon from '../Icons/TruckIcon.svelte'
    import {
        generateGame,
        getGameParams,
        loadingNextGame,
    } from '../../../actions/game'
    import MenuCard from '../Components/MenuCard.svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import MenuHeader from '../Components/MenuHeader.svelte'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import BackButton from '../Components/BackButton.svelte'
    import { menuState } from '../../stores'
    let inAnimation: anime.AnimeInstance
    let clientWidth: number = document.body.clientWidth
    let iconsWidth: number = 70

    async function runGame() {
        const gameParams = await getGameParams()
        generateGame(gameParams)
    }

    function showTutorial() {
        menuState.set('howtoplay')
    }

    onMount(() => {
        clientWidth = document.body.clientWidth
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            scale: [0, 1],
            autoplay: false,
            duration: 750,
        })
        inAnimation.play()
    })

    $: {
        if (clientWidth < 627) {
            iconsWidth = 70
        }
        if (clientWidth < 527) {
            iconsWidth = 60
        }
        if (clientWidth < 400) {
            iconsWidth = 45
        }
    }
</script>

<MenuContainer class="">
    <MenuHeader heading="Game modes" />
    <body>
        <MenuCard on:onClick={runGame} class="flex-column flex-align-center">
            <header class="card-header m-6">
                <h3 class="h2">Scooter</h3>
            </header>
            <div class="icon-container">
                <ScooterIcon width={iconsWidth} height={iconsWidth} />
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
            disabled
            class="flex-column flex-align-center"
        >
            <header class="card-header m-6">
                <h3 class="h2">Van</h3>
            </header>
            <div class="icon-container">
                <VanIcon width={iconsWidth} height={iconsWidth} />
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
            disabled
            on:onClick={runGame}
            inAnimationDelay={200}
            class={`flex-column flex-align-center ${
                clientWidth < 472 ? 'col-span-2' : ''
            }`}
        >
            <header class="card-header m-6">
                <h3 class="h2">Truck</h3>
            </header>
            <div class="card-body">
                <div class="icon-container">
                    <TruckIcon width={iconsWidth} height={iconsWidth} />
                </div>
                <section class="p-4 text-center">
                    <ul>
                        <li>Find fastest route</li>
                        <li>Traffic</li>
                        <li>Random events</li>
                    </ul>
                </section>
            </div>
            <footer class="card-footer"></footer>
        </MenuCard>
    </body>
    <footer>
        <BackButton state="modesMenu" class={`cursor-pointer`} />
    </footer>
</MenuContainer>

<style>
    .card-header {
        text-align: center;
    }
    .card-header h3 {
        font-size: min(1.5rem, 10vw);
        margin-block: min(2rem, 10vw);
    }
    body {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
        gap: 20px;
        width: 100%;
        max-width: 800px;
    }
    footer {
        width: 100%;
        max-width: 100px;
        margin-bottom: 2rem;
    }
    .icon-container {
        background-color: #d9d9d920;
        border-radius: 50%;
        padding: min(25px, 3vw);
        margin-bottom: 30px;
        z-index: -10;
    }
    ul {
        padding: 0;
        list-style: none;
        margin-bottom: min(30px, 5vw);
    }
    li {
        font-weight: 600;
        font-size: min(1rem, 2.5vw);
        margin-bottom: 0px;
    }
    ul li:not(:last-child) {
        margin-bottom: min(10px, 2vw);
    }
    @media only screen and (max-width: 472px) {
        .card-body {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            width: 100%;
        }
        .card-body .icon-container {
            margin-bottom: 0;
        }
        .col-span-2 header h3 {
            margin-block: 15px;
        }
    }
</style>
