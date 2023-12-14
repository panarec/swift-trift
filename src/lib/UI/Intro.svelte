<script lang="ts">
    import { onMount } from 'svelte'
    import { menuState } from '../stores'
    import { fade, fly, scale } from 'svelte/transition'
    import Button from './Button.svelte'
    import MenuContainer from './Menus/MenuContainer.svelte'
    import anime from 'animejs'
    menuState

    let inAnimation: anime.AnimeInstance

    function setMainMenu() {
        menuState.set('login')
    }

    onMount(() => {
        const card = document.querySelector('.card')
        inAnimation = anime({
            targets: [card],
            height: ['0%', '100%'],
            autoplay: false,
            easing: 'easeOutQuint',
            duration: 500,
        })
        inAnimation.play()
    })
</script>

<MenuContainer class="col-start-4 col-end-10">
    <div class="card">
        <header>
            <h1>Lorem Ipsum</h1>
        </header>
        <body>
            <section>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="200"
                    height="200"
                    viewBox="0,0,256,256"
                    style="fill:#000000;"
                >
                    <defs
                        ><linearGradient
                            x1="37.201"
                            y1="4.499"
                            x2="40.917"
                            y2="11.729"
                            gradientUnits="userSpaceOnUse"
                            id="color-1_kJlyCVWJrclv_gr1"
                            ><stop offset="0" stop-color="#f4594f"></stop><stop
                                offset="0.587"
                                stop-color="#ec5535"
                            ></stop><stop offset="1" stop-color="#e53720"
                            ></stop></linearGradient
                        ><linearGradient
                            x1="37.201"
                            y1="36.499"
                            x2="40.917"
                            y2="43.729"
                            gradientUnits="userSpaceOnUse"
                            id="color-2_kJlyCVWJrclv_gr2"
                            ><stop offset="0" stop-color="#f4594f"></stop><stop
                                offset="0.587"
                                stop-color="#ec5535"
                            ></stop><stop offset="1" stop-color="#e53720"
                            ></stop></linearGradient
                        ><linearGradient
                            x1="10.223"
                            y1="7.221"
                            x2="25.777"
                            y2="22.774"
                            gradientUnits="userSpaceOnUse"
                            id="color-3_kJlyCVWJrclv_gr3"
                            ><stop offset="0" stop-color="#3f8bff"></stop><stop
                                offset="1"
                                stop-color="#0c5ab9"
                            ></stop></linearGradient
                        ><radialGradient
                            cx="18"
                            cy="15"
                            r="5.133"
                            gradientUnits="userSpaceOnUse"
                            id="color-4_kJlyCVWJrclv_gr4"
                            ><stop offset="0.177" stop-color="#000000"
                            ></stop><stop
                                offset="1"
                                stop-color="#000000"
                                stop-opacity="0"
                            ></stop></radialGradient
                        ><linearGradient
                            x1="2.9291"
                            y1="2.9291"
                            x2="17.0709"
                            y2="17.0709"
                            gradientUnits="userSpaceOnUse"
                            id="color-5_kJlyCVWJrclv_gr5"
                            ><stop offset="0" stop-color="#21ad64"></stop><stop
                                offset="1"
                                stop-color="#088242"
                            ></stop></linearGradient
                        ></defs
                    ><g
                        fill="none"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="none"
                        stroke-linecap="none"
                        stroke-linejoin="none"
                        stroke-miterlimit="10"
                        stroke-dasharray=""
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                        style="mix-blend-mode: normal"
                        ><g transform="scale(5.33333,5.33333)"
                            ><path
                                d="M39,11v12c0,3.314 -2.686,6 -6,6h-22.5c-3.038,0 -5.5,2.462 -5.5,5.5v0c0,3.038 2.462,5.5 5.5,5.5h28.5"
                                fill="none"
                                stroke="#ffcb13"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path><path
                                d="M43,8c0,2.209 -1.791,4 -4,4c-2.209,0 -4,-1.791 -4,-4c0,-2.209 1.791,-4 4,-4c2.209,0 4,1.791 4,4z"
                                fill="url(#color-1_kJlyCVWJrclv_gr1)"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            ></path><path
                                d="M43,40c0,2.209 -1.791,4 -4,4c-2.209,0 -4,-1.791 -4,-4c0,-2.209 1.791,-4 4,-4c2.209,0 4,1.791 4,4z"
                                fill="url(#color-2_kJlyCVWJrclv_gr2)"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            ></path><path
                                d="M25.885,22.66c1.925,-1.98 3.115,-4.68 3.115,-7.66c0,-6.075 -4.925,-11 -11,-11c-6.075,0 -11,4.925 -11,11c0,2.98 1.19,5.68 3.115,7.66c0.011,0.011 7.02,7.027 7.02,7.027c0.477,0.477 1.251,0.477 1.728,0c0.001,0.001 7.011,-7.015 7.022,-7.027z"
                                fill="url(#color-3_kJlyCVWJrclv_gr3)"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            ></path><circle
                                cx="18"
                                cy="15"
                                r="5.133"
                                fill="url(#color-4_kJlyCVWJrclv_gr4)"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            ></circle><circle
                                cx="18"
                                cy="15"
                                r="4.4"
                                fill="#f9f9f9"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            ></circle></g
                        ></g
                    ><g
                        fill="none"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dasharray=""
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                        style="mix-blend-mode: normal"
                        ><g
                            transform="translate(186.66667,21.66667) scale(2.13333,2.13333)"
                            id="overlay"
                            ><g
                                id="Layer_2"
                                fill="#000000"
                                font-family="Inter, apple-system, &quot;system-ui&quot;, &quot;Helvetica Neue&quot;, &quot;Segoe UI&quot;, &quot;Fira Sans&quot;, Roboto, Oxygen, Ubuntu, &quot;Droid Sans&quot;, Arial, sans-serif"
                                font-weight="400"
                                font-size="16"
                                text-anchor="start"
                            ></g><g
                                id="Layer_3"
                                fill="#000000"
                                font-family="Inter, apple-system, &quot;system-ui&quot;, &quot;Helvetica Neue&quot;, &quot;Segoe UI&quot;, &quot;Fira Sans&quot;, Roboto, Oxygen, Ubuntu, &quot;Droid Sans&quot;, Arial, sans-serif"
                                font-weight="400"
                                font-size="16"
                                text-anchor="start"
                            ></g><g
                                id="Layer_1"
                                fill="url(#color-5_kJlyCVWJrclv_gr5)"
                                ><path
                                    d="M20,10c0,5.522 -4.478,10 -10,10c-5.522,0 -10,-4.478 -10,-10c0,-5.522 4.477,-10 10,-10c5.523,0 10,4.477 10,10z"
                                ></path></g
                            ></g
                        ></g
                    >
                </svg>
            </section>
            <article>
                <p>
                    Even though using "lorem ipsum" often arouses curiosity due
                    to its resemblance to classical Latin, it is not intended to
                    have meaning. Where text is visible in a document, people
                    tend to focus on the textual content rather.
                </p>
            </article>
        </body>
        <footer>
            <div class="button-wrapper">
                <Button text="GO" on:onClick={setMainMenu}>
                    <svg width="13px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </Button>
            </div>
        </footer>
    </div>
</MenuContainer>

<style>
    svg {
        position: relative;
        top: 0;
        margin-left: 10px;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #2c2c2c;
        stroke-width: 2;
        transform: translateX(-5px);
        transition: all 0.3s ease;
    }
    .card {
        grid-column: span 6;
        display: flex;
        gap: 10px;
        flex-direction: column;
        overflow: hidden;
    }
    body {
        display: grid;
        grid-template-columns: 3fr, 4fr;
        column-gap: 20px;
    }
    section {
        grid-column: span 3;
    }
    article {
        grid-column: 4 / span 4;
    }
    h1 {
        font-size: 3em;
        margin-bottom: 1rem;
    }
    p {
        text-align: start;
    }
    footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    .button-wrapper {
        grid-column: 2;
    }
</style>
