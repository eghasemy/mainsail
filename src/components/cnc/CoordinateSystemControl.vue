<template>
    <v-card class="ma-2">
        <v-card-title>
            <v-icon small class="mr-2">{{ mdiAxisArrow }}</v-icon>
            {{ $t('CNC.CoordinateSystem') }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="8">
                    <v-select
                        v-model="selectedSystem"
                        :items="availableSystems"
                        :label="$t('CNC.WorkCoordinateSystem')"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-btn
                        color="primary"
                        :disabled="selectedSystem === currentSystem"
                        block
                        @click="setCoordinateSystem">
                        <v-icon left>{{ mdiCheck }}</v-icon>
                        {{ $t('CNC.SetSystem') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-chip color="success" outlined>
                        <v-icon left small>{{ mdiCheckCircle }}</v-icon>
                        {{ $t('CNC.ActiveSystem') }}: {{ currentSystem }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiAxisArrow, mdiCheck, mdiCheckCircle } from '@mdi/js'

@Component
export default class CoordinateSystemControl extends Mixins(BaseMixin) {
    mdiAxisArrow = mdiAxisArrow
    mdiCheck = mdiCheck
    mdiCheckCircle = mdiCheckCircle

    selectedSystem = 'G54'

    get currentSystem() {
        return this.$store.getters['cnc/currentCoordinateSystem']
    }

    get availableSystems() {
        return this.$store.getters['cnc/availableCoordinateSystems'].map((system: string) => ({
            text: system,
            value: system,
        }))
    }

    async setCoordinateSystem() {
        try {
            await this.$store.dispatch('cnc/setCoordinateSystem', {
                system: this.selectedSystem,
            })
            this.$toast.success(this.$t('CNC.CoordinateSystemSet', { system: this.selectedSystem }).toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.CoordinateSystemSetFailed').toString())
            console.error('Failed to set coordinate system:', error)
        }
    }

    mounted() {
        // Set selected system to current system on mount
        this.selectedSystem = this.currentSystem || 'G54'
    }
}
</script>
