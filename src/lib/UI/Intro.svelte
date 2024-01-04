<script lang="ts">
    import { onMount } from 'svelte'
    import { menuState } from '../stores'
    import { fade, fly, scale } from 'svelte/transition'
    import Button from './Button.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import anime from 'animejs'
    import MapIcon from './Icons/MapIcon.svelte'
    menuState

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
            <h1>Lorem Ipsum</h1>
        </header>
        <body>
            <section>
                <MapIcon />
            </section>
            <article>
                <p>
                    Even though using "lorem ipsum" often arouses curiosity due
                    to its resemblance to classical Latin, it is not intended to
                    have meaning. Where text is visible in a document, people
                    tend to focus on the textual content rather.
                </p>
            </article>
        </body>
        <footer>
            <div class="button-wrapper">
                <Button text="GO" class='btn-primary' on:onClick={setMainMenu}>
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
    .card {
        display: flex;
        gap: 10px;
        flex-direction: column;
        max-width: max(600px, calc(100% - 1200px));
    }
    body {
        display: flex;
        column-gap: 20px;
        flex-direction: row;
        flex-wrap: wrap;
    }
    section {
        flex: 1 1 30%;
    }
    article {
        flex: 1 1 200px;
    }
    h1 {
        font-size: 3em;
        margin-bottom: 1rem;
    }
    p {
        text-align: start;
    }
    footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    .button-wrapper {
        grid-column: 2;
    }
</style>
