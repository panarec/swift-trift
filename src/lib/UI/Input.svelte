<script>
    /**
     * @type {any}
     */
    export let placeholder
</script>

<input type="text" class="input" {placeholder} />

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
