<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
    function onClick() {
        dispatch('click', {})
    }

    let clazz = ''
    export let disabled: boolean = false
    export { clazz as class }
</script>

<button class={`card card-hover cursor-pointer ${clazz}`} disabled={disabled} on:click={onClick}>
    <slot />
</button>

<style>
    .card {
        padding-block: min(1rem, 4vw);
        font-weight: 900;
        font-size: clamp(0.75rem, 5vw, 1.25rem);
    }

    .btn-primary {
        background: #ffcb13;
    }
    .btn-secondary {
        background: #fc5f3c;
    }
    .btn-disabled {
        background: #e0e0e0;
    }
</style>
