<script setup lang="ts"></script>

<template>
    <div class="wrapper">
        <div class="fall">
            <div class="paddles">
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
            </div>
            <div class="ballHolder">
                <div class="ball"></div>
            </div>
        </div>  
    </div>
</template>

<style lang="scss">
*, *::before, *::after {
    padding: 0;
    margin: 0;
    box-sizing: barder-box;
}
.wrapper {
    position: absolute;
    height: 100%;
    width: 50%;
    background-color: rgb(var(--v-theme-colorOne));
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 800px;
    overflow: hidden;
}
    .fall {
        position: relative;
        transform-style: preserve-3d;
        animation: wrapperRotate 42s infinite linear;
    }
    @keyframes wrapperRotate {
        100% {
            transform: rotateY(360deg);
        }
    }

    .paddles {
        transform-style: preserve-3d;
    }

    .paddle {
        position: absolute;
        width: 80px;
        height: 80px;
        transform-style: preserve-3d;
        background-image: linear-gradient(#0007, #000c00);
        bottom: -210px;
        animation: move 15s infinite linear;

        div {
            position: absolute;
            background-color: inherit;
        }

        .ceil {
            width: 80px;
            height: 80px;
            background-image: linear-gradient(#fff7, fff0);
            animation: paddleCeil 15s infinite linear;
            animation-delay: inherit;
        }
        .ceil::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(#000, #0000 50%);
            animation: shadow 15s infinite linear;
            animation-delay: inherit;
        }
        @keyframes shadow {
            0%, 48%, 53%, 100% {
                opacity:0;
                transform: translateY(80px) scale(2);
            }
            50% {
                opacity: 0.25;
                transform: translateY(4px) scale(0.5);
            }
        }
        .top {
            width: 80px;
            transform: rotateX(90deg);
            transform-origin: top;
            background-image: linear-gradient(#0007, #fff7);
            animation: paddleHeight 15s infinite linear;
            animation-delay: inherit;
        }
        .bottom {
            width: 80px;
            bottom: 0;
            transform: rotateX(-90deg);
            transform-origin: bottom;
            background-image: linear-gradient(#fff3, #000c);
            animation: paddleHeight 15s infinite linear;
            animation-delay: inherit;
        }
        .left {
            height: 80px;
            bottom: 0;
            transform: rotateY(-90deg);
            transform-origin: left;
            background-image: linear-gradient(to bottom left #fff3, #000c);
            animation: paddleWidth 15s infinite linear;
            animation-delay: inherit;
        }
        .right {
            height: 80px;
            bottom: 0;
            right: 0;
            transform: rotateY(90deg);
            transform-origin: right;
            background-image: linear-gradient(to bottom right #fff3, #000c);
            animation: paddleWidth 15s infinite linear;
            animation-delay: inherit;
        }
        @keyframes paddleCeil {
            0%, 49.75%, 55%, 100% {
                transform: translateZ(20px);
            }
            50% {
                transform: translateZ(4px);
            }
        }
        @keyframes paddleHeight {
            0%, 49.75%, 55%, 100% {
                height: 20px;
            }
            50% {
                height: 10px
            }
        }
        @keyframes paddleWidth {
            0%, 49.75%, 55%, 100% {
                width: 20px;
            }
            50% {
                width: 10px
            }
        }
        

    }

    .paddle:nth-child(odd) {
        left: -10px;
        transform: translate(-50%, 50%) rotateY(90deg) rotateX(45deg) translateZ(-20px) translateY(-220px);
    }
    .paddle:nth-child(even) {
        left: 10px;
        transform: translate(-50%, 50%) rotateY(-90deg) rotateX(45deg) translateZ(-20px) translateY(-220px);
    }
    .paddle:nth-child(1)
    {
        animation-delay: -1.5s;
        background-color: #9e0142;
    }
    .paddle:nth-child(2)
    {
        animation-delay: -3s;
        background-color: #d53e4f;
    }
    .paddle:nth-child(3)
    {
        animation-delay: -4.5s;
        background-color: #f46d43;
    }
    .paddle:nth-child(4)
    {
        animation-delay: -6s;
        background-color: #fdae61;
    }
    .paddle:nth-child(5)
    {
        animation-delay: -7.5s;
        background-color: #fee08b;
    }
    .paddle:nth-child(6)
    {
        animation-delay: -9s;
        background-color: #e6f598;
    }
    .paddle:nth-child(7)
    {
        animation-delay: -10.5s;
        background-color: #abdda4;
    }
    .paddle:nth-child(8)
    {
        animation-delay: -12s;
        background-color: #66c2a5;
    }
    .paddle:nth-child(9)
    {
        animation-delay: -13.5s;
        background-color: #3288bd;
    }
    .paddle:nth-child(10)
    {
        animation-delay: -15s;
        background-color: #5e4fa2;
    }

    @keyframes move {
        0% {
            bottom: -1210px; 
        }
        100% {
            bottom: 810px;
        }
    }

    .ballHolder {
        position: absolute;
        bottom: -210px;
        width: 20px;
        height: 240px;
        transform-origin: bottom;
        transform-style: preserve-3d;
        animation: holderRotate 1.5s infinite linear alternate;
    }
    @keyframes holderRotate {
     0% {
        transform: translateX(-50%) rotate(-45deg);
    }
    100% {
         transform: translateX(-50%) rotate(45deg);
     }
    }
    
    .ball {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 10%;
        transform-style: preserve-3d;
        animation:  ballRotateZ 1.5s infinite linear alternate;
    }
    
    @keyframes ballRotateZ {
        0% {
            transform: rotate(45deg);
        }
        100% {
            transform: rotate(-45deg);
        }
    }
    
    .ball::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background-image: radial-gradient(circle at top, #fff, #222);
            border-radius: 50%;
            animation: ballRotateY 42s infinite linear;
        }
        @keyframes ballRotateY {
            0% {
                transform: rotateY(0deg);
            }
            100% {
                transform: rotateY(-360deg);
            }
        }

</style>