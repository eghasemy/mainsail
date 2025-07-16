<template>
    <v-card class="ma-2">
        <v-card-title>
            <v-icon small class="mr-2">{{ mdiSpeedometer }}</v-icon>
            {{ $t('CNC.SpindleControl') }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field
                        v-model.number="spindleSpeed"
                        :label="$t('CNC.Speed')"
                        :suffix="$t('CNC.RPM')"
                        type="number"
                        :min="0"
                        :max="maxSpeed"
                        :disabled="isSpindleRunning"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="6">
                    <v-select
                        v-model="spindleDirection"
                        :items="directionOptions"
                        :label="$t('CNC.Direction')"
                        :disabled="isSpindleRunning"
                        outlined
                        dense />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-btn
                        v-if="!isSpindleRunning"
                        color="success"
                        :disabled="spindleSpeed <= 0"
                        class="mr-2"
                        @click="startSpindle">
                        <v-icon left>{{ mdiPlay }}</v-icon>
                        {{ $t('CNC.StartSpindle') }}
                    </v-btn>
                    <v-btn v-else color="error" class="mr-2" @click="stopSpindle">
                        <v-icon left>{{ mdiStop }}</v-icon>
                        {{ $t('CNC.StopSpindle') }}
                    </v-btn>
                    <v-chip v-if="isSpindleRunning" color="success" outlined>
                        <v-icon left small>{{ mdiCheckCircle }}</v-icon>
                        {{ currentSpeed }} {{ $t('CNC.RPM') }} {{ currentDirection }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiSpeedometer, mdiPlay, mdiStop, mdiCheckCircle } from '@mdi/js'

@Component
export default class SpindleControl extends Mixins(BaseMixin) {
    mdiSpeedometer = mdiSpeedometer
    mdiPlay = mdiPlay
    mdiStop = mdiStop
    mdiCheckCircle = mdiCheckCircle

    spindleSpeed = 1000
    spindleDirection = 'CW'

    get isSpindleRunning() {
        return this.$store.getters['cnc/isSpindleRunning']
    }

    get currentSpeed() {
        return this.$store.getters['cnc/spindleSpeed']
    }

    get currentDirection() {
        return this.$store.getters['cnc/spindleDirection']
    }

    get maxSpeed() {
        return this.$store.getters['cnc/spindleMaxSpeed']
    }

    get directionOptions() {
        return [
            { text: this.$t('CNC.Clockwise'), value: 'CW' },
            { text: this.$t('CNC.CounterClockwise'), value: 'CCW' },
        ]
    }

    async startSpindle() {
        try {
            await this.$store.dispatch('cnc/startSpindle', {
                speed: this.spindleSpeed,
                direction: this.spindleDirection,
            })
            this.$toast.success(this.$t('CNC.SpindleStarted').toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.SpindleStartFailed').toString())
            console.error('Failed to start spindle:', error)
        }
    }

    async stopSpindle() {
        try {
            await this.$store.dispatch('cnc/stopSpindle')
            this.$toast.success(this.$t('CNC.SpindleStopped').toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.SpindleStopFailed').toString())
            console.error('Failed to stop spindle:', error)
        }
    }
}
</script>
