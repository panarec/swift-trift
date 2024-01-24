<script lang="ts">
    import anime from "animejs"


    export let text: string | null = ''
    let tooltip: HTMLElement    

    const copyToClipboard = (event: any) => {
        if(text) navigator.clipboard.writeText(text)
        anime({
            targets: tooltip,
            width: ["0", "60px"],
            duration: 500,
            easing: 'easeOutQuint',
            autoplay: true,
        })
    }

    const hideTooltip = () => {
        if(tooltip.style.width  !== '60px') return

        anime({
            targets: tooltip,
            width: ["60px", "0"],
            duration: 500,
            easing: 'easeOutQuint',
            autoplay: true,
        })
    }

</script>

<button on:click={copyToClipboard} on:mouseleave={hideTooltip}>{text}
    <span class="material-symbols-outlined">
    content_copy
    </span>
    <span class="tooltiptext" bind:this={tooltip}>
        - Copied
    </span>
</button>

<style>
        button {
        color: rgb(0, 143, 252);
        font-size: inherit;
        font-weight: 900;
        cursor: pointer;
        position: relative;
    }

        /* Tooltip text */
        button .tooltiptext {
        font-size: 0.75rem;
        text-align: center;
        position: absolute;
        z-index: 100;
        top: 50%;
        width: 0;
        transform: translate(0, -50%); 
        overflow: hidden;
        white-space: nowrap;
        }


</style>