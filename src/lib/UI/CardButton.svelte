<script lang="ts">
    import { createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()
    function onClick() {
        dispatch('click', {})
    }

    let clazz = '';
	export {clazz as class}; 
</script>

<button class={`card card-hover ${clazz}`} on:click={onClick}>
    <slot />
</button>

<style>
    .card {
        padding-block: 1rem;
        font-weight: 900;
        font-size: 1.25rem;
    }

    .btn-primary {
        background: #ffcb13;
    }
    .btn-secondary {
        background: #FC5F3C;
    }
    .btn-disabled {
        background: #e0e0e0;
    }
</style>