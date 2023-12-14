<script>
    let clazz = ''
    export { clazz as class }
</script>

<div class={`menu-container ${clazz}`}>
    <slot />
</div>

<style>
    .menu-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 20px 30px;
        width: 100%;
        margin: auto;
        margin-top: 10rem;
    }
</style>
