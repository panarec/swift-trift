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
<MenuContainer class="col-start-5 col-end-9">
    <Card class="col-start-2 col-end-6">
        <header>
            <h3>Join Room</h3>
        </header>
        <body>
            <Input placeholder="# Room Number" bind:valueName={valName} />
            <Button text="Play" class='btn-primary' on:onClick={joinGame} />      
        </body>
    </Card>
    <BackButton state='duelMenu' class={`col-end-5 col-start-3 cursor-pointer`} />
</MenuContainer>


<style>
    h3 {
    font-size: 2em;
    margin-block: 20px;
    }
    body {
        margin-bottom: 30px;
    }
</style>