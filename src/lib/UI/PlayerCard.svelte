<script lang="ts">

    import Card from "./Card.svelte"
    import BluePersonIcon from "./Icons/BluePersonIcon.svelte"
    export let playerName: string
    export let rankNumber: number
    export let score: number = 0
    export let playerStatus: boolean = false
    export let playerColor: string 

    console.log(playerColor)
</script>

<Card class={``} >
    <div class="player-card">
        <div class="rank-number">
            <h2>{`${rankNumber}.`}</h2>
            <div class="icon-container">
                <BluePersonIcon width={50} height={50} />
            </div>
        </div>
        <body class="description">
            <div class="player-name">
                <h5>Player:</h5>
                <h2>{playerName}</h2>
            </div>
                <div class="player-score">
                    <h5>Score:</h5>
                    <h2>{score}</h2>
                </div>
                <div class="player-status">
                    {#if playerStatus === true}
                        <h2 class="positive">Ready</h2>
                    {:else}
                        <h2 class="negative">Not ready</h2>
                    {/if}
                </div>
        </body>
        
    </div>
</Card>

<style>
    .player-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-block: 1rem;
        gap: 30px;
    }
    h2,h3,h5 {
        margin: 0;
    }
    h5 {
        opacity: 0.75;
        font-weight: 400;
    }
    body{
        text-align: start;
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        align-items: stretch;
        justify-content: center;
        width: 100%;
    }
    .icon-container {
        background-color: #d9d9d925;
        border-radius: 50%;
    }
    .rank-number {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .player-status {
        text-align: center;
        margin: auto;
    }
    .player-name{
        width: 6rem;
        text-align: center;

    }
    .player-score{
        text-align: center;
    }
</style>