<script lang="ts">
    import CreateIcon from '../Icons/CreateIcon.svelte'
    import JoinIcon from '../Icons/JoinIcon.svelte'
    import MenuCard from '../Components/MenuCard.svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import MenuHeader from '../Components/MenuHeader.svelte'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import BackButton from '../Components/BackButton.svelte'
    import { createLobby, joinLobby } from '../../../actions/socket'
    import { v4 } from 'uuid'
    import { getPlayerName } from '../../../actions/localStorage'
    import { menuState } from '../../stores'

    let inAnimation: anime.AnimeInstance
    let lobbyNumber: string
    let clientWidth: number = document.body.clientWidth
    let iconsWidth: number = 120

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

    const setCreateRoom = async () => {
        clientWidth = document.body.clientWidth
        const playerName = getPlayerName()
        menuState.set('loading')
        await createLobby(playerName)
        menuState.set('duelLobby')
    }

    const setJoinRoom = () => {
        menuState.set('joinRoom')
    }

    $: {
        if (clientWidth < 627) {
            iconsWidth = 100
        }
        if (clientWidth < 527) {
            iconsWidth = 80
        }
        if (clientWidth < 400) {
            iconsWidth = 65
        }
    }
</script>

<MenuContainer>
    <MenuHeader heading="Duel" />
    <body>
        <MenuCard
            class={`flex-column flex-align-center`}
            on:onClick={setCreateRoom}
        >
            <header>
                <h3>Create</h3>
            </header>
            <body>
                <div class="icon-container">
                    <CreateIcon width={iconsWidth} height={iconsWidth} />
                </div>
            </body>
        </MenuCard>
        <MenuCard
            inAnimationDelay={100}
            class={`flex-column flex-align-center`}
            on:onClick={setJoinRoom}
        >
            <header>
                <h3>Join</h3>
            </header>
            <body>
                <div class="icon-container">
                    <JoinIcon width={iconsWidth} height={iconsWidth} />
                </div>
            </body>
        </MenuCard>
    </body>
    <footer>
        <BackButton state="modesMenu" class={`cursor-pointer`} />
    </footer>
</MenuContainer>

<style>
    body {
        width: 100%;
        max-width: 600px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(7rem, 100%), 1fr));
        gap: 20px 30px;
    }
    footer {
        width: 100%;
        max-width: 100px;
    }
    .icon-container {
        background-color: #d9d9d920;
        border-radius: 50%;
        padding: min(25px, 3vw);
        margin-bottom: 30px;
        z-index: -10;
    }

    h3 {
        font-size: min(3em, 5vw);
        margin-block: 20px;
    }
</style>
