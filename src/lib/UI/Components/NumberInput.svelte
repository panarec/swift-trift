<script lang="ts">
    import anime from 'animejs'
    import { createEventDispatcher, onMount } from 'svelte'

    export let placeholder: any = ''
    export let value: number = 0
    export let maxValue: number = 999
    export let minValue: number = 0
    export let step: number = 1
    let buttons: HTMLElement[] = []

    const dispatch = createEventDispatcher()

    const input = (event: any) => {
            console.log(event.target.value)
            const value = event.target.value = event.target.value.toString().replace(/[^0-9+]/g, '')
            dispatch('input', value, { cancelable: true })
        }

    onMount(() => {
        buttons = Array.from(document.querySelectorAll('button'))

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                anime({
                    targets: button,
                    scale: [1, 0.1, 1],
                    autoplay: true,
                    duration: 100,
                })
            })
        })
    })

    const up = () => {
        if (value < maxValue) {
            value = +value + step
            input({ target: { value } })
        }
    }

    const down = () => {
        if (value > minValue) {
            value = +value - step
            input({ target: { value } })
        }
    }
</script>

<div class="input-container">
    <button on:click={down}>
        <span class="material-symbols-outlined"> remove </span>
    </button>
    <input
        type="text"
        {placeholder}
        bind:value
        on:input={input}
        max={maxValue}
        maxlength={maxValue.toString().length}
        minlength={minValue.toString().length}
        min={minValue}
    />
    <button on:click={up}>
        <span class="material-symbols-outlined"> add </span>
    </button>
</div>

<style>
    .input-container {
        display: grid;
        grid-template-columns: min(30px, 5vw) min(100px, 10vw) min(30px, 5vw);
        width: 100%;
        gap: 5px;
        margin-block: 0.5rem;
    }
    button {
        border-radius: 5px;
        border: none;
        background-color: #ffcb13;
        color: #3b3b3b;
        font-size: min(1.5rem, 5vw);
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        height: min(30px, 5vw);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.1s ease-in-out;
    }
    button:hover {
        background-color: #f5b90c;
        scale: 1.1;
    }
    input {
        border: none;
        border-bottom: 2px solid #777777;
        background-color: transparent;
        font-weight: inherit;
        text-align: center;
        color: inherit;
        font-size: min(1.5rem, 5vw);
        display: block;
        width: auto;
    }
    input:focus {
        outline: none;
        border-bottom: 2px solid #ffcb13;
    }
    input::placeholder {
        font-weight: 500;
        font-size: 1rem;
    }
    .material-symbols-outlined {
        font-size: min(1.5rem, 5vw);
        font-weight: 900;
    }
</style>
