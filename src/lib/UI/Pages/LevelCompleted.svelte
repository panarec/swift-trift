<script lang="ts">
    import anime from 'animejs'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import RedMarkerIcon from '../Icons/RedMarkerIcon.svelte'
    import GreenMarkerIcon from '../Icons/GreenMarkerIcon.svelte'
    import Button from '../Components/Button.svelte'
    import {
        generateGame,
        getGameParams,
        resetGame,
        resetView,
    } from '../../../actions/game'
    import {
        bestSoloScore,
        correctRouteDistance,
        userRouteDistance,
        totalSoloScore,
        modalNoCallback,
        modalYesCallback,
        menuState,
    } from '../../stores'
    import { afterUpdate, onMount } from 'svelte'
    import {
        increaseLevel,
        increaseSoloGamesPlayed,
        resetLevel,
        resetTotalSoloScore,
    } from '../../../actions/localStorage'
    import CardButton from '../Components/CardButton.svelte'
    let levelSuccessful: boolean
    let clientWidth: number
    let iconSize: number
    let levelCompletedValues: {
        userDistance: number
        correctDistance: number 
        totalScoreSaved: number
        totalBestSaved: number
    } = {
        userDistance: 0,
        correctDistance: 0,
        totalScoreSaved: 0,
        totalBestSaved: 0,
    }
    let headerHTML: HTMLElement
    let userDistance: number
    let userDistanceHTML: HTMLElement
    let finalScoreHTML: HTMLElement
    let finalScoreValueHTML: HTMLElement
    let bestScoreHTML: HTMLElement
    let bestScoreValueHTML: HTMLElement
    let headerIcon: HTMLElement
    let goalDistanceHTML: HTMLElement
    let resultIconsHTML: HTMLElement
    let totalResultsHTML: HTMLElement
    let nextButtonHtml: HTMLElement

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
        increaseSoloGamesPlayed()
        increaseLevel()
        getGame()
    }

    function runNewGame() {
        resetLevel()
        resetTotalSoloScore()
        getGame()
    }

    async function getGame() {
        const gameParams = await getGameParams()
        generateGame(gameParams)
    }

    onMount(() => {

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
            })
        })

        anime({
            targets: [menuContainer],
            height: ['0%', '100%'],
            easing: 'easeOutQuint',
            duration: 500,
        })
        // #1
        anime({
            targets: [headerHTML],
            translateY: [-100, 0],
            opacity: [0, 1],
            duration: 1000,
        })
        anime({
            targets: [headerIcon],
            rotate: 360,
            opacity: [0, 1],
            scale: [0, 1.5, 1],
            easing: 'easeInOutSine',
            duration: 1000,
        })
        // #2
        anime({
            targets: [resultIconsHTML],
            width: [0, '100%'],
            easing: 'easeOutQuint',
            duration: 1000,
            delay: 1000,
        })
        // #3
        anime({
            targets: [".result-item"],
            opacity: [0, 1],
            easing: 'easeOutQuint',
            duration: 1000,
            delay: 1500,
        })

        userRouteDistance.subscribe((userRouteDistance) => {
            userDistance = userRouteDistance
            // #4
            anime({
                    targets: [".result-number"],
                    scale: [1, 1.5],
                    easing: 'easeOutQuint',
                    duration: 1000,
                    delay: 2000
                })
            // #5
            anime({
                targets: levelCompletedValues,
                userDistance: userRouteDistance,
                easing: 'easeOutQuint',
                duration: 1000,
                delay: 3000,
                round: 1,
                update: () => {
                    levelCompletedValues.userDistance = Math.round(
                        levelCompletedValues.userDistance
                    )
                }
            }).finished.then(() => {
                //6
                anime({
                    targets: [".result-number"],
                    scale: [1.5, 1],
                    easing: 'easeOutQuint',
                    duration: 1000,
                })
            })
        })

        // #7
        anime({
            targets: [".total-results"],
            opacity: [0, 1],
            easing: 'easeOutQuint',
            duration: 1000,
            delay: 4000,
        })
        anime({
            targets: finalScoreHTML,
            translateX: [-100, 0],
            opacity: [0, 1],
            easing: 'easeOutQuint',
            duration: 1000,
            delay: 4000,
        })
        anime({
            targets: bestScoreHTML,
            translateX: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutQuint',
            duration: 1000,
            delay: 4000,
        }).finished.then(() => {
            // #8
            anime({
                targets: nextButtonHtml,
                scale: [0.8, 1],
                easing: 'easeOutQuint',
                duration: 500,
                loop: true,
                direction: 'alternate',
            })
        })
        correctRouteDistance.subscribe((correctRouteDistance) => {
            levelCompletedValues.correctDistance = correctRouteDistance
        })
        totalSoloScore.subscribe((totalSoloScore) => {
            levelCompletedValues.totalScoreSaved = totalSoloScore
        })
        bestSoloScore.subscribe((bestSoloScore) => {
            levelCompletedValues.totalBestSaved = bestSoloScore
        })
        levelSuccessful = userDistance === levelCompletedValues.correctDistance
    })

</script>

<MenuContainer>
    <body class="outer-body">
        <div class="card">
            <header bind:this={headerHTML}>
                {#if levelSuccessful}
                    <h2>Level completed</h2>
                   <img
                        width={iconSize}
                        height={iconSize}
                        src="https://img.icons8.com/fluency/48/ok--v1.png"
                        alt="success"
                        bind:this={headerIcon}
                    />
                {:else}
                    <h2>Level failed</h2>
                    <img
                        class="result-icon"
                        width={iconSize}
                        height={iconSize}
                        src="https://img.icons8.com/fluency/50/cancel.png"
                        alt="fail"
                        bind:this={headerIcon}
                    />
                {/if}
            </header>
            <body>
                <div class="results">
                    <div class="result-item" bind:this={goalDistanceHTML}>
                        <div class="result-item-header">Goal distance:</div>
                        <div class="result-number">
                            <strong>{levelCompletedValues.correctDistance}</strong>
                        </div>
                    </div>
                    <div class="result-icons" bind:this={resultIconsHTML}>
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
                        <strong bind:this={userDistanceHTML}>{levelCompletedValues.userDistance}</strong>
                    </div>
                    </div>
                    <section class="total-results" bind:this={totalResultsHTML}>
                        <div class="total-score" bind:this={finalScoreHTML}>
                            {#if levelSuccessful}
                                <div>Current Score:</div>
                            {:else}
                                <div>Final Score:</div>
                            {/if}
                            <div class="score-value" bind:this={finalScoreValueHTML}>{levelCompletedValues.totalScoreSaved}</div>
                        </div>
                        <span class="separator"></span>
                        <div class="total-score" bind:this={bestScoreHTML}>
                            <div>Best Score:</div>
                            <div class="score-value" bind:this={bestScoreValueHTML}>{levelCompletedValues.totalBestSaved}</div>
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
                <CardButton class="btn-primary" on:click={runNextGame} bind:button={nextButtonHtml}>
                    Next
                </CardButton>
            {:else}
                <CardButton class="btn-primary" on:click={runNewGame} bind:button={nextButtonHtml}>
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
