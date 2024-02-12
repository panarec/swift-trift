<script lang="ts">
    import MenuContainer from '../Components/MenuContainer.svelte'
    import RedMarkerIcon from '../Icons/RedMarkerIcon.svelte'
    import GreenMarkerIcon from '../Icons/GreenMarkerIcon.svelte'
    import { resetGame, resetView } from '../../../actions/game'
    import {
        bestScore,
        correctRouteDistance,
        userRouteDistance,
        totalScore,
        modalNoCallback,
        modalYesCallback,
        lobby,
        menuState,
    } from '../../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import CardButton from '../Components/CardButton.svelte'
    import type { LobbyItem } from '../../../actions/types'
    import PlayerCard from '../Components/PlayerCard.svelte'
    import { leaveLobby, readyUp } from '../../../actions/socket'
    import { lobbyTimer } from '../../../actions/helper'

    let userDistance: number
    let correctDistance: number
    let levelSuccessful: boolean
    let totalScoreSaved: number
    let totalBestSaved: number
    let lobbyItem: LobbyItem
    let ready: boolean = false
    let clientWidth: number
    let iconSize: number
    let lobbyTime: number = 15

    let timerValue: string = '15'
    let readyButtonDisabled: boolean = false

    const goToLogin = async () => {
        if (levelSuccessful) {
            modalNoCallback.set(() => menuState.set('levelCompleted'))
            modalYesCallback.set(goLogin)
            menuState.set('menuModal')
        } else {
            goLogin()
        }
    }

    async function goLogin() {
        menuState.set('login')
        let promises: Promise<void>[] = []
        promises.push(resetGame())
        promises.push(resetView())
        await Promise.allSettled(promises)
    }
    const showResults = () => {
        menuState.set('duelResults')
    }

    const leaveGame = async () => {
        await leaveLobby(lobbyItem.lobbyNumber)
    }

    const changeReady = async () => {
        await readyUp(!ready, lobbyItem.lobbyNumber)
        ready = !ready
    }

    onMount(() => {
        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
        clientWidth = document.body.clientWidth
        if (clientWidth < 425) {
            iconSize = 25
        } else if (clientWidth < 554) {
            iconSize = 30
        } else if (clientWidth < 768) {
            iconSize = 40
        } else {
            iconSize = 50
        }

        lobbyTimer.start({
            countdown: true,
            startValues: { seconds: lobbyTime },
        })
        if (
            lobbyItem &&
            lobbyItem.game.gameParams?.currentLevel !==
                lobbyItem.game.gameOptions?.levelsPerGame
        ) {
            lobbyTimer.addEventListener('secondsUpdated', () => {
                timerValue = lobbyTimer.getTimeValues().seconds.toString()
                if (+timerValue === 0) {
                    lobbyTimer.stop()
                    if (ready) return
                    ready = true
                    readyButtonDisabled = true
                    readyUp(ready, lobbyItem.lobbyNumber)
                }
            })
        }

        if (clientWidth < 1000) {
            const resultsTable = document.querySelector(
                '.results-table'
            ) as HTMLElement
            resultsTable.style.position = 'relative'
            resultsTable.style.left = '0'
            resultsTable.style.top = '0'
            resultsTable.style.maxWidth = '100%'
        }

        const card = document.querySelector('.card')
        const menuContainer = document.querySelector(
            '.menu-container'
        ) as HTMLElement
        const backdrop = document.querySelector('.backdrop') as HTMLElement
        const mapContainer = document.querySelector('#map') as HTMLElement
        const container = document.querySelector('.container') as HTMLElement
        const menuPull = document.querySelector('.menu-pull') as HTMLElement

        backdrop.addEventListener('click', () => {
            mapContainer.style.pointerEvents = 'auto'
            menuContainer.style.position = 'absolute'
            menuPull.style.display = 'block'
            anime({
                targets: [menuContainer],
                bottom: '-100%',
                easing: 'easeOutQuint',
                duration: 500,
            }).finished.then(() => {
                container.style.display = 'none'
            })
            anime({
                targets: [menuPull],
                bottom: '-20px',
                delay: 100,
                duration: 500,
            })
        })

        menuPull.addEventListener('mouseenter', () => {
            anime({
                targets: [menuPull],
                bottom: '0px',
                duration: 500,
            })
        })

        menuPull.addEventListener('mouseleave', () => {
            anime({
                targets: [menuPull],
                bottom: '-20px',
                duration: 500,
            })
        })

        menuPull.addEventListener('click', () => {
            container.style.display = 'flex'
            mapContainer.style.pointerEvents = 'none'
            menuPull.style.display = 'none'
            anime({
                targets: [menuPull],
                bottom: '-20px',
                duration: 500,
            })
            anime({
                targets: [menuContainer],
                bottom: '0%',
                easing: 'easeOutQuint',
                duration: 500,
            }).finished.then(() => {
                menuContainer.style.position = 'relative'
            })
        })

        container.style.minHeight = '100vh'

        anime({
            targets: [card],
            height: ['0%', '100%'],
            easing: 'easeOutQuint',
            duration: 500,
        })
        anime({
            targets: [container],
            minHeight: ['0', '100vh'],
            easing: 'easeOutQuint',
            duration: 500,
        })
        userRouteDistance.subscribe((userRouteDistance) => {
            userDistance = userRouteDistance
        })

        correctRouteDistance.subscribe((correctRouteDistance) => {
            correctDistance = correctRouteDistance
        })
        totalScore.subscribe((totalScore) => {
            totalScoreSaved = totalScore
        })
        bestScore.subscribe((bestScore) => {
            totalBestSaved = bestScore
        })
        levelSuccessful = userDistance === correctDistance

        const resultsTable = document.querySelector(
            '.results-table'
        ) as HTMLElement

        if (lobbyItem.players.length >= 4) {
            resultsTable.style.maxWidth = '100%'
        } else if (lobbyItem.players.length >= 3) {
            resultsTable.style.maxWidth = '939px'
        } else if (lobbyItem.players.length >= 2) {
            resultsTable.style.maxWidth = '660px'
        }
    })
