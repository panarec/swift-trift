<script>
    import { createEventDispatcher } from "svelte"

    /**
     * @type {string}
     */
    export let text
    const dispatch = createEventDispatcher()
    function onClick() {
        dispatch('onClick', {})
    }

    let clazz = '';
	export {clazz as class}; 
</script>

<button class={`btn ${clazz}`} on:click={onClick}>
    <span>{text}</span>
    <slot />
</button>

<style>
    .btn {
        border-radius: 20px;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        position: relative;
        margin: auto;
        padding-block: 10px;
        width: 100%;
        transition: all 0.2s ease;
    }
    .btn.btn-primary:before {
        background: #ffcb13;
    }
    .btn.btn-secondary:before {
        background: #FC5F3C;
    }
    .btn:before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        display: block;
        border-radius: 28px;
        width: 50%;
        height: 40px;
        transition: all 0.3s ease;
    }
    .btn span {
        position: relative;
        font-size: 16px;
        line-height: 18px;
        font-weight: 900;
        letter-spacing: 0.05rem;
        vertical-align: middle;
    }



    .btn:hover:before {
        width: 100%;
    }

    .btn:active {
        transform: scale(0.96);
    }
</style>
