<script lang="ts">
    import { onMount } from 'svelte'
    import anime from 'animejs'
    import Button from './Button.svelte'
    import Card from './Card.svelte'
    import { menuState, modalNoCallback, modalYesCallback } from '../stores'
    import { resetGame, resetView } from '../../actions/game'
    import MenuContainer from './Menus/MenuContainer.svelte'
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

<MenuContainer>
    <body>
        <Card class="col-start-2 col-end-6">
            <body>
                <slot />
            </body>
            <footer>
                <Button
                    class="col-start-1 col-end-1 btn-primary"
                    text="Yes"
                    on:onClick={yesCallback}
                />
                <Button
                    class="col-start-3 col-end-3 btn-secondary"
                    text="No"
                    on:onClick={noCallback}
                />
            </footer>
        </Card> 
    </body>
</MenuContainer>

<style>
    body {
        max-width: 300px;
    }
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
