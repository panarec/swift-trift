<script lang="ts">
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { lobbyPlayers, menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import PlayerCard from '../PlayerCard.svelte'
    import Button from '../Button.svelte'
    import { leaveLobby } from '../../../actions/socket'
    import CardButton from '../CardButton.svelte'
    let inAnimation: anime.AnimeInstance
    let lobbyNumber: string | null
    let players: { socketId: string; playerName: string }[]

    onMount(() => {
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            scale: [0, 1],
            autoplay: false,
            duration: 750,
        })
        inAnimation.play()
        lobbyNumber = sessionStorage.getItem('lobbyNumber')

        lobbyPlayers.subscribe((lobbyPlayers) => {
            players = lobbyPlayers
        })
        console.log(players)
    })

    const leaveGame = async () => {
        if(lobbyNumber){
            await leaveLobby(lobbyNumber)
        }
    }

    const startGame = () => {

    }

    $: players

</script>

<MenuContainer class="">
    <MenuHeader heading={`Lobby #${lobbyNumber || ""}`} class=""/>
    <body>
        {#if players}
        {#each players as player, index}
            <PlayerCard playerName={player.playerName} rankNumber={index + 1} score={0} />
        {/each}
        {/if}
    </body>
    <footer>
        <CardButton class='btn-secondary' on:click={leaveGame}>
            Leave
        </CardButton>
        <CardButton class='btn-primary' on:click={startGame}>
            Ready
        </CardButton>
    </footer>
</MenuContainer>

<style>
    body {
        width: 100%;
        max-width: max(500px, calc(100% - 1200px));
        display: flex;
        flex-direction: column;
        gap: 20px 30px;
    }

    footer{
        width: 100%;
        max-width: 300px;
        display: flex;
        gap: 30px;
    }
</style>
