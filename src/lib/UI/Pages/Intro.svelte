<script lang="ts">
    import { onMount } from 'svelte'
    import { fade, fly, scale } from 'svelte/transition'
    import Button from '../Components/Button.svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import anime from 'animejs'
    import MapIcon from '../Icons/MapIcon.svelte'
    import { menuState } from '../../stores'

    let inAnimation: anime.AnimeInstance

    function setMainMenu() {
        menuState.set('login')
    }

    onMount(() => {
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            height: ['0%', '100%'],
            autoplay: false,
            easing: 'easeOutQuint',
            duration: 500,
        })
        inAnimation.play()
    })
</script>

<MenuContainer class="">
    <div class="card">
        <header>
            <h1>Swift-trift</h1>
        </header>
        <body>
            <section>
                <img src="../../../../public/imgs/logo.png" id="logo" alt="">
            </section>
            <article>
                <p>
                    Ahoj!
                    <br>
                    Welcome to the Swift-trift. Navigate bustling streets, choose the most efficient routes, and deliver your packages on time to become the ultimate delivery champion!
                    <br>
                    <br>
                    Please, note that this is a alpha version. Lot of bugs will most probably occur ;)
                    <br>
                    <br>
                    <i>Enjoy the game!</i>
                    <br>
                    <br>
                    <i><a href="https://www.youtube.com/channel/UChu9E6KNDxbyS8BiVRyFrYA" >- Paul Vee</a></i>
                </p>
            </article>
        </body>
        <footer>
            <div class="button-wrapper">
                <Button text="GO" class="btn-primary" on:onClick={setMainMenu}>
                    <svg width="13px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </Button>
            </div>
        </footer>
    </div>
</MenuContainer>

<style>
    svg {
        position: relative;
        top: 0;
        margin-left: 10px;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #2c2c2c;
        stroke-width: 2;
        transform: translateX(-5px);
        transition: all 0.3s ease;
    }
    a {
        color: #2c2c2c;
    }
    .card {
        display: flex;
        gap: 10px;
        flex-direction: column;
        max-width: 600px;
    }
    body {
        display: flex;
        column-gap: 20px;
        flex-direction: row;
        flex-wrap: wrap;
    }
    section {
        flex: 1 1 30%;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    article {
        flex: 1 1 100px;
    }
    h1 {
        font-size: min(3em, 10vw);
        margin-bottom: 1rem;
    }
    p {
        text-align: start;
        font-size: min(1em, 3vw);
    }
    #logo {
        width: min(250px, 35vw);
        height: min(250px, 35vw);
    }
    footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 1rem;
        margin-bottom: min(2rem, 10vw);
    }
    .button-wrapper {
        grid-column: 2;
    }
</style>
