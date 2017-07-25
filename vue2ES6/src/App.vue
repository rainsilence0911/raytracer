<template>
    <div id="app">
        <ray-tracer/>
    </div>
</template>

<script>
import RayTracer from './components/RayTracer.vue'
import CanvasPrinter from './observer/CanvasPrinter';
import KeyboardManager from './manager/KeyboardManager';

export default {
    name: 'app',
    created () {
        this.canvasManager = new CanvasPrinter();
    },
    mounted () {
        KeyboardManager.attach();
    },
    components: {
        RayTracer
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
