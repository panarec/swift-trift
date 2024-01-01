<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let placeholder: any
    export let valueName: string = ''

    const dispatch = createEventDispatcher()

    const input = () => dispatch('input')

</script>

<input type="text" class="input" {placeholder}  bind:value={valueName} on:input={input}/>

<style>
    .input {
        border-radius: 20px;
        padding: 10px 20px;
        box-sizing: border-box;
        border: solid 1px #7b7b7b;
        width: 100%;
        background-color: #86868610;
        margin-block: 20px;
        line-height: 10px;
        font-size: 1rem;
        font-weight: 500;
    }
    .input::placeholder {
        margin-left: 20px;
        font-weight: 500;
        font-size: 1rem;
    }
</style>