</script>

<MenuContainer class="gap-0">
    <body class="outer-body">
        <div class="card">
            <header>
                {#if levelSuccessful}
                    <h2>Level passed</h2>
                {:else}
                    <h2>Level failed</h2>
                {/if}
            </header>
            <body>
                <div class="results">
                    <div class="result-item">
                        <div class="result-item-header">Goal distance:</div>
                        <div class="result-number">
                            <strong>{correctDistance}</strong>
                        </div>
                    </div>
                    <div class="result-icons">
                        <GreenMarkerIcon width={iconSize} height={iconSize} />
                        <span class="dashed-line"></span>
                        <RedMarkerIcon width={iconSize} height={iconSize} />
                    </div>
                    <div class="result-item">
                        <div class="result-item-header">
                            Your route distance:
                        </div>
                        <div
                            class={`result-number ${
                                levelSuccessful ? 'positive' : 'negative'
                            }`}
                        >
                            <strong>{userDistance}</strong>
                        </div>
                    </div>
                    <section class="total-results">
                        <div class="total-score">
                            {#if levelSuccessful}
                                <div>Current Score:</div>
                            {:else}
                                <div>Final Score:</div>
                            {/if}
                            <div class="score-value">{totalScoreSaved}</div>
                        </div>
                        <span class="separator"></span>
                        <div class="total-score">
                            <div>Best Score:</div>
                            <div class="score-value">{totalBestSaved}</div>
                        </div>
                    </section>
                </div>
            </body>
        </div>
        <footer>
            {#if lobbyItem && lobbyItem.game.gameParams?.currentLevel !== lobbyItem.game.gameOptions?.levelsPerGame}
                <CardButton class="btn-secondary" on:click={leaveGame}>
                    Leave
                </CardButton>

                {#if ready}
                    <CardButton
                        class="btn-disabled"
                        disabled={readyButtonDisabled}
                        on:click={changeReady}
                    >
                        Not ready
                    </CardButton>
                {:else}
                    <CardButton
                        class="btn-primary"
                        disabled={readyButtonDisabled}
                        on:click={changeReady}
                    >
                        Ready in {timerValue}
                    </CardButton>
                {/if}
            {:else}
                <CardButton class="btn-primary" on:click={showResults}>
                    Results
                </CardButton>
            {/if}
        </footer>
    </body>
    <div class="results-table">
        <!-- <div class="card leaderboard">Leaderboard</div> -->
        {#if lobbyItem}
            {#each lobbyItem.players as player, index}
                <PlayerCard
                    playerName={player.playerName}
                    rankNumber={index + 1}
                    score={player.score}
                    playerStatus={player.ready}
                    playerColor={player.color}
                    lastLevelScore={player.lastLevelscore}
                    lastLevelTime={player.lastLevelTime}
                />
            {/each}
        {/if}
    </div>
</MenuContainer>
<div class="backdrop"></div>

<style>
    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
    }
    .outer-body {
        max-width: max(500px, calc(100% - 1200px));
        width: 90%;
        margin-top: 2rem;
        z-index: 10;
        position: relative;
    }
    .card {
        grid-column: span 6;
        display: flex;
        gap: 10px;
        flex-direction: column;
        overflow: hidden;
    }
    .result-icons {
        align-items: center;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        max-width: 85%;
        margin: auto;
    }
    .leaderboard {
        font-size: clamp(0.75rem, 4vw, 1.5rem);
        text-align: center;
        font-weight: 900;
        padding-block: 10px;
    }
    .results-table {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin: auto;
        margin-bottom: 50px;
        max-width: 660px;
    }
    h2 {
        font-size: clamp(1rem, 7vw, 3rem);
        margin: 20px;
    }
    .dashed-line {
        flex-grow: 1;
        border-top: min(6px, 1vw) dashed rgba(0, 0, 0, 0.093);
    }
    .total-score {
        font-size: clamp(0.75rem, 4vw, 1.5rem);
        text-align: center;
    }
    footer {
        width: 100%;
        display: flex;
        gap: 30px;
        margin: auto;
        margin-block: 2rem;
    }
    .button-wrapper {
        width: 130px;
    }
    .total-results {
        display: grid;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        grid-template-columns: 1fr auto 1fr;
        margin-block: min(20px, 4vw);
    }
    .result-item {
        position: relative;
    }
    .result-item-header {
        font-size: clamp(0.5rem, 3vw, 1rem);
    }
    .result-number {
        margin-top: 5px;
        font-size: clamp(0.5rem, 3vw, 1rem);
    }
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    .separator {
        width: 2px;
        background-color: #00000015;
        height: min(100px, 13vw);
    }
    .score-value {
        font-weight: 900;
    }

    .timer {
        font-size: clamp(0.75rem, 3vw, 1.2rem);
        font-weight: 900;
        position: absolute;
        top: 50%;
        left: 70%;
        transform: translate(-50%, -50%);
    }
    .timer-width {
        width: 30px;
    }
</style>
