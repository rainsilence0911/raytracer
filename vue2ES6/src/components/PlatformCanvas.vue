<template>
    <div id="canvas-container" class="display-part">
        <canvas ref="canvas" width="800px" height="600px"></canvas>
    </div>
</template>

<script>
import EventManager from '../event/EventManager';
import Events from '../event/Events';
export default {
    mounted () {
        EventManager.fire(Events.CANVAS_READY, {
            canvas: this.$refs.canvas
        });
    }
};
</script>
