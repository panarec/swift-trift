<script lang="ts">
    import { onMount } from 'svelte'

    import Card from './Card.svelte'
    import BluePersonIcon from './Icons/BluePersonIcon.svelte'
    export let playerName: string
    export let rankNumber: number
    export let score: number = 0
    export let playerStatus: boolean = false
    export let playerColor: string
    export let playersCount: number = 0

    let name: HTMLElement

    $: {
        playersCount = playersCount
        let nameFontSize = 2
        let nameFontMultiplier = 40
        const card = document.querySelector('.player-card') as HTMLElement
        
        if(card){
            console.log(card.getBoundingClientRect().width)
            if (name) {
                if(card.getBoundingClientRect().width < 600){
                    nameFontSize = 1.5
                    if(playerName.length > 15)
                        nameFontMultiplier = 35
                }
                if(card.getBoundingClientRect().width < 500){
                    nameFontSize = 1.25
                    if(playerName.length > 15)
                        nameFontMultiplier = 20
                }
                if(card.getBoundingClientRect().width < 420){
                    if(playerName.length > 15)
                        nameFontMultiplier = 17
                }

                if(playerName.length > 15) {
                    name.style.fontSize = `${2 - playerName.length / nameFontMultiplier}rem`
                } else {
                    name.style.fontSize = `${nameFontSize}rem`
                }
            }
        }
    }
</script>

<Card class={`padding-1`}>
    <div class="player-card" style="--color: #{playerColor}">
        <span class="rank-number">
            {rankNumber}.
        </span>
        <body>
            <div class="photo">
                <div class="photo-placeholder"></div>
            </div>
            <div class="driver-header">
                <div class="name">
                    <h3 bind:this={name}>{playerName}</h3>
                </div>
                <div class="class-icon"></div>
            </div>
            <div class="details">
                <span class="divider"></span>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-item-header">Score:</span>
                        <span class="stat-item-content">{score}</span>
                    </div>
                </div>
            </div>
        </body>
    </div>
</Card>

<style>
    .player-card {
        padding-block: 15px;
        position: relative;
    }
    .driver-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        grid-column: 2;
        grid-row: 1;
    }
    .class-icon {
        width: 25px;
        height: 25px;
        border-radius: 5px;
        background-color: var(--color);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 900;
        flex-shrink: 0;
    }
    .details {
        width: 100%;
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 2;
        grid-row: 2;
    }
    .details .divider {
        width: 100%;
        display: block;
        height: 2px;
        background-color: rgb(198, 198, 198);
    }
    body {
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        display: grid;
        grid-template-columns: min(50px, 10vw) 1fr;
        column-gap: 10px;
    }
    .photo {
        grid-row: span 2;
    }
    .photo-placeholder {
        width: 100%;
        height: min(65px, 13vw);
        background-color: rgb(234, 234, 234);
    }
    .name {
        text-align: start;
    }
    .name h3 {
        margin: 0;
        margin-top: 3px;
        display: inline-block;
        word-break: break-all;
    }
    .stats {
        width: 100%;
    }
    .stat-item {
        text-align: start;
        display: grid;
        grid-template-columns: 4rem 1fr;
        align-items: center;
        width: 100%;
    }
    .stat-item-header {
        font-size: 1rem;
        color: var(--color);
        font-weight: 900;
        padding: 0;
        text-align: start;
    }
    span.stat-item-content {
        font-weight: 900;
    }
    .rank-number {
        position: absolute;
        left: 0;
        top: 10px;
        font-size: 1.5rem;
        font-weight: 900;
        color: #363131;
    }
    @media only screen and (max-width: 554px) {
        .stat-item-header {
            font-size: 0.8rem;
        }
        .stat-item-content {
            font-size: 0.8rem;
        }
        .class-icon {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
        }
    }
    @media only screen and (max-width: 510px) {
        .stat-item-content {
            font-size: 0.8rem;
        }
    }
    @media only screen and (max-width: 456px) {
        .stat-item-header {
            font-size: 0.7rem;
        }
        .stat-item-content {
            font-size: 0.7rem;
        }
        .stat-item {
            grid-template-columns: 2.5rem 1fr;
        }
    }
    @media only screen and (max-width: 400px) {
        .stat-item-header {
            font-size: 0.6rem;
        }
        .stat-item-content {
            font-size: 0.6rem;
        }
        .stat-item {
            grid-template-columns: 2.25rem 1fr;
        }
        .class-icon {
            width: 15px;
            height: 15px;
            font-size: 0.6rem;
        }
    }
</style>
