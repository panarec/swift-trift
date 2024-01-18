<script lang="ts">
    import MenuContainer from './Menus/MenuContainer.svelte'
    import RedMarkerIcon from './Icons/RedMarkerIcon.svelte'
    import GreenMarkerIcon from './Icons/GreenMarkerIcon.svelte'
    import Button from './Button.svelte'
    import {
        generateGame,
        getGameParams,
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
    } from '../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import {
        increaseLevel,
        resetLevel,
        resetTotalScore,
    } from '../../actions/localStorage'
    import CardButton from './CardButton.svelte'
    let inAnimation: anime.AnimeInstance

    let userDistance: number
    let correctDistance: number
    let levelSuccessful: boolean
    let totalScoreSaved: number
    let totalBestSaved: number
    let clientWidth: number
    let iconSize: number

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

    function runNextGame() {
        increaseLevel()
        getGame()
    }

    function runNewGame() {
        resetLevel()
        resetTotalScore()
        getGame()
    }

    async function getGame() {
        const gameParams = await getGameParams()
        generateGame(gameParams)
    }

    onMount(() => {
        clientWidth = document.body.clientWidth
        if(clientWidth < 425){
            iconSize = 25
        } else if (clientWidth < 554) {
            iconSize = 30
        } else if (clientWidth < 768) {
            iconSize = 40
        } else {
            iconSize = 50
        }
        const menuContainer = document.querySelector(
            '.menu-container'
        ) as HTMLElement
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
                bottom: '-80%',
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
                appBody.style.overflow = 'auto'
            })
        })

        anime({
            targets: [menuContainer],
            height: ['0%', '100%'],
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
    })
</script>

<MenuContainer>
    <body class="outer-body">
        <div class="card">
            <header>
                {#if levelSuccessful}
                    <h2>Level completed</h2>
                    <img
                        width={iconSize}
                        height={iconSize}
                        src="https://img.icons8.com/fluency/50/ok--v1.png"
                        alt="ok--v1"
                    />
                {:else}
                    <h2>Level failed</h2>
                    <img
                        class="result-icon"
                        width={iconSize}
                        height={iconSize}
                        src="https://img.icons8.com/fluency/50/cancel.png"
                        alt="cancel"
                    />
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
                        <div class="result-item-header" >Your route distance:</div>
                        <div class="result-number">
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
            <CardButton class="btn-secondary" on:click={goToLogin}>
                Menu
            </CardButton>
            {#if levelSuccessful}
                <CardButton class="btn-primary" on:click={runNextGame}>
                    Next
                </CardButton>
            {:else}
                <CardButton class="btn-primary" on:click={runNewGame}>
                    New Game
                </CardButton>
            {/if}
        </footer>
    </body>
</MenuContainer>
<div class="backdrop"></div>

<style>
    .outer-body {
        max-width: max(500px, calc(100% - 1200px));
        width: 90%;
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
    h2 {
        font-size: clamp(1rem, 7vw, 3rem);
        margin: min(20px, 5vw);
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
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .total-results {
        display: grid;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        grid-template-columns: 1fr auto 1fr;
        margin-block: min(30px, 4vw);
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
    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
    }
    footer {
        width: 100%;
        display: flex;
        gap: 30px;
        margin: auto;
        margin-block: 2rem;
    }
</style>
