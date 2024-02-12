<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { map } from 'lodash'

    export let userSelected: number

    const difficultyColors: Map<number, string> = new Map()

    difficultyColors.set(1, '#3bc007')
    difficultyColors.set(2, '#aaf32b')
    difficultyColors.set(3, '#f5bb0ccf')
    difficultyColors.set(4, '#f5710ccf')
    difficultyColors.set(5, '#f5140ccf')

    const dispatch = createEventDispatcher()
    const change = (event: any) =>
        dispatch('change', event.target.value, { cancelable: true })

    onMount(() => {
        const labels = document.querySelectorAll('label')
        if (userSelected && labels) {
            labels[userSelected - 1].style.background =
                difficultyColors.get(+userSelected) ?? ''
        }
    })

    $: {
        const labels = document.querySelectorAll('label')
        if (userSelected && labels.length > 0) {
            labels.forEach((label) => {
                label.style.background = 'transparent'
            })
            labels[userSelected - 1].style.background =
                difficultyColors.get(+userSelected) ?? ''
        }
    }
</script>

<div class="radio-group">
    <input
        bind:group={userSelected}
        type="radio"
        id="option-one"
        name="selector"
        value="1"
        on:change={change}
    />
    <label for="option-one">1</label>
    <input
        bind:group={userSelected}
        type="radio"
        id="option-two"
        name="selector"
        value="2"
        on:change={change}
    />
    <label for="option-two">2</label>
    <input
        bind:group={userSelected}
        type="radio"
        id="option-three"
        name="selector"
        value="3"
        on:change={change}
    />
    <label for="option-three">3</label>
    <input
        bind:group={userSelected}
        type="radio"
        id="option-four"
        name="selector"
        value="4"
        on:change={change}
    />
    <label for="option-four">4</label>
    <input
        bind:group={userSelected}
        type="radio"
        id="option-five"
        name="selector"
        value="5"
        on:change={change}
    />
    <label for="option-five">5</label>
</div>

<style>
    input[type='radio'] {
        position: absolute;
        visibility: hidden;
        display: none;
    }

    label {
        display: inline-block;
        cursor: pointer;
        font-weight: bold;
        font-size: clamp(0.9rem, 3vw, 1.25rem);
        padding: 5px min(20px, 3vw);
        margin: 0;
        transition: all 0.2s ease-in-out;
    }

    .radio-group {
        border: solid 2px #777777;
        display: inline-block;
        margin: 5px;
        border-radius: 10px;
        overflow: hidden;
    }
</style>
