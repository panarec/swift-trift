<script lang="ts">
    export let title = ''
    let isHovered = false
    let x: any
    let y: any

    function mouseOver(event: any) {
        isHovered = true
        x = event.pageX - 90
        y = event.pageY - 90
    }
    function mouseMove(event: any) {
        x = event.pageX - 90
        y = event.pageY - 90
    }
    function mouseLeave() {
        isHovered = false
    }
</script>

<div
    on:mouseover={mouseOver}
    on:mouseleave={mouseLeave}
    on:mousemove={mouseMove}
>
    <slot />
</div>

{#if isHovered}
    <div style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
    .tooltip {
        border: 1px solid #ddd;
        box-shadow: 1px 1px 1px #ddd;
        background: white;
        border-radius: 4px;
        padding: 4px;
        position: absolute;
        z-index: 1000;
    }
</style>
