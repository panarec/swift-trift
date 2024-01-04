<script>
    let clazz = ''
    export { clazz as class }
</script>

<div class={`menu-container ${clazz}`}>
    <slot />
</div>

<style>
    .menu-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        gap: 40px;
    }
</style>
