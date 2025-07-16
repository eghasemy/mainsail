<template>
    <v-card class="ma-2">
        <v-card-title>
            <v-icon small class="mr-2">{{ mdiWrench }}</v-icon>
            {{ $t('CNC.ToolControl') }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="8">
                    <v-text-field
                        v-model.number="selectedTool"
                        :label="$t('CNC.ToolNumber')"
                        type="number"
                        :min="0"
                        :max="999"
                        :disabled="isToolChanging"
                        outlined
                        dense />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-btn
                        color="primary"
                        :disabled="isToolChanging || selectedTool === currentTool"
                        :loading="isToolChanging"
                        block
                        @click="changeTool">
                        <v-icon left>{{ mdiAutorenew }}</v-icon>
                        {{ $t('CNC.ChangeTool') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-chip color="info" outlined>
                        <v-icon left small>{{ mdiInformation }}</v-icon>
                        {{ $t('CNC.CurrentTool') }}: T{{ currentTool }}
                    </v-chip>
                    <v-chip v-if="isToolChanging" color="warning" outlined class="ml-2">
                        <v-icon left small>{{ mdiLoading }}</v-icon>
                        {{ $t('CNC.ToolChanging') }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { mdiWrench, mdiAutorenew, mdiInformation, mdiLoading } from '@mdi/js'

@Component
export default class ToolControl extends Mixins(BaseMixin) {
    mdiWrench = mdiWrench
    mdiAutorenew = mdiAutorenew
    mdiInformation = mdiInformation
    mdiLoading = mdiLoading

    selectedTool = 1

    get currentTool() {
        return this.$store.getters['cnc/currentTool']
    }

    get isToolChanging() {
        return this.$store.getters['cnc/isToolChanging']
    }

    async changeTool() {
        try {
            await this.$store.dispatch('cnc/changeTool', {
                tool: this.selectedTool,
            })
            this.$toast.success(this.$t('CNC.ToolChanged', { tool: this.selectedTool }).toString())
        } catch (error) {
            this.$toast.error(this.$t('CNC.ToolChangeFailed').toString())
            console.error('Failed to change tool:', error)
        }
    }

    mounted() {
        // Set selected tool to current tool on mount
        this.selectedTool = this.currentTool || 1
    }
}
</script>
