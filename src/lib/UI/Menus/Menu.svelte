<script lang="ts">
    import Loading from '../Loading.svelte'
    import Intro from '../Intro.svelte'
    import MainMenu from './ModesMenu.svelte'
    import MenuCard from './MenuCard.svelte'
    import MenuHeader from './MenuHeader.svelte'
    import MenuHeared from './MenuHeader.svelte'
    import SoloMenu from './SoloMenu.svelte'
    import Login from '../Login.svelte'
    import ModesMenu from './ModesMenu.svelte'
    import HowToPlay from '../HowToPlay.svelte'
    import LevelCompleted from '../LevelCompleted.svelte'
    import { menuState } from '../../stores'
    import type { Writable } from 'svelte/store'
    import Modal from '../Modal.svelte'
    import GameUi from '../GameUI.svelte'
    import { map } from 'lodash'
    import { onMount } from 'svelte'
    import DuelMenu from './DuelMenu.svelte'
    import DuelLobby from './DuelLobby.svelte'
    import JoinRoom from './JoinRoom.svelte'
    import LevelCompletedDuel from '../LevelCompletedDuel.svelte'

    let state: string

    menuState.subscribe((menuState) => {
        state = menuState
    })
    onMount(() => {
        const mapContainer = document.querySelector('.container') as HTMLElement
        if (state === '') {
            mapContainer.style.pointerEvents = 'none'
        }
    })
</script>

{#if state === 'gameUI'}
    <GameUi />
{:else}
    <div class={`container `}>
        {#if state === 'intro'}
            <Intro />
        {:else if state === 'login'}
            <Login />
        {:else if state === 'modesMenu'}
            <ModesMenu />
        {:else if state === 'soloMenu'}
            <SoloMenu />
        {:else if state === 'loadingGame'}
            <Loading text="Looking for deliveries..." />
        {:else if state === 'waitingForPlayers'}
            <Loading text="Waiting for other players..." />
        {:else if state === 'duelMenu'}
            <DuelMenu />
        {:else if state === 'duelRoom'}
            <DuelLobby />
        {:else if state === 'joinRoom'}
            <JoinRoom />
        {:else if state === 'howtoplay'}
            <HowToPlay />
        {:else if state === 'levelCompletedDuel'}
            <LevelCompletedDuel />
        {:else if state === 'levelCompleted'}
            <LevelCompleted />
        {:else if state === 'menuModal'}
            <Modal>
                <h3>Do you really want to go back to menu?</h3>
                <p>Your progress will be lost.</p>
            </Modal>
        {:else if state === 'newGameModal'}
            <Modal>
                <h3>Do you really want to find new game?</h3>
                <p>Your progress will be lost.</p>
            </Modal>
        {/if}
    </div>
    <div class="menu-pull">
        <span></span>
    </div>
{/if}

<style>
    .container {
        min-height: 100svh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: auto;
        width: 90%;
    }
    .peIgnore {
        pointer-events: none;
    }
    .menu-pull {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 500px;
        height: 50px;
        background-color: #fff;
        border-radius: 15px 15px 0 0;
        z-index: 10;
        box-shadow: 0px 6px 19px -4px rgba(0, 0, 0, 0.75);
        display: none;
        cursor: pointer;
    }

    .menu-pull span {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 5px;
        background-color: #0000006a;
        border-radius: 5px;
    }
</style>
