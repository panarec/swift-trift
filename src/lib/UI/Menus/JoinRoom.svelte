<script>
    import { getPlayerName } from "../../../actions/localStorage"
    import { joinLobby } from "../../../actions/socket"
    import BackButton from "../BackButton.svelte"
    import Button from "../Button.svelte"
    import Card from "../Card.svelte"
    import Input from "../Input.svelte"
    import MenuContainer from "./MenuContainer.svelte"

    let valName = ''
    const joinGame = () => {
        console.log({valName})
        joinLobby(valName, getPlayerName())
    }

</script>
<MenuContainer class="">
    <body>
        <Card class="">
            <header>
                <h3>Join Room</h3>
            </header>
            <body>
                <Input placeholder="# Room Number" bind:valueName={valName} />
                <Button text="Play" class='btn-primary' on:onClick={joinGame} />      
            </body>
        </Card>
    </body>
    <footer>
        <BackButton state='duelMenu' class={`col-end-5 col-start-3 cursor-pointer`} />
    </footer>
</MenuContainer>


<style>
    body {
        width: 100%;
        max-width: max(300px, calc(100% - 1200px));
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
        gap: 20px 30px;
    }
    footer{
        width: 100%;
        max-width: 100px;
    }
    h3 {
    font-size: 2em;
    margin-block: 20px;
    }
    body {
        margin-bottom: 30px;
    }
</style>