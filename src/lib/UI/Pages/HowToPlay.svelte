<script lang="ts">
    import { onMount } from 'svelte'
    import Card from '../Components/Card.svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import MenuHeader from '../Components/MenuHeader.svelte'
    import anime from 'animejs'
    import CardButton from '../Components/CardButton.svelte'
    import { menuState } from '../../stores'
    let inAnimation: anime.AnimeInstance
    let button: string | object | HTMLElement | SVGElement | NodeList | null

    function dismiss() {
        window.scrollTo(0, 0)
        menuState.set('gameUI')
    }

    onMount(() => {
        inAnimation = anime({
            targets: [button],
            scale: [0, 1],
            autoplay: false,
            duration: 500,
        })
        inAnimation.play()
        const appBody = document.querySelector('#app-body') as HTMLElement
        appBody.style.overflow = 'auto'
    })
</script>

<MenuContainer>
    <MenuHeader heading="How To Play" />
    <body>
        <Card class="flex-column flex-align-center">
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="gif">
                    <img src="../../../../imgs/gif1.gif" alt="">
                </div>
            </section>
            <footer class="card-footer">
                <p>
                    Move the vehicle by clicking on the red markers. If you have made a wrong move, you can go back by clicking on the previous position.
                </p>
            </footer>
        </Card>
        <Card class="flex-column flex-align-center" inAnimationDelay={100}>
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="gif">
                    <img src="../../../../imgs/gif2.gif" alt="">
                </div>
            </section>
            <footer class="card-footer">
                <p>
                    Complete the level by reaching the marker with the finish flag. You can then see your score and move on to the next level.
                </p>
            </footer>
        </Card>
        <Card class="flex-column flex-align-center" inAnimationDelay={200}>
            <header class="card-header m-6"></header>
            <section class="p-4 text-center">
                <div class="gif">
                    <img src="../../../../imgs/gif3.gif" alt="">
                </div>
            </section>
            <footer class="card-footer">
                <p>
                    You can zoom, rotate and pan the map to get a better view of the game and your destination.
                </p>
            </footer>
        </Card>
    </body>

    <div class=" btn" bind:this={button}>
        <CardButton class="btn-primary" on:click={dismiss}>OK</CardButton>
    </div>
</MenuContainer>

<style>
    body {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
        gap: 20px 30px;
        width: 100%;
        max-width: 1200px;
    }
    p {
        font-weight: 600;
        margin-top: 0;
    }
    .gif {
        margin-top: 25px;
        margin-bottom: 10px;
    }
    .gif img {
        width: 100%;
        max-width: 450px;
        border-radius: 5px;
    }   
    .btn {
        margin-bottom: 20px;
    }
</style>
