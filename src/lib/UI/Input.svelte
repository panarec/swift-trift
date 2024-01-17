<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let placeholder: any
    export let valueName: string = ''

    const dispatch = createEventDispatcher()

    const input = () => dispatch('input')

</script>

<input type="text" class="input" {placeholder}  bind:value={valueName} on:input={input} maxlength="25"/>

<style>
    .input {
        border-radius: 20px;
        padding: min(10px, 2vw) 20px;
        box-sizing: border-box;
        border: solid 1px #7b7b7b;
        width: 100%;
        background-color: #86868610;
        line-height: 10px;
        font-size: 1rem;
        font-weight: 500;
        text-align: center;
    }
    .input::placeholder {
        font-weight: 500;
        font-size: 1rem;
    }
</style>
