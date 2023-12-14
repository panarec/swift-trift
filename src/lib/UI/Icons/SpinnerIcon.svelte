<script>
    import anime from 'animejs'
    import { onMount } from 'svelte'

    onMount(() => {
        anime({
            targets: '.spinner',
            autoplay: true,
            loop: true,
            rotate: '360deg',
            easing: "linear"
        })
    })
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="150"
    height="150"
    viewBox="0,0,256,256"
    style="fill:#000000;"
    class="spinner"
>
    <defs
        ><linearGradient
            x1="34.528"
            y1="31.781"
            x2="34.528"
            y2="39.781"
            gradientUnits="userSpaceOnUse"
            id="color-1_iJTPtpGLHjpS_gr1"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="34.394"
            y1="10.858"
            x2="34.394"
            y2="16.861"
            gradientUnits="userSpaceOnUse"
            id="color-2_iJTPtpGLHjpS_gr2"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="23.512"
            y1="6.317"
            x2="23.512"
            y2="12.317"
            gradientUnits="userSpaceOnUse"
            id="color-3_iJTPtpGLHjpS_gr3"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="12.609"
            y1="10.859"
            x2="12.609"
            y2="16.86"
            gradientUnits="userSpaceOnUse"
            id="color-4_iJTPtpGLHjpS_gr4"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="12.112"
            y1="33.418"
            x2="12.112"
            y2="37.416"
            gradientUnits="userSpaceOnUse"
            id="color-5_iJTPtpGLHjpS_gr5"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="23.492"
            y1="38.684"
            x2="23.492"
            y2="41.683"
            gradientUnits="userSpaceOnUse"
            id="color-6_iJTPtpGLHjpS_gr6"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="8.068"
            y1="22.261"
            x2="8.068"
            y2="27.261"
            gradientUnits="userSpaceOnUse"
            id="color-7_iJTPtpGLHjpS_gr7"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ><linearGradient
            x1="38.933"
            y1="21.242"
            x2="38.933"
            y2="28.241"
            gradientUnits="userSpaceOnUse"
            id="color-8_iJTPtpGLHjpS_gr8"
            ><stop offset="0" stop-color="#fcc419"></stop><stop
                offset="1"
                stop-color="#fcc419"
            ></stop></linearGradient
        ></defs
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
        ><g transform="scale(5.33333,5.33333)"
            ><path
                d="M37.355,38.61c-1.561,1.561 -4.094,1.56 -5.655,-0.002c-1.563,-1.563 -1.563,-4.095 -0.002,-5.655c1.564,-1.563 4.096,-1.564 5.658,-0.001c1.563,1.56 1.563,4.094 -0.001,5.658z"
                fill="url(#color-1_iJTPtpGLHjpS_gr1)"
            ></path><path
                d="M37.394,13.859c0.001,-1.657 -1.341,-3.001 -2.998,-3.002c-1.657,-0.001 -3.001,1.341 -3.002,2.998c0,0.001 0,0.002 0,0.003c-0.001,1.657 1.341,3.001 2.998,3.002c1.657,0.001 3.001,-1.341 3.002,-2.998c0,-0.001 0,-0.002 0,-0.003z"
                fill="url(#color-2_iJTPtpGLHjpS_gr2)"
            ></path><path
                d="M26.512,9.317c0,-1.657 -1.343,-3 -3,-3c-1.657,0 -3,1.343 -3,3c0,1.657 1.343,3 3,3c1.657,0 3,-1.343 3,-3z"
                fill="url(#color-3_iJTPtpGLHjpS_gr3)"
            ></path><path
                d="M14.729,15.982c-1.17,1.17 -3.07,1.17 -4.243,-0.003c-1.17,-1.17 -1.17,-3.07 0,-4.24c1.174,-1.174 3.072,-1.173 4.243,-0.002c1.172,1.171 1.173,3.071 0,4.245z"
                fill="url(#color-4_iJTPtpGLHjpS_gr4)"
            ></path><path
                d="M13.525,36.831c-0.778,0.779 -2.048,0.781 -2.829,0c-0.781,-0.781 -0.778,-2.049 0,-2.828c0.782,-0.781 2.047,-0.781 2.829,0c0.781,0.781 0.783,2.047 0,2.828z"
                fill="url(#color-5_iJTPtpGLHjpS_gr5)"
            ></path><path
                d="M24.552,41.242c-0.586,0.586 -1.535,0.589 -2.123,0.002c-0.582,-0.583 -0.584,-1.537 0.002,-2.123c0.586,-0.586 1.537,-0.581 2.119,0.002c0.588,0.587 0.588,1.535 0.002,2.119z"
                fill="url(#color-6_iJTPtpGLHjpS_gr6)"
            ></path><circle
                cx="8.068"
                cy="24.761"
                r="2.5"
                fill="url(#color-7_iJTPtpGLHjpS_gr7)"
            ></circle><path
                d="M41.409,27.214c-1.369,1.368 -3.583,1.369 -4.951,0.001c-1.365,-1.365 -1.367,-3.583 0.002,-4.951c1.363,-1.364 3.582,-1.364 4.947,0.002c1.369,1.367 1.366,3.584 0.002,4.948z"
                fill="url(#color-8_iJTPtpGLHjpS_gr8)"
            ></path></g
        ></g
    >
</svg>
