<script lang="ts">

    import Card from "./Card.svelte"
    import BluePersonIcon from "./Icons/BluePersonIcon.svelte"
    export let playerName: string
</script>

<Card class={`col-span-3`} >
    <header>
        <div class="icon-container">
            <BluePersonIcon width={120} height={120} />
        </div>
    </header>
    <body>
        <h3>{playerName}</h3>
    </body>
</Card>

<style>
    .icon-container {
        background-color: #d9d9d925;
        border-radius: 50%;
        margin-top: 20px;
        z-index: -10;
    }
</style>