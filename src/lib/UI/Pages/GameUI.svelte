<script lang="ts">
    import { onMount } from 'svelte'
    import {
        bestSoloScore,
        menuState,
        modalNoCallback,
        modalYesCallback,
        totalSoloScore,
    } from '../../stores'
    import Button from '../Components/Button.svelte'
    import {
        getLevel,
        resetLevel,
        resetTotalSoloScore,
    } from '../../../actions/localStorage'
    import {
        generateGame,
        getGameParams,
        loadingNextGame,
        resetGame,
        resetView,
    } from '../../../actions/game'
    import anime from 'animejs'
    import { Timer } from 'easytimer.js'

    const timer = new Timer()

    let totalScoreSaved: number
    let totalBestSaved: number
    let gameMenuToggled: boolean = false
    const goToLogin = async () => {
        modalNoCallback.set(() => menuState.set('gameUI'))
        modalYesCallback.set(() => {
            menuState.set('login')
            let promises: Promise<void>[] = []
            promises.push(resetGame())
            promises.push(resetView())
            Promise.allSettled(promises)
        })
        menuState.set('menuModal')
    }

    function runNewGame() {
        modalNoCallback.set(() => menuState.set('gameUI'))
        modalYesCallback.set(getNewGame)
        menuState.set('newGameModal')
    }

    async function getNewGame() {
        resetTotalSoloScore()
        resetLevel()
        menuState.set('loadingGame')
        const gameParams = await getGameParams()
        generateGame(gameParams)
        menuState.set('')
    }

    function toggleGameMenu() {
        const gameMenu = document.querySelector('.game-menu')
        const doubleArrow = document.querySelector('#double-arrow')
        if (gameMenuToggled) {
            anime({
                targets: gameMenu,
                bottom: '-280px',
                easing: 'easeOutQuint',
            })
            anime({
                targets: doubleArrow,
                rotate: '0deg',
            })
            gameMenuToggled = false
        } else {
            anime({
                targets: gameMenu,
                bottom: '0px',
                easing: 'easeOutQuint',
            })
            anime({
                targets: doubleArrow,
                rotate: '180deg',
            })
            gameMenuToggled = true
        }
    }

    onMount(() => {
        const gameMenuToggle = document.querySelector('#game-menu-toggle')
        totalSoloScore.subscribe((totalSoloScore) => {
            totalScoreSaved = totalSoloScore
        })
        bestSoloScore.subscribe((bestSoloScore) => {
            totalBestSaved = bestSoloScore
        })
        anime({
            targets: gameMenuToggle,
            top: ['0', '-65px'],
        })
    })
</script>

<div class="card game-menu">
    <button id="game-menu-toggle" on:click={toggleGameMenu}>
        <img
            id="double-arrow"
            width="64"
            height="64"
            src="https://img.icons8.com/pastel-glyph/64/double-up.png"
            alt="double-up"
        />
    </button>
    <header>
        <h3>{`Level - ${getLevel()}`}</h3>
    </header>
    <body>
        <h3>Overall Statistics</h3>
        <section class="statistics">
            <div class="total-score">
                <div>Current Score:</div>
                <div class="score-value">{totalScoreSaved}</div>
            </div>
            <span class="separator"></span>
            <div class="total-score">
                <div>Best Score:</div>
                <div class="score-value">{totalBestSaved}</div>
            </div>
        </section>
    </body>
    <footer>
        <div class="button-wrapper">
            <Button text="Menu" class="btn-primary" on:onClick={goToLogin}
            ></Button>
        </div>
        <div class="button-wrapper">
            <Button text="New Game" class="btn-primary" on:onClick={runNewGame}
            ></Button>
        </div>
    </footer>
</div>

<style>
    #game-menu-toggle {
        width: auto;
        position: absolute;
        top: -80px;
        transform: translateX(-50%);
        box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        clip-path: inset(-10px -10px 0px -10px);
        padding-inline: 10px;
        cursor: pointer;
        border-radius: 10px 10px 0px 0px;
        background-color: #ffffff;
    }
    header h3 {
        margin-top: 20px;
    }
    h3 {
        margin-block: 10px;
    }
    .game-menu {
        position: absolute;
        overflow: visible;
        z-index: 10;
        left: 50%;
        bottom: -280px;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        border-radius: 15px 15px 0px 0px;
    }
    .statistics {
        display: grid;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        grid-template-columns: 1fr auto 1fr;
        margin-bottom: 30px;
    }
    .separator {
        width: 2px;
        background-color: #00000015;
        height: 100px;
    }
    .score-value {
        font-weight: 900;
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
</style>
