<script lang="ts">
    import { onMount } from 'svelte'
    import { getBestScore } from '../../actions/localStorage'
    import { bestScore } from '../stores'

    export let totalScore: number = 0
    let bestTotalScore: number = 0
    bestScore.subscribe((bestScore) => {
        bestTotalScore = bestScore
    })
</script>

<div class="profile-card">
    <div class="profile-info">
        <div class="profile-avatar">
            <img
                width="70"
                height="70"
                src="https://img.icons8.com/fluency/70/user-male.png"
                alt="user-male"
            />
        </div>
        <div class="profile-name">
            <h3>Guest</h3>
        </div>
    </div>
    <div class="profile-stats">
        <ul class="list">
            <!-- <li class="item">
                <div class="heading">Rank:</div>
                <div class="value">1234567</div>
            </li> -->
            <li class="item">
                <div class="heading">Best total score:</div>
                <div class="value">{bestTotalScore}</div>
            </li>
            <!-- <li class="item">
                <div class="heading">Best score:</div>
                <div class="value">1234567</div>
            </li> -->
        </ul>
    </div>
</div>

<style>
    .profile-card {
        display: grid;
        grid-template-columns: 3fr 4fr;
        background-color: #d9d9d920;
        border-radius: 12px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
        -webkit-box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
        -moz-box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 10px;
        box-sizing: border-box;
        gap: 10px;
    }
    .profile-info {
        grid-column: span 1;
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .profile-info h3 {
        margin-block: 5px;
    }
    .profile-stats {
        grid-column: span 1;
    }
    .profile-avatar {
        background-color: #ffffff;
        border-radius: 50%;
        padding: 10px;
        box-sizing: border-box;
    }
    .profile-stats {
        display: flex;
        flex-direction: column;
    }
    .profile-stats .list {
        list-style: none;
        text-align: start;
        padding: 0;
        margin-block: auto;
    }
    .profile-stats .list .item .heading {
        font-weight: 600;
        font-size: 0.75rem;
    }
    .profile-stats .list .item .value {
        font-weight: 900;
    }
    .profile-stats .list .item:not(:last-child) {
        margin-bottom: 5px;
    }
</style>
