<script lang="ts">
    import CreateIcon from '../Icons/CreateIcon.svelte'
    import JoinIcon from '../Icons/JoinIcon.svelte'
    import MenuCard from './MenuCard.svelte'
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import BackButton from '../BackButton.svelte'
    import { joinLobby } from '../../../actions/socket'
    import { v4 } from 'uuid'
    import { getPlayerName } from '../../../actions/localStorage'

    let inAnimation: anime.AnimeInstance
    let lobbyNumber: string

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
        lobbyNumber = v4().split('-')[0]
        const playerName = getPlayerName()
        await joinLobby(lobbyNumber, playerName)
        menuState.set('loading')
    }

    const setJoinRoom = () => {
        menuState.set('joinRoom')
    }
</script>

<MenuContainer class="col-start-4 col-end-10">
    <MenuHeader heading="Duel" />
    <MenuCard
        class={`col-span-3 flex-column flex-align-center`}
        on:onClick={setCreateRoom}
    >
        <header>
            <h3>Create</h3>
        </header>
        <body>
            <div class="icon-container">
                <CreateIcon />
            </div>
        </body>
    </MenuCard>
    <MenuCard
        inAnimationDelay={100}
        class={`col-span-3 flex-column flex-align-center`}
        on:onClick={setJoinRoom}
    >
        <header>
            <h3>Join</h3>
        </header>
        <body>
            <div class="icon-container">
                <JoinIcon />
            </div>
        </body>
    </MenuCard>
    <BackButton state='modesMenu' class={`col-end-5 col-start-3 cursor-pointer`} />
</MenuContainer>

<style>

    .icon-container {
        background-color: #d9d9d920;
        border-radius: 50%;
        padding: 25px;
        margin-bottom: 30px;
        z-index: -10;
    }

    h3 {
        font-size: 3em;
        margin-block: 20px;
    }
</style>
