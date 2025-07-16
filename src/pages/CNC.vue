<template>
    <div class="cnc-page">
        <v-container fluid class="pa-0">
            <v-row>
                <v-col cols="12">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <v-icon class="mr-2">{{ mdiHammer }}</v-icon>
                            {{ $t('CNC.Title') }}
                        </v-toolbar-title>
                        <v-spacer />
                        <v-chip v-if="isCncActive" color="warning" outlined>
                            <v-icon left small>{{ mdiAlert }}</v-icon>
                            {{ $t('CNC.SystemActive') }}
                        </v-chip>
                    </v-toolbar>
                </v-col>
            </v-row>

            <!-- Emergency Stop - Always visible at top -->
            <v-row>
                <v-col cols="12">
                    <emergency-stop-control />
                </v-col>
            </v-row>

            <!-- Main CNC Controls -->
            <v-row>
                <v-col cols="12" md="6">
                    <spindle-control />
                </v-col>
                <v-col cols="12" md="6">
                    <coolant-control />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <tool-control />
                </v-col>
                <v-col cols="12" md="6">
                    <coordinate-system-control />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <probe-control />
                </v-col>
            </v-row>

            <!-- CNC Status Overview -->
            <v-row>
                <v-col cols="12">
                    <v-card class="ma-2">
                        <v-card-title>
                            <v-icon small class="mr-2">{{ mdiInformation }}</v-icon>
                            {{ $t('CNC.StatusOverview') }}
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6" md="3">
                                    <v-chip :color="spindleStatus.running ? 'success' : 'default'" outlined block>
                                        <v-icon left small>{{ mdiSpeedometer }}</v-icon>
                                        {{ $t('CNC.Spindle') }}:
                                        <span v-if="spindleStatus.running">
                                            {{ spindleStatus.speed }} RPM {{ spindleStatus.direction }}
                                        </span>
                                        <span v-else>{{ $t('CNC.Stopped') }}</span>
                                    </v-chip>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-chip :color="coolantStatus.anyEnabled ? 'info' : 'default'" outlined block>
                                        <v-icon left small>{{ mdiWater }}</v-icon>
                                        {{ $t('CNC.Coolant') }}:
                                        <span v-if="coolantStatus.mist">{{ $t('CNC.Mist') }}</span>
                                        <span v-else-if="coolantStatus.flood">{{ $t('CNC.Flood') }}</span>
                                        <span v-else>{{ $t('CNC.Off') }}</span>
                                    </v-chip>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-chip color="default" outlined block>
                                        <v-icon left small>{{ mdiWrench }}</v-icon>
                                        {{ $t('CNC.Tool') }}: T{{ toolStatus.current }}
                                        <span v-if="toolStatus.changing">({{ $t('CNC.Changing') }})</span>
                                    </v-chip>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-chip color="default" outlined block>
                                        <v-icon left small>{{ mdiAxisArrow }}</v-icon>
                                        {{ $t('CNC.Coordinates') }}: {{ coordinateSystem }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

import SpindleControl from '@/components/cnc/SpindleControl.vue'
import CoolantControl from '@/components/cnc/CoolantControl.vue'
import ToolControl from '@/components/cnc/ToolControl.vue'
import CoordinateSystemControl from '@/components/cnc/CoordinateSystemControl.vue'
import ProbeControl from '@/components/cnc/ProbeControl.vue'
import EmergencyStopControl from '@/components/cnc/EmergencyStopControl.vue'
import { mdiHammer, mdiAlert, mdiInformation, mdiSpeedometer, mdiWater, mdiWrench, mdiAxisArrow } from '@mdi/js'

@Component({
    components: {
        SpindleControl,
        CoolantControl,
        ToolControl,
        CoordinateSystemControl,
        ProbeControl,
        EmergencyStopControl,
    },
})
export default class CNC extends Mixins(BaseMixin) {
    mdiHammer = mdiHammer
    mdiAlert = mdiAlert
    mdiInformation = mdiInformation
    mdiSpeedometer = mdiSpeedometer
    mdiWater = mdiWater
    mdiWrench = mdiWrench
    mdiAxisArrow = mdiAxisArrow

    get isCncActive() {
        return this.$store.getters['cnc/isCncActive']
    }

    get spindleStatus() {
        return this.$store.getters['cnc/spindleStatus']
    }

    get coolantStatus() {
        return this.$store.getters['cnc/coolantStatus']
    }

    get toolStatus() {
        return this.$store.getters['cnc/toolStatus']
    }

    get coordinateSystem() {
        return this.$store.getters['cnc/currentCoordinateSystem']
    }

    async mounted() {
        // Initialize CNC state when page loads
        await this.$store.dispatch('cnc/init')
    }
}
</script>

<style scoped>
.cnc-page {
    height: 100%;
}
</style>
