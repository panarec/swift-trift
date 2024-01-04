<script lang="ts">
    import anime from 'animejs'
    import { menuState } from '../stores'
    import Button from './Button.svelte'
    import Input from './Input.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import Profile from './Profile.svelte'
    import { onMount } from 'svelte'
    import { fade, scale } from 'svelte/transition'
    import { getPlayerName, resetTotalScore, setPlayerName } from '../../actions/localStorage'

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
        max-width: max(600px, calc(100% - 1200px));

    }
    body {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
        column-gap: 30px;
        margin-bottom: 45px;
    }
    .login-section {
        padding-block: 20px;
    }
    .profile {
        padding-block: 20px;
        padding-left: 5px;
    }
</style>
