<script lang="ts">
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import Button from './Button.svelte'
    import Card from './Card.svelte'
    import { menuState, modalNoCallback, modalYesCallback } from '../stores'
    import { resetGame, resetView } from '../../actions/game'
    menuState
    let inAnimation: anime.AnimeInstance
    let yesCallback: () => void
    let noCallback: () => void

    async function goToMenu() {
        menuState.set('login')

        let promises: Promise<void>[] = []
        promises.push(resetGame())
        promises.push(resetView())
        await Promise.allSettled(promises)
    }

    onMount(() => {
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            scale: [0, 1],
            autoplay: false,
            duration: 750,
        })
        inAnimation.play()

        modalNoCallback.subscribe((mdCallback) => {
            noCallback = mdCallback
        })
        modalYesCallback.subscribe((mdCallback) => {
            yesCallback = mdCallback
        })
    })
</script>

<Card class="col-start-5 col-end-9">
    <body>
        <slot />
    </body>
    <footer>
        <Button
            class="col-start-1 col-end-1"
            text="Yes"
            on:onClick={yesCallback}
        />
        <Button
            class="col-start-3 col-end-3"
            text="No"
            on:onClick={noCallback}
        />
    </footer>
</Card>

<style>
    footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    body {
        margin-top: 20px;
    }
    footer {
        margin: 30px;
        margin-bottom: 30px;
    }
</style>
