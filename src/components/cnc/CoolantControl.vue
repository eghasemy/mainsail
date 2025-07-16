<template>
    <v-card class="ma-2">
        <v-card-title>
            <v-icon small class="mr-2">{{ mdiWater }}</v-icon>
            {{ $t('CNC.CoolantControl') }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-btn
                        :color="isMistEnabled ? 'success' : 'default'"
                        :outlined="!isMistEnabled"
                        block
                        @click="toggleMist">
                        <v-icon left>{{ mdiSpray }}</v-icon>
                        {{ $t('CNC.MistCoolant') }}
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-btn
                        :color="isFloodEnabled ? 'success' : 'default'"
                        :outlined="!isFloodEnabled"
                        block
                        @click="toggleFlood">
                        <v-icon left>{{ mdiWaterPump }}</v-icon>
                        {{ $t('CNC.FloodCoolant') }}
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-btn color="error" :disabled="!isCoolantEnabled" block @click="turnOffCoolant">
                        <v-icon left>{{ mdiWaterOff }}</v-icon>
                        {{ $t('CNC.CoolantOff') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="isCoolantEnabled">
                <v-col cols="12">
                    <v-chip color="info" outlined>
                        <v-icon left small>{{ mdiInformation }}</v-icon>
                        <span v-if="isMistEnabled">{{ $t('CNC.MistCoolantActive') }}</span>
                        <span v-else-if="isFloodEnabled">{{ $t('CNC.FloodCoolantActive') }}</span>
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiWater, mdiSpray, mdiWaterPump, mdiWaterOff, mdiInformation } from '@mdi/js'

@Component
export default class CoolantControl extends Mixins(BaseMixin) {
    mdiWater = mdiWater
    mdiSpray = mdiSpray
    mdiWaterPump = mdiWaterPump
    mdiWaterOff = mdiWaterOff
    mdiInformation = mdiInformation

    get isMistEnabled() {
        return this.$store.getters['cnc/isMistCoolantEnabled']
    }

    get isFloodEnabled() {
        return this.$store.getters['cnc/isFloodCoolantEnabled']
    }

    get isCoolantEnabled() {
        return this.$store.getters['cnc/isCoolantEnabled']
    }

    async toggleMist() {
        try {
            if (this.isMistEnabled) {
                await this.$store.dispatch('cnc/disableCoolant')
                this.$toast.success(this.$t('CNC.CoolantDisabled').toString())
            } else {
                await this.$store.dispatch('cnc/enableMistCoolant')
                this.$toast.success(this.$t('CNC.MistCoolantEnabled').toString())
            }
        } catch (error) {
            this.$toast.error(this.$t('CNC.CoolantControlFailed').toString())
            console.error('Failed to toggle mist coolant:', error)
        }
    }

    async toggleFlood() {
        try {
            if (this.isFloodEnabled) {
                await this.$store.dispatch('cnc/disableCoolant')
                this.$toast.success(this.$t('CNC.CoolantDisabled').toString())
            } else {
                await this.$store.dispatch('cnc/enableFloodCoolant')
                this.$toast.success(this.$t('CNC.FloodCoolantEnabled').toString())
            }
        } catch (error) {
            this.$toast.error(this.$t('CNC.CoolantControlFailed').toString())
            console.error('Failed to toggle flood coolant:', error)
        }
    }

    async turnOffCoolant() {
        try {
            await this.$store.dispatch('cnc/disableCoolant')
            this.$toast.success(this.$t('CNC.CoolantDisabled').toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.CoolantControlFailed').toString())
            console.error('Failed to turn off coolant:', error)
        }
    }
}
</script>
