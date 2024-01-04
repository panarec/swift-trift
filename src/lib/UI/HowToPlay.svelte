<script lang="ts">
    import { onMount } from 'svelte'
    import { generateGame, loadingNextGame } from '../../actions/game'
    import { menuState } from '../stores'
    import Button from './Button.svelte'
    import Card from './Card.svelte'
    import MenuCard from './Menus/MenuCard.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import MenuHeader from './Menus/MenuHeader.svelte'
    import anime from 'animejs'
    import CardButton from './CardButton.svelte'
    let inAnimation: anime.AnimeInstance
    let button: string | object | HTMLElement | SVGElement | NodeList | null

    function runGame() {
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

    onMount(() => {
        inAnimation = anime({
            targets: [button],
            scale: [0, 1],
            autoplay: false,
            duration: 500,
        })
        inAnimation.play()
    })

</script>

<MenuContainer>
    <MenuHeader heading="How To Play" />
    <body>
        <Card class="flex-column flex-align-center">
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="placeholder"></div>
            </section>
            <footer class="card-footer">
                <p>
                    Even though using "lorem ipsum" often arouses curiosity due to
                    its resemblance to classical Latin, it is not intended to have
                    meaning.
                </p>
            </footer>
        </Card>
        <Card
            class="flex-column flex-align-center"
            inAnimationDelay={100}
        >
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="placeholder"></div>
            </section>
            <footer class="card-footer">
                <p>
                    Where text is visible in a document, people tend to focus on the
                    textual content rather than upon overall presentation.
                </p>
            </footer>
        </Card>
        <Card
            class="flex-column flex-align-center"
            inAnimationDelay={200}
        >
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="placeholder"></div>
            </section>
            <footer class="card-footer">
                <p>
                    So publishers use lorem ipsum when displaying a typeface or
                    design in order to direct the focus to presentation. "Lorem
                    ipsum" also approximates a typical distribution of letters in
                    English.
                </p>
            </footer>
        </Card>
    </body>
    
    <div class="col-start-3 col-end-5" bind:this={button}>
        <CardButton class='btn-primary' on:onClick={runGame} >
            OK
        </CardButton>
    </div>
</MenuContainer>

<style>
     body {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
        gap: 20px 30px;
        width: 100%;
        max-width: max(1200px, calc(100% - 500px));
    }
    p {
        font-weight: 600;
        margin-block: 25px;
    }
    .placeholder {
        height: 300px;
    }
</style>
