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
            await leaveLobby()
    }

    const changeReady = async () => {
        await readyUp(!ready)
        ready = !ready
    }


</script>

<MenuContainer class="">
    <MenuHeader heading={`Lobby #${lobbyNumber || ""}`} class=""/>
    <body>
        {#if lobbyItem}
        {#each lobbyItem.players as player, index}
            <PlayerCard playerName={player.playerName} rankNumber={index + 1} score={player.score} playerStatus={player.ready} />
        {/each}
        {/if}
    </body>
    <footer>
        <CardButton class='btn-secondary' on:click={leaveGame}>
            Leave
        </CardButton>
        {#if ready}
        <CardButton class='btn-disabled' on:click={changeReady}>
            Not ready
        </CardButton>
        {:else}
        <CardButton class='btn-primary' on:click={changeReady}>
            Ready
        </CardButton>
        {/if}
    </footer>
</MenuContainer>

<style>
    body {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        gap: 20px 30px;
    }

    footer{
        width: 100%;
        max-width: 400px;
        display: flex;
        gap: 30px;
        margin-bottom: 4rem;
    }
</style>
