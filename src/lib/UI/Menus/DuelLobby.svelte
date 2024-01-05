<script lang="ts">
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { lobby, menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import PlayerCard from '../PlayerCard.svelte'
    import Button from '../Button.svelte'
    import { leaveLobby, readyUp } from '../../../actions/socket'
    import CardButton from '../CardButton.svelte'
    import type { LobbyItem } from '../../../actions/types'
    let inAnimation: anime.AnimeInstance
    let lobbyNumber: string | null
    let lobbyItem: LobbyItem
    let ready: boolean = false

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

        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
    })

    const leaveGame = async () => {
        console.log("clicked")
        if(lobbyNumber){
            await leaveLobby(lobbyNumber)
        }
    }

    const changeReady = async () => {
        await readyUp(!ready)
        ready = !ready
    }

    $: lobbyItem

</script>

<MenuContainer class="">
    <MenuHeader heading={`Lobby #${lobbyNumber || ""}`} class=""/>
    <body>
        {#if lobbyItem}
        {#each lobbyItem.players as player, index}
            <PlayerCard playerName={player.playerName} rankNumber={index + 1} score={player.score} />
            {#if player.ready}
                <p>Ready</p>
            {:else}
                <p>Not Ready</p>
            {/if}
        {/each}
        {/if}
    </body>
    <footer>
        <CardButton class='btn-secondary' on:click={leaveGame}>
            Leave
        </CardButton>
        <CardButton class='btn-primary' on:click={changeReady}>
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
