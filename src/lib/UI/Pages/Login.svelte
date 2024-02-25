<script lang="ts">
    import anime from 'animejs'
    import Button from '../Components/Button.svelte'
    import Input from '../Components/Input.svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import Profile from '../Components/Profile.svelte'
    import { onMount } from 'svelte'
    import { fade, scale } from 'svelte/transition'
    import {
        getPlayerName,
        resetLevel,
        resetTotalDuelScore,
        resetTotalSoloScore,
        setPlayerName,
    } from '../../../actions/localStorage'
    import { menuState } from '../../stores'
    import Card from '../Components/Card.svelte'

    let inAnimation: anime.AnimeInstance
    let nickname: string
    let card: HTMLElement

    const setModesMenu = () => {
        menuState.set('modesMenu')
    }

    onMount(() => {
        const container = document.querySelector('.container') as HTMLElement
        container.style.minHeight = '100vh'
        anime({
            targets: [card],
            scale: [0, 1],
            duration: 750,
        })
        resetTotalSoloScore()
        resetTotalDuelScore()
        resetLevel()
        nickname = getPlayerName()
    })
</script>

<MenuContainer>
    <div class="card" bind:this={card}>
        <header>
            <h1>Your profile</h1>
        </header>
        <body>
            <aside class="profile">
                <Profile {nickname} />
            </aside>
            <div class="login-section">
                <Input
                    placeholder="Nickname"
                    bind:valueName={nickname}
                    on:input={() => setPlayerName(nickname)}
                />
                <Button
                    text="Play"
                    class="btn-primary"
                    on:onClick={setModesMenu}
                />
            </div>
        </body>
    </div>
</MenuContainer>

<style>
    .card {
        display: flex;
        flex-direction: column;
        max-width: 500px;
        padding-inline: min(2rem, 5vw);
    }
    header h1 {
        margin-block: min(1rem, 5vw);
    }
    body {
        display: flex;
        flex-direction: column;
    }
    .login-section {
        padding: 20px min(70px, 15vw);
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: min(1rem, 5vw);
    }
    .profile {
        padding-left: 5px;
    }
</style>
