<template>
    <v-card class="ma-2" color="error">
        <v-card-title class="white--text">
            <v-icon small class="mr-2" color="white">{{ mdiAlertOctagon }}</v-icon>
            {{ $t('CNC.EmergencyStop') }}
        </v-card-title>
        <v-card-text class="pb-4">
            <v-btn
                color="white"
                large
                block
                :disabled="isEmergencyStopActive"
                class="error--text"
                @click="activateEmergencyStop">
                <v-icon left large>{{ mdiStop }}</v-icon>
                {{ $t('CNC.EmergencyStopButton') }}
            </v-btn>
            <v-alert v-if="isEmergencyStopActive" type="error" class="mt-3 mb-0">
                <div class="d-flex align-center">
                    <v-icon color="error" class="mr-2">{{ mdiAlertOctagon }}</v-icon>
                    <span>{{ $t('CNC.EmergencyStopActive') }}</span>
                    <v-spacer />
                    <v-btn color="error" outlined small @click="clearEmergencyStop">
                        {{ $t('CNC.Reset') }}
                    </v-btn>
                </div>
            </v-alert>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiAlertOctagon, mdiStop } from '@mdi/js'

@Component
export default class EmergencyStopControl extends Mixins(BaseMixin) {
    mdiAlertOctagon = mdiAlertOctagon
    mdiStop = mdiStop

    get isEmergencyStopActive() {
        return this.$store.getters['cnc/isEmergencyStopActive']
    }

    async activateEmergencyStop() {
        try {
            await this.$store.dispatch('cnc/emergencyStop')
            this.$toast.error(this.$t('CNC.EmergencyStopActivated').toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.EmergencyStopFailed').toString())
            console.error('Failed to activate emergency stop:', error)
        }
    }

    clearEmergencyStop() {
        this.$store.dispatch('cnc/clearEmergencyStop')
        this.$toast.info(this.$t('CNC.EmergencyStopCleared').toString())
    }
}
</script>
