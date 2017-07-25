<template>
    <div id="ray-tracer">
        <platform-canvas/>
        <operation-panel/>
    </div>
</template>

<script>
import OperationPanel from './OperationPanel.vue';
import PlatformCanvas from './PlatformCanvas.vue';

export default {
    components: {
        PlatformCanvas,
        OperationPanel
    }
};
</script>

<style scoped>
.display-part {
    display: inline-block;
    vertical-align: top;
}
</style>