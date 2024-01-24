<script lang="ts">
    import MenuContainer from './MenuContainer.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import { lobby, menuState } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import PlayerCard from '../PlayerCard.svelte'
    import Button from '../Button.svelte'
    import { changeLobbySettings, leaveLobby, readyUp } from '../../../actions/socket'
    import CardButton from '../CardButton.svelte'
    import type { LobbyItem } from '../../../actions/types'
    import Input from '../Input.svelte'
    import NumberInput from '../NumberInput.svelte'
    import ClipboardCopyButton from '../../ClipboardCopyButton.svelte'
    import ButtonGroup from '../ButtonGroup.svelte'
    let inAnimation: anime.AnimeInstance
    let lobbyNumber: string | null
    let lobbyItem: LobbyItem
    let ready: boolean = false
    let body: HTMLElement
    let difficultyValue: string 
    onMount(() => {
        // const card = document.querySelector('.card')
        // inAnimation = anime({
        //     targets: [card],
        //     scale: [0, 1],
        //     autoplay: false,
        //     duration: 750,
        // })
        // inAnimation.play()
        lobbyNumber = sessionStorage.getItem('lobbyNumber')

        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
        console.log(lobbyItem)
    })

    const leaveGame = async () => {
        await leaveLobby()
    }

    const changeReady = async () => {
        await readyUp(!ready)
        ready = !ready
    }

    $: {
        if (body && lobbyItem) {
            if (lobbyItem.players.length >= 4) {
                body.style.maxWidth = '100%'
            } else if (lobbyItem.players.length === 3) {
                body.style.maxWidth = '939px'
            } else if (lobbyItem.players.length === 2) {
                body.style.maxWidth = '700px'
            } else if (lobbyItem.players.length === 1) {
                body.style.maxWidth = '400px'
            }
            console.log(difficultyValue)
        }
    }
</script>

{#if lobbyItem}
<MenuContainer class="">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <div class="outer-body">
        <div class="card">
            <header>
                <h2>
                    Lobby <ClipboardCopyButton text={lobbyNumber} />
                </h2>
            </header>
            <body>
                <div class="lobby-settings">
                    <div class="settings-item">
                        <div class="settings-item-label">Levels: </div>
                        <div class="settings-item-value"
                            ><NumberInput
                                maxValue={99}
                                minValue={0}
                                value={lobbyItem.game.gameOptions.levelsPerGame}
                                on:input={(event) => changeLobbySettings({...lobbyItem.game.gameOptions, levelsPerGame: event.detail})}
                            /></div
                        >
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-label">Level time:</div>
                        <div class="settings-item-value"
                            ><NumberInput
                                maxValue={999}
                                minValue={0}
                                value={lobbyItem.game.gameOptions.timeLimit}
                                on:input={(event) => changeLobbySettings({...lobbyItem.game.gameOptions, timeLimit: event.detail})}
                                step={5}
                            /></div
                        >
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-label">Difficulty:</div>
                        <div class="settings-item-value"
                            >
                            <ButtonGroup userSelected={lobbyItem.game.gameOptions.difficulty} >

                            </ButtonGroup>
                            </div
                        >
                    </div>
                </div>
            </body>
        </div>
    </div>
    <body bind:this={body}>
        {#if lobbyItem}
            {#each lobbyItem.players as player, index}
                <PlayerCard
                    playerName={player.playerName}
                    rankNumber={index + 1}
                    score={player.score}
                    playerStatus={player.ready}
                    playerColor={player.color}
                    playersCount={lobbyItem.players.length}
                />
            {/each}

        {/if}
    </body>
    <footer>
        <CardButton class="btn-secondary" on:click={leaveGame}>
            Leave
        </CardButton>
        {#if ready}
            <CardButton class="btn-disabled" on:click={changeReady}>
                Not ready
            </CardButton>
        {:else}
            <CardButton class="btn-primary" on:click={changeReady}>
                Ready
            </CardButton>
        {/if}
    </footer>
</MenuContainer>
{/if}

<style>
    .outer-body {
        max-width: max(500px, calc(100% - 1200px));
        z-index: 10;
    }
    h2 {
        font-size: clamp(1rem, 7vw, 2rem);
        margin: min(20px, 5vw);
    }
    body {
        width: 100%;
        max-width: 800px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 40px 30px;
    }

    footer {
        width: 100%;
        max-width: 400px;
        display: flex;
        gap: 30px;
        margin-top: 1rem;
        margin-bottom: 4rem;
    }

    .lobby-settings {
        display: grid;
        grid-template-columns: repeat(auto-fit, 1fr);
        gap: 10px;
        border-radius: 10px;
        margin-top: 1rem;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 500;
        width: 100%;
        max-width: 500px;
    }
    .settings-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem min(1rem, 1vw);
        border-radius: 10px;
        background-color: #e9e9e96c;
    }
    .settings-item:last-child {
        grid-column: span 2;
    }
    .settings-item-label {
        color: #777777;
        font-size: clamp(0.75rem, 3vw, 1.2rem);
    }
    .settings-item-value {
        font-weight: 900;
    }

    @media only screen and (max-width: 400px) {
        body {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
    }
</style>
