<script lang="ts">
    import { onMount } from 'svelte'
    import { bestDuelScore, bestSoloScore } from '../../stores'
    import { tooltip } from '../../../actions/tooltip'
    import { getBestDuelScore, getBestSoloScore, getDuelGamesPlayed, getSoloBestLevel, getSoloGamesPlayed } from '../../../actions/localStorage'

    export let nickname: string = 'Guest'

    let name: HTMLElement
    let signature: HTMLElement
    let clientWidth: number = 0

    onMount(() => {
        name = document.querySelector('.name h3') as HTMLElement
        signature = document.querySelector('.signature span') as HTMLElement
        clientWidth = document.body.clientWidth
    })

    $: {
        let nameFontSize = 1
        let nameFontMultiplier = 80
        let signatureMarginMultiplier = 3
        let signatureMargin = -11

        if (clientWidth < 510) {
            nameFontSize = 0.8
            nameFontMultiplier = 60
            signatureMarginMultiplier = 4
            signatureMargin = -6
        }
        if (clientWidth < 456) {
            nameFontSize = 0.7
            nameFontMultiplier = 50
        }
        if (clientWidth < 400) {
            nameFontSize = 0.6
            nameFontMultiplier = 45
        }
        if (name) {
            name.style.fontSize =
                nickname.length > 15
                    ? `${1 - nickname.length / nameFontMultiplier}rem`
                    : `${nameFontSize}rem`
        }
        if (signature) {
            signature.style.fontSize =
                nickname.length > 15
                    ? `${1 - nickname.length / 65}rem`
                    : `${nameFontSize}rem`
            signature.style.marginBottom =
                nickname.length > 15
                    ? `-${nickname.length / signatureMarginMultiplier}px`
                    : `${signatureMargin}px`
        }
    }
</script>

