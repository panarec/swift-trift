<script lang="ts">
    import Card from './Card.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import RedMarkerIcon from './Icons/RedMarkerIcon.svelte'
    import GreenMarkerIcon from './Icons/GreenMarkerIcon.svelte'
    import Profile from './Profile.svelte'
    import Button from './Button.svelte'
    import {
        generateGame,
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
    } from '../stores'
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import { increaseLevel, resetLevel, resetTotalScore } from '../../actions/localStorage'
    let inAnimation: anime.AnimeInstance

    let userDistance: number
    let correctDistance: number
    let levelSuccessful: boolean
    let totalScoreSaved: number
    let totalBestSaved: number

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

    function getGame() {
        menuState.set('loading')
        function checkIfLoaded() {
            if (loadingNextGame) {
                return
            }
            generateGame()
            menuState.set('')
            clearInterval(checkingInterval)
        }
        const checkingInterval = setInterval(checkIfLoaded, 1000)
    }

    onMount(() => {
        const card = document.querySelector('.card')
        const scoreValue = document.querySelector('.score-value')
        const container = document.querySelector('.container') as HTMLElement

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
    })
</script>

<MenuContainer>
    <body class="outer-body">
        <div class="card">
            <header>
                {#if levelSuccessful}
                    <h2>Level completed</h2>
    
                    <img
                        width="50"
                        height="50"
                        src="https://img.icons8.com/fluency/50/ok--v1.png"
                        alt="ok--v1"
                    />
                {:else}
                    <h2>Level failed</h2>
    
                    <img
                        class="result-icon"
                        width="50"
                        height="50"
                        src="https://img.icons8.com/fluency/50/cancel.png"
                        alt="cancel"
                    />
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
            <footer>
                <div class="button-wrapper">
                    <Button text="Menu" class='btn-primary' on:onClick={goToLogin}></Button>
                </div>
                {#if levelSuccessful}
                    <div class="button-wrapper">
                        <Button text="Next" class='btn-primary' on:onClick={runNextGame}></Button>
                    </div>
                {:else}
                    <div class="button-wrapper">
                        <Button text="New Game" class='btn-primary' on:onClick={runNewGame}></Button>
                    </div>
                {/if}
            </footer>
        </div>
    </body>
</MenuContainer>

<style>
    .outer-body {
        max-width: max(500px, calc(100% - 1200px));
        width: 90%;
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
        font-size: clamp(1rem, 10vw, 3rem);
        margin: 20px;
    }
    .dashed-line {
        flex-grow: 1;
        border-top: 6px dashed rgba(0, 0, 0, 0.093);
    }
    .profile {
        max-width: 230px;
    }
    .total-score {
        font-size: 1.5rem;
        text-align: center;
    }
    footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 20px;
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
