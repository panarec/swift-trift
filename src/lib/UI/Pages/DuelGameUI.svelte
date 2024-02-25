<script lang="ts">
    import { onMount } from 'svelte'
    import {
        lobby,
        menuState,
        modalNoCallback,
        modalYesCallback,
        totalDuelScore,
    } from '../../stores'
    import Button from '../Components/Button.svelte'
    import { resetGame, resetView } from '../../../actions/game'
    import anime from 'animejs'
    import { Timer } from 'easytimer.js'
    import type { LobbyItem } from '../../../actions/types'
    import { triggerFinnishLevel } from '../../../actions/roadDetector'
    import { gameTimer } from '../../../actions/helper'
    import { leaveLobby } from '../../../actions/socket'

    let currentScore: number
    let currentTime: number
    let gameMenuToggled: boolean = false
    let lobbyItem: LobbyItem
    let minutes: string
    let seconds: string

    const goToLogin = async () => {
        modalNoCallback.set(() => menuState.set('gameUI'))
        modalYesCallback.set(() => {
            menuState.set('login')
            leaveLobby(lobbyItem.lobbyNumber)
            let promises: Promise<void>[] = []
            promises.push(resetGame())
            promises.push(resetView())
            Promise.allSettled(promises)
        })
        menuState.set('menuModal')
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
        anime({
            targets: gameMenuToggle,
            top: ['0', '-65px'],
        })
        const playerName = localStorage.getItem('playerName')
        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
        if (playerName && lobbyItem && lobbyItem.players.length > 0) {
            totalDuelScore.subscribe((totalDuelScore) => {
                currentScore = totalDuelScore
            })
            currentTime =
                lobbyItem.players.find(
                    (player) => player.playerName === playerName
                )?.totalTime || 0
        }

        seconds = (lobbyItem.game.gameOptions.timeLimit % 60)
            .toString()
            .padStart(2, '0')
        minutes = Math.floor(lobbyItem.game.gameOptions.timeLimit / 60)
            .toString()
            .padStart(2, '0')

        gameTimer.stop()
        gameTimer.start({
            countdown: true,
            startValues: { seconds: lobbyItem.game.gameOptions.timeLimit },
            callback: (e) => {
            minutes = gameTimer
                .getTimeValues()
                .minutes.toString()
                .padStart(2, '0')
            seconds = gameTimer
                .getTimeValues()
                .seconds.toString()
                .padStart(2, '0')
            if (minutes === '00' && seconds === '00') {
                triggerFinnishLevel()
            }
        }
        })

    })
</script>

{#if lobbyItem}
    <div class="upper-menu">
        <div class="time">
            <img
                width="48"
                height="48"
                src="https://img.icons8.com/fluency/48/time--v1.png"
                alt="time--v1"
                class="time-icon"
            />
            <span id="minutes">{minutes}</span>:<span id="seconds"
                >{seconds}</span
            >
        </div>
        <div class="level">
            <img
                width="48"
                height="48"
                src="https://img.icons8.com/fluency/48/adventure.png"
                alt="adventure"
                class="map-icon"
            />
            <span
                >{`${lobbyItem.game.gameParams?.currentLevel}/${lobbyItem.game.gameOptions.levelsPerGame}`}</span
            >
        </div>
    </div>
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
            <h3>
                {`Level - ${lobbyItem.game.gameParams?.currentLevel}/${lobbyItem.game.gameOptions.levelsPerGame}`}
            </h3>
        </header>
        <body>
            <h3>Overall Statistics</h3>
            <section class="statistics">
                <div class="total-score">
                    <div>Current Score:</div>
                    <div class="score-value">{currentScore}</div>
                </div>
                <span class="separator"></span>
                <div class="total-score">
                    <div>Time:</div>
                    <div class="score-value">
                        {`${(currentTime % 60).toString().padStart(2, '0')}:${(
                            currentTime % 60
                        )
                            .toString()
                            .padStart(2, '0')}`}
                    </div>
                </div>
            </section>
        </body>
        <footer>
            <div class="button-wrapper">
                <Button text="Leave" class="btn-primary" on:onClick={goToLogin}
                ></Button>
            </div>
        </footer>
    </div>
{/if}

<style>
    #game-menu-toggle {
        width: auto;
        position: absolute;
        top: -67px;
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
        justify-content: center;
        margin-bottom: 20px;
    }
    .button-wrapper {
        width: 130px;
    }

    .upper-menu {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);

        z-index: 10;
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }
    .upper-menu > div {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: clamp(1rem, 5vw, 1.5rem);
        font-weight: 900;
        text-align: center;
        box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
        border-radius: 0px 0px 5px 5px;
        padding: min(15px, 3vw) min(20px, 5vw);
        background-color: #ffffff;
    }
    .time {
        width: min(120px, 28vw);
    }
    .time-icon {
        width: min(30px, 7vw);
        height: min(30px, 7vw);
    }
    .map-icon {
        width: min(30px, 7vw);
        height: min(30px, 7vw);
    }
</style>
