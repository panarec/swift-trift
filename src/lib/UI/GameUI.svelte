<script lang="ts">
    import { onMount } from 'svelte'
    import {
        bestScore,
        menuState,
        modalNoCallback,
        modalYesCallback,
        totalScore,
    } from '../stores'
    import Button from './Button.svelte'
    import {
        getLevel,
        resetLevel,
        resetTotalScore,
    } from '../../actions/localStorage'
    import {
        generateGame,
        loadingNextGame,
        resetGame,
        resetView,
    } from '../../actions/game'
    import anime from 'animejs'
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

    function getNewGame() {
        resetTotalScore()
        resetLevel()
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

    function toggleGameMenu() {
        const gameMenu = document.querySelector('.game-menu')
        const doubleArrow = document.querySelector('#double-arrow')
        if (gameMenuToggled) {
            anime({
                targets: gameMenu,
                bottom: '-290px',
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
        totalScore.subscribe((totalScore) => {
            totalScoreSaved = totalScore
        })
        bestScore.subscribe((bestScore) => {
            totalBestSaved = bestScore
        })
        anime({
            targets: gameMenuToggle,
            top: ['0', '-65px'],
        })
    })
</script>

<div class="card game-menu">
    <button class="card" id="game-menu-toggle" on:click={toggleGameMenu}>
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
            <Button text="Menu" class='btn-primary' on:onClick={goToLogin}></Button>
        </div>
        <div class="button-wrapper">
            <Button text="New Game" class='btn-primary' on:onClick={runNewGame}></Button>
        </div>
    </footer>
</div>

<style>
    #game-menu-toggle {
        width: auto;
        top: -65px;
        bottom: auto;
        position: absolute;
        box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        clip-path: inset(-10px -10px 0px -10px);
        padding-inline: 10px;
        cursor: pointer;
    }
    header h3 {
        margin-top: 20px;
    }
    h3 {
        margin-block: 10px;
    }
    .card {
        position: absolute;
        overflow: visible;
        z-index: 10;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        border-radius: 15px 15px 0px 0px;
    }
    .game-menu {
        bottom: -290px;
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
