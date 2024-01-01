<script lang="ts">
    import CreateIcon from '../Icons/CreateIcon.svelte'
    import JoinIcon from '../Icons/JoinIcon.svelte'
    import { generateGame } from '../../../actions/game'
    import MenuCard from './MenuCard.svelte'
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { lobbyPlayers, menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import { resetLevel } from '../../../actions/localStorage'
    import BackButton from '../BackButton.svelte'
    import Card from '../Card.svelte'
    import PlayerCard from '../PlayerCard.svelte'
    import Button from '../Button.svelte'
    import { leaveLobby } from '../../../actions/socket'
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

<MenuContainer class="col-start-5 col-end-9">
    <MenuHeader heading={`Lobby #${lobbyNumber || ""}`} class="col-start-1 col-end-7"/>
    {#if players}
    {#each players as player}
     <PlayerCard playerName={player.playerName} />
    {/each}
    <Button text="Leave" class='col-start-1 col-end-4 btn-secondary' on:onClick={leaveGame} />
    <Button text="Play" class='col-start-4 col-end-7 btn-primary'on:onClick={startGame} />
{/if}

</MenuContainer>

<style>

</style>
