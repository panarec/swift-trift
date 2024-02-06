<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    export let placeholder: any
    export let valueName: string = ''
    let clazz = ''
    export {clazz as class}

    const dispatch = createEventDispatcher()

    const input = () => dispatch('input')
</script>

<input
    type="text"
    class={clazz + ' input'} 
    {placeholder}
    bind:value={valueName}
    on:input={input}
    maxlength="25"
/>

<style>
    .input {
        box-sizing: border-box;
        border: none;
        border-bottom: 2px solid #777777;
        width: 100%;
        line-height: 8px;
        font-size: min(1.5rem, 5vw);
        font-weight: 500;
        text-align: center;
    }
    .input:focus {
        outline: none;
        border-bottom: 2px solid #ffcb13;
    }
    .input::placeholder {
        font-weight: 500;
        font-size: 1rem;
    }
</style>
