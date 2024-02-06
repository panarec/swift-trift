<script lang="ts">
    import { onMount } from 'svelte'
    import MenuContainer from '../Components/MenuContainer.svelte'
    import { lobby } from '../../stores'
    import type { LobbyItem, PlayerItem } from '../../../actions/types'
    import ResultsTableRow from '../Components/ResultsTableRow.svelte'
    import { LngLat } from 'mapbox-gl'
    let clientWidth: number = document.body.clientWidth
    let name: NodeListOf<HTMLElement>
    let lobbyItem: LobbyItem
    let bestScorePlayerItem: PlayerItem
    let bestTimeScorePlayerItem: PlayerItem

    onMount(() => {
        clientWidth = document.body.clientWidth
        name = document.querySelectorAll('.name') as NodeListOf<HTMLElement>
        lobby.subscribe((lobby) => {
            lobbyItem = lobby
        })
        if (lobbyItem) {
            bestScorePlayerItem = lobbyItem.players.find(
                (player) =>
                    player.score ===
                    Math.max(...lobbyItem.players.map((player) => player.score))
            ) as PlayerItem
            bestTimeScorePlayerItem = lobbyItem.players.find(
                (player) =>
                    player.totalTime ===
                    Math.min(...lobbyItem.players.map((player) => player.totalTime))
            ) as PlayerItem
            console.log(bestScorePlayerItem, bestTimeScorePlayerItem)
        }
    })

    $: {
        let nameFontSize = 1
        let nameFontMultiplier = 80

        if (clientWidth < 510) {
            nameFontSize = 0.8
            nameFontMultiplier = 60
        }
        if (clientWidth < 456) {
            nameFontSize = 0.7
            nameFontMultiplier = 50
        }
        if (clientWidth < 400) {
            nameFontSize = 0.6
            nameFontMultiplier = 45
        }
    }
</script>

{#if lobbyItem}
    <MenuContainer>
        <body class="outer-body">
            <div class="card">
                <header>
                    <h2>Game results</h2>
                </header>
                <body>
                    <ul class="results">
                        <li class="results-item">
                            <div class="results-item-label">Best time:</div>
                            <div class="results-item-value">
                                <div>{bestTimeScorePlayerItem.totalTime}</div>
                                <div class="name">{bestTimeScorePlayerItem.playerName}</div>
                            </div>
                        </li>
                        <li class="results-item">
                            <div class="results-item-label">Best score:</div>
                            <div class="results-item-value">
                                <div>{bestScorePlayerItem.score}</div>
                                <div class="name">{bestScorePlayerItem.playerName}</div>
                            </div>
                        </li>
                    </ul>
                    <table>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Time</th>
                            <th>Score</th>
                        </tr>
                        {#each lobbyItem.players as player, index}
                            <ResultsTableRow
                                name={player.playerName}
                                score={player.score}
                                position={index + 1}
                                color={player.color}
                                time={player.totalTime}
                            />
                        {/each}
                    </table>
                </body>
            </div>
        </body>
    </MenuContainer>
{/if}

<style>
    .outer-body {
        max-width: max(500px, calc(100% - 1200px));
        z-index: 10;
    }
    body {
        width: 100%;
        max-width: 800px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .results {
        display: grid;
        grid-template-columns: repeat(2, minmax(50%, 1fr));
        gap: 10px;
        border-radius: 10px;
        margin-top: 1rem;
        font-size: min(1.2rem, 4vw);
        font-weight: 500;
        width: 100%;
        max-width: 500px;
        padding: 0;
    }
    .results-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem min(1rem, 1vw);
        border-radius: 10px;
        background-color: #e9e9e96c;
        gap: 5px;
    }

    .results-item-label {
        color: #777777;
        font-size: clamp(0.75rem, 3vw, 1.2rem);
        font-weight: 600;
    }

    .results-item-value {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .results-item-value div:first-child {
        font-size: min(1.5rem, 5vw);
        font-weight: 900;
    }
    .name {
        overflow-wrap: anywhere;
    }

    @media only screen and (max-width: 400px) {
        body {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
    }
    table {
        border-collapse: separate;
        border-spacing: 0 5px;
        margin-bottom: 30px;
        font-size: min(1.2rem, 4vw);
        /* border: 1px solid #ddd; */
    }
    th {
        text-align: left;
        padding: 8px;
    }
    th:first-child {
        text-align: center;
        font-weight: bold;
    }
    tr {
        margin-block: 5px;
    }
    tr:nth-child(2) {
        background-color: #ffa01c54;
    }
    tr:nth-child(3) {
        background-color: #3772ff56;
    }
    tr:nth-child(4) {
        background-color: #df293556;
    }
    tr:nth-child(5) {
        background-color: #43e72656;
    }
    tr:nth-child(6) {
        background-color: #cd38ff56;
    }
</style>
