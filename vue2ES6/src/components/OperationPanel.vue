<template>
    <div id="operation-panel" class="display-part" style="padding: 24px">
        <fieldset>
            <legend>Reflection</legend>
            <div class="display-item">
                <input type="checkbox" id="reflectFloor" :checked="reflectFloor" @change="onReflectFloorChange()"/>
                <label for="reflectFloor">Reflect floor</label>
            </div>

            <div>
                <span>View Point: </span>
                <span><input type="range" min="0.3" max="0.6" step="0.01" ref="viewPointRange"
                    :value="viewPointRange" @change="onViewPointRangeChange($event)"/></span>
            </div>
        </fieldset>
        <fieldset>
            <legend>Fog</legend>
            <div class="display-item">
                <input type="checkbox" id="useFog" :checked="useFog" @change="onUseFogChange()"/>
                <label for="useFog">Use Fog</label>
            </div>
            <div>
                <span>Fog Density: </span>
                <span><input type="range" min="1.0" max="2.5" step="0.1" ref="fogDensityRange"
                    :value="fogDensityRange" @change="onFogDensityRangeChange($event)"/></span>
            </div>
        </fieldset>

        <div>点键盘上下左右改变球的坐标</div>
    </div>
</template>

<script>
import EventManager from '../event/EventManager';
import Events from '../event/Events';
export default {

    data () {
        return {
            fogDensityRange: 2,
            useFog: false,
            viewPointRange: 0.4,
            reflectFloor: true
        };
    },

    mounted () {
        EventManager.fire(Events.OPERATION_PANEL_READY, {
            fogDensity: parseFloat(this.fogDensityRange),
            useFog: this.useFog,
            reflectFloor: this.reflectFloor,
            viewPoint: parseFloat(this.viewPointRange)
        });
    },

    methods: {
        onReflectFloorChange () {
            this.reflectFloor = !this.reflectFloor;
            EventManager.fire(Events.USE_REFLECT_CHANGE, {
                reflectFloor: this.reflectFloor
            });
        },
        onUseFogChange () {
            this.useFog = !this.useFog;
            EventManager.fire(Events.USE_FOG_CHANGE, {
                useFog: this.useFog
            });
        },
        onFogDensityRangeChange (e) {
            this.fogDensityRange = (e.target || e.srcElement).value;
            EventManager.fire(Events.FOG_DENSITY_CHANGE, {
                fogDensity: parseFloat(this.fogDensityRange)
            });
        },
        onViewPointRangeChange (e) {
            this.viewPointRange = (e.target || e.srcElement).value;
            EventManager.fire(Events.VIEW_POINT_CHANGE, {
                viewPoint: parseFloat(this.viewPointRange)
            });
        }
    }

}

</script>
<style scoped>
.display-item {
    text-align: left;
}
</style>
