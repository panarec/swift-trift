<script lang="ts">
    import { onMount } from 'svelte'

    export let name: string
    export let time: number = 0
    export let score: number
    export let position: number
    export let color: string
    let nameElement: HTMLElement

    onMount(() => {})

    $: {
        let nameFontSize = 1
        let nameFontMultiplier = 80

        if (nameElement) {
            nameElement.style.fontSize =
                name.length > 15
                    ? `${1 - name.length / nameFontMultiplier}rem`
                    : `${nameFontSize}rem`
        }
    }
</script>

<tr style="{`background-color: #${color}56;`}s">
    <td>{position}</td>
    <td class="name" bind:this={nameElement}>{name}</td>
    <td>{time}</td>
    <td>{score}</td>
</tr>

<style>
    td {
        text-align: left;
        padding: 8px;
    }
    td:first-child {
        text-align: center;
        font-weight: bold;
    }
    td:first-child {
        border-radius: 10px 0 0 10px;
    }
    td:last-child {
        border-radius: 0 10px 10px 0;
    }
</style>
