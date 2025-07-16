<template>
    <v-card class="ma-2">
        <v-card-title>
            <v-icon small class="mr-2">{{ mdiTarget }}</v-icon>
            {{ $t('CNC.ProbeControl') }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3">
                    <v-text-field
                        v-model.number="probeX"
                        :label="$t('CNC.ProbeX')"
                        type="number"
                        step="0.1"
                        :disabled="isProbing"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field
                        v-model.number="probeY"
                        :label="$t('CNC.ProbeY')"
                        type="number"
                        step="0.1"
                        :disabled="isProbing"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field
                        v-model.number="probeZ"
                        :label="$t('CNC.ProbeZ')"
                        type="number"
                        step="0.1"
                        :disabled="isProbing"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field
                        v-model.number="feedRate"
                        :label="$t('CNC.FeedRate')"
                        type="number"
                        :min="1"
                        :disabled="isProbing"
                        outlined
                        dense />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-btn color="warning" :disabled="!canProbe" :loading="isProbing" class="mr-2" @click="startProbe">
                        <v-icon left>{{ mdiTarget }}</v-icon>
                        {{ $t('CNC.StartProbe') }}
                    </v-btn>
                    <v-chip v-if="isProbing" color="warning" outlined>
                        <v-icon left small>{{ mdiLoading }}</v-icon>
                        {{ $t('CNC.Probing') }}
                    </v-chip>
                </v-col>
            </v-row>
            <v-row v-if="lastProbeResult">
                <v-col cols="12">
                    <v-card outlined>
                        <v-card-subtitle>{{ $t('CNC.LastProbeResult') }}</v-card-subtitle>
                        <v-card-text>
                            <v-chip v-if="lastProbeResult.x !== null" color="info" outlined class="mr-2 mb-2">
                                X: {{ lastProbeResult.x.toFixed(3) }}
                            </v-chip>
                            <v-chip v-if="lastProbeResult.y !== null" color="info" outlined class="mr-2 mb-2">
                                Y: {{ lastProbeResult.y.toFixed(3) }}
                            </v-chip>
                            <v-chip v-if="lastProbeResult.z !== null" color="info" outlined class="mr-2 mb-2">
                                Z: {{ lastProbeResult.z.toFixed(3) }}
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiTarget, mdiLoading } from '@mdi/js'

@Component
export default class ProbeControl extends Mixins(BaseMixin) {
    mdiTarget = mdiTarget
    mdiLoading = mdiLoading

    probeX: number | null = null
    probeY: number | null = null
    probeZ = -10
    feedRate = 100

    get isProbing() {
        return this.$store.getters['cnc/isProbing']
    }

    get lastProbeResult() {
        return this.$store.getters['cnc/lastProbeResult']
    }

    get canProbe() {
        return this.probeX !== null || this.probeY !== null || this.probeZ !== null
    }

    async startProbe() {
        try {
            const probeRequest: any = {
                feedRate: this.feedRate,
            }

            if (this.probeX !== null) probeRequest.x = this.probeX
            if (this.probeY !== null) probeRequest.y = this.probeY
            if (this.probeZ !== null) probeRequest.z = this.probeZ

            const result = await this.$store.dispatch('cnc/startProbe', probeRequest)
            this.$toast.success(this.$t('CNC.ProbeCompleted').toString())
            console.log('Probe result:', result)
        } catch (error) {
            this.$toast.error(this.$t('CNC.ProbeFailed').toString())
            console.error('Failed to execute probe:', error)
        }
    }
}
</script>
