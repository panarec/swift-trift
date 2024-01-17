<script lang="ts">
    import anime from 'animejs'
    import { menuState } from '../stores'
    import Button from './Button.svelte'
    import Input from './Input.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import Profile from './Profile.svelte'
    import { onMount } from 'svelte'
    import { fade, scale } from 'svelte/transition'
    import { getPlayerName, resetLevel, resetTotalScore, setPlayerName } from '../../actions/localStorage'

    let inAnimation: anime.AnimeInstance
    let nickname: string

    const setModesMenu = () => {
        menuState.set('modesMenu')
    }

    onMount(() => {
        const container = document.querySelector('.container') as HTMLElement
        container.style.minHeight = '100vh'
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            height: ['0%', '100%'],
            autoplay: false,
            easing: 'easeOutQuint',
            duration: 500,
        })
        inAnimation.play()
        resetTotalScore()
        resetLevel()
        nickname = getPlayerName()
    })


</script>

<MenuContainer>
    <div class="card">
        <header>
            <h1>Lorem Ipsum</h1>
        </header>
        <body>
            <aside class="profile">
                <Profile nickname={nickname} />
            </aside>
            <div class="login-section">
                <Input placeholder="Nickname" bind:valueName={nickname} on:input={() => setPlayerName(nickname)} />
                <Button text="Play" class='btn-primary' on:onClick={setModesMenu} />
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
    header h1{
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
        gap: 10px;
        margin-top: min(1rem, 5vw);
    }
    .profile {
        padding-left: 5px;
    }
</style>