<div class="profile-card">
    <header>
        <h4>DRIVER LICENSE</h4>
    </header>
    <body>
        <div class="photo">
            <!-- <GreenPersonIcon /> -->
            <div class="photo-placeholder"></div>
        </div>
        <div class="driver-header">
            <div class="name">
                <h3>{nickname}</h3>
                <p>2305 Anywhere street</p>
            </div>
            <div class="class-icon">
                <span>A</span>
            </div>
        </div>
        <div class="details">
            <span class="divider"></span>
            <div class="stats">
                <div class="stat-item tooltip">
                    <span class="stat-item-header" use:tooltip title="Solo best score">SBS:</span>
                    <span class="stat-item-content">{getBestSoloScore()}</span>
                </div>
                <div></div>
                <div class="stat-item">
                    <span class="stat-item-header" use:tooltip title="Solo best level" >SBL:</span>
                    <span class="stat-item-content">{getSoloBestLevel()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-header" use:tooltip title="Solo games played" >SGP:</span>
                    <span class="stat-item-content">{getSoloGamesPlayed()}</span>
                </div>
            </div>
            <span class="divider"></span>
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-item-header" use:tooltip title="Duel best score">DBS:</span>
                    <span class="stat-item-content">{getBestDuelScore()}</span>
                </div>
                <div></div>
                <div class="stat-item">
                    <span class="stat-item-header" use:tooltip title="Duel games played">DGP:</span>
                    <span class="stat-item-content">{getDuelGamesPlayed()}</span>
                </div>
            </div>
            <div class="signature-section">
                <div class="signature">
                    <span>{nickname}</span>
                </div>
                <div></div>
            </div>
        </div>

        <div class="id-number">
            <span class="stat-item-header">N</span>
            <span>234214412</span>
        </div>
        <div class="id-barcode">Okay</div>
    </body>
</div>

<style>
    .profile-card {
        background-color: rgb(52, 52, 52);
        padding: 0px 10px 10px 10px;
        letter-spacing: 0.7px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
        transition: font-size 0.3s ease;
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
        width: 30px;
        height: 30px;
        border-radius: 5px;
        background-color: rgb(0, 143, 252);
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
    header h4 {
        color: white;
        font-size: 1rem;
        font-weight: 900;
        padding: 1rem;
        text-align: center;
        letter-spacing: 2px;
        position: relative;
        margin: 0;
    }

    header h4::before {
        content: '';
        display: block;
        width: 10%;
        border-radius: 0 5px 5px 0;
        height: 20px;
        background-color: rgb(0, 143, 252);
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        left: 0;
    }

    header h4::after {
        content: '';
        display: block;
        width: 10%;
        border-radius: 5px 0 0 5px;
        height: 20px;
        background-color: rgb(0, 143, 252);
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 0;
    }
    body {
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        display: grid;
        grid-template-columns: min(130px, 20vw) 1fr;
        column-gap: 10px;
    }
    .photo {
        grid-row: span 2;
    }
    .photo-placeholder {
        width: 100%;
        height: min(170px, 26vw);
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
    .name p {
        margin: 0;
        font-size: 0.8rem;
        color: rgb(0, 0, 0);
        opacity: 0.3;
        padding: 0;
        text-align: start;
    }
    .stats {
        display: grid;
        width: 100%;
        column-gap: 10px;
        grid-template-columns: 1fr 1fr;
    }
    .stat-item {
        text-align: start;
        display: grid;
        grid-template-columns: 2.25rem 1fr;
        align-items: center;
    }
    .id-number .stat-item-header {
        font-weight: 900;
    }
    .stat-item-header {
        font-size: 0.8rem;
        color: rgb(0, 143, 252);
        font-weight: 900;
        padding: 0;
        text-align: start;
    }
    .id-number {
        text-align: start;
        margin-block: 10px;
        display: flex;
        gap: 7px;
        flex-wrap: nowrap;
    }
    .id-number > * {
        font-size: 1rem;
        text-align: center;
        font-weight: 600;
    }
    .id-barcode {
        width: 100%;
        font-family: 'Libre Barcode 39 Extended', system-ui;
        font-size: 2.75rem;
        line-height: 2.5rem;
        margin-bottom: -0.7rem;
        margin-top: 0.4rem;
    }
    .signature-section {
        width: 100%;
        display: grid;
        grid-template-columns: 5fr 2fr;
    }
    .signature {
        font-family: 'Homemade Apple', cursive;
        margin-block: 5px;
        border-bottom: #9f9f9f solid 1px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .signature span {
        display: block;
    }
    footer {
        grid-column: span 2;
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr;
        margin-bottom: -15px;
    }

    @media only screen and (max-width: 554px) {
        header h4 {
            font-size: 0.8rem;
        }
        .name h3 {
            font-size: 1.25rem;
        }
        .name p {
            font-size: 0.7rem;
        }
        .id-number > * {
            font-size: 0.8rem !important;
        }
        .id-barcode {
            font-size: 2rem;
            line-height: 1.5rem;
            margin-bottom: -0.15rem;
            margin-top: 0.8rem;
        }
        .stat-item-header {
            font-size: 0.7rem;
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
            font-size: 0.6rem;
        }
        .stat-item-content {
            font-size: 0.7rem;
        }
        .stat-item {
            grid-template-columns: 1.75rem 1fr;
        }
        .name p {
            font-size: 0.6rem;
        }
    }
    @media only screen and (max-width: 400px) {
        header h4 {
            font-size: 0.7rem;
            padding-block: 0.8rem;
        }
        .stat-item-header {
            font-size: 0.5rem;
        }
        .stat-item-content {
            font-size: 0.6rem;
        }
        .stat-item {
            grid-template-columns: 1.5rem 1fr;
        }
        .name p {
            font-size: 0.5rem;
        }
        .id-number > * {
            font-size: 0.7rem !important;
        }
        .class-icon {
            width: 15px;
            height: 15px;
            font-size: 0.6rem;
        }
    }
</style>
