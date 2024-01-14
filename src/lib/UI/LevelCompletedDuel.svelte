<script lang="ts">
    import Card from './Card.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import RedMarkerIcon from './Icons/RedMarkerIcon.svelte'
    import GreenMarkerIcon from './Icons/GreenMarkerIcon.svelte'
    import Profile from './Profile.svelte'
    import Button from './Button.svelte'
    import {
        generateGame,
        getGameParams,
        loadingNextGame,
        resetGame,
        resetView,
    } from '../../actions/game'
    import {
        bestScore,
        correctRouteDistance,
        menuState,
        userRouteDistance,
        totalScore,
        modalNoCallback,
        modalYesCallback,
        lobby,
    } from '../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import { increaseLevel, resetLevel, resetTotalScore } from '../../actions/localStorage'
    import CardButton from './CardButton.svelte'
    import type { LobbyItem } from '../../actions/types'
    import PlayerCard from './PlayerCard.svelte'
    import { leaveLobby, readyUp } from '../../actions/socket'
    let inAnimation: anime.AnimeInstance

    let userDistance: number
    let correctDistance: number
    let levelSuccessful: boolean
    let totalScoreSaved: number
    let totalBestSaved: number
    let lobbyItem: LobbyItem
    let ready: boolean = false

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

    const leaveGame = async () => {
            await leaveLobby()
    }

    const changeReady = async () => {
        await readyUp(!ready)
        ready = !ready
    }

    onMount(() => {
        const card = document.querySelector('.card')
        const menuContainer = document.querySelector('.menu-container') as HTMLElement
        const backdrop = document.querySelector('.backdrop') as HTMLElement
        const mapContainer = document.querySelector('#map') as HTMLElement
        const container = document.querySelector('.container') as HTMLElement
        const menuPull = document.querySelector('.menu-pull') as HTMLElement
        const appBody = document.querySelector('#app-body') as HTMLElement

        backdrop.addEventListener('click', () => {
            mapContainer.style.pointerEvents = 'auto'
                menuContainer.style.position = 'absolute'
                menuPull.style.display = 'block'
                appBody.style.overflow = 'hidden'
                anime({
                targets: [menuContainer],
                bottom: "-100%",
                easing: 'easeOutQuint',
                duration: 500,
            }).finished.then(() => {
                container.style.display = 'none'
            })
            anime({
                targets: [menuPull],
                bottom: "-20px",
                delay: 100,
                duration: 500,
               })
        })

        menuPull.addEventListener('mouseenter', () => {
            anime({
                targets: [menuPull],
                bottom: "0px",
                duration: 500,
            })
        })

        menuPull.addEventListener('mouseleave', () => {
            anime({
                targets: [menuPull],
                bottom: "-20px",
                duration: 500,
            })
        })

        menuPull.addEventListener('click', () => {
            container.style.display = 'flex'
            mapContainer.style.pointerEvents = 'none'
            menuPull.style.display = 'none'
            anime({
                targets: [menuPull],
                bottom: "-20px",
                duration: 500,
            })
            anime({
                targets: [menuContainer],
                bottom: "0%",
                easing: 'easeOutQuint',
                duration: 500,
            }).finished.then(() => {
                menuContainer.style.position = 'relative'
                appBody.style.overflow = 'auto'
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

        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
    })

</script>

<MenuContainer>
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
                        <div>Goal distance:</div>
                        <div class="result-number">
                            <strong>{correctDistance}</strong>
                        </div>
                    </div>
                    <div class="result-icons">
                        <GreenMarkerIcon />
                        <span class="dashed-line"></span>
                        <RedMarkerIcon />
                    </div>
                    <div class="result-item">
                        <div>Your route distance:</div>
                        <div class={`result-number ${levelSuccessful ? "positive" : "negative"}`}>
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
        <div class="results-table">
            {#if lobbyItem}
            {#each lobbyItem.players as player, index}
                <PlayerCard playerName={player.playerName} rankNumber={index + 1} score={player.score} playerStatus={player.ready}/>
            {/each}
            {/if}
        </div>
        <footer>
            <CardButton 
             class='btn-secondary' on:click={leaveGame}>
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
    </body>
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
    .results-table {
       margin-block: 2rem;
         display: flex;
        flex-direction: column;
        gap: 20px;
    }
    h2 {
        font-size: clamp(1rem, 10vw, 3rem);
        margin: 20px;
    }
    .dashed-line {
        flex-grow: 1;
        border-top: 6px dashed rgba(0, 0, 0, 0.093);
    }
    .total-score {
        font-size: 1.5rem;
        text-align: center;
    }
    footer {
        width: 100%;
        display: flex;
        gap: 30px;
        margin: auto;
        margin-bottom: 4rem;
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

        margin-block: 30px;
    }
    .result-item {
        position: relative;
    }
    .result-number {
        margin-top: 5px;
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
        height: 100px;
    }
    .score-value {
        font-weight: 900;
    }
</style>
