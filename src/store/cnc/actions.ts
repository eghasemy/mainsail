import Vue from 'vue'
import { ActionTree } from 'vuex'
import { CncState, SpindleControlRequest, ToolChangeRequest, CoordinateSystemRequest, ProbeRequest } from './types'
import { RootState } from '@/store/types'

export const actions: ActionTree<CncState, RootState> = {
    reset({ commit }) {
        commit('reset')
    },

    // Spindle control actions
    async startSpindle({ commit }, { speed, direction }: SpindleControlRequest) {
        commit('setSpindleStarting')
        try {
            await Vue.$socket.emitAndWait('printer.cnc.spindle.start', { speed, direction })
            commit('setSpindleRunning', { speed, direction })
        } catch (error) {
            commit('setSpindleError')
            throw error
        }
    },

    async stopSpindle({ commit }) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.spindle.stop')
            commit('setSpindleStopped')
        } catch (error) {
            commit('setSpindleError')
            throw error
        }
    },

    async getSpindleStatus({ commit }) {
        try {
            const response = await Vue.$socket.emitAndWait('printer.cnc.spindle.status')
            commit('setSpindleStatus', response)
        } catch (error) {
            console.error('Failed to get spindle status:', error)
        }
    },

    // Coolant control actions
    async enableMistCoolant({ commit }) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.coolant.mist')
            commit('setCoolantMist', true)
        } catch (error) {
            console.error('Failed to enable mist coolant:', error)
            throw error
        }
    },

    async enableFloodCoolant({ commit }) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.coolant.flood')
            commit('setCoolantFlood', true)
        } catch (error) {
            console.error('Failed to enable flood coolant:', error)
            throw error
        }
    },

    async disableCoolant({ commit }) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.coolant.off')
            commit('setCoolantOff')
        } catch (error) {
            console.error('Failed to disable coolant:', error)
            throw error
        }
    },

    async getCoolantStatus({ commit }) {
        try {
            const response = await Vue.$socket.emitAndWait('printer.cnc.coolant.status')
            commit('setCoolantStatus', response)
        } catch (error) {
            console.error('Failed to get coolant status:', error)
        }
    },

    // Tool control actions
    async changeTool({ commit }, { tool }: ToolChangeRequest) {
        commit('setToolChanging', true)
        try {
            await Vue.$socket.emitAndWait('printer.cnc.tool.change', { tool })
            commit('setCurrentTool', tool)
        } catch (error) {
            console.error('Failed to change tool:', error)
            throw error
        } finally {
            commit('setToolChanging', false)
        }
    },

    async getToolStatus({ commit }) {
        try {
            const response = await Vue.$socket.emitAndWait('printer.cnc.tool.status')
            commit('setCurrentTool', response.tool)
        } catch (error) {
            console.error('Failed to get tool status:', error)
        }
    },

    // Coordinate system actions
    async setCoordinateSystem({ commit }, { system }: CoordinateSystemRequest) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.coordinate_system', { system })
            commit('setCoordinateSystem', system)
        } catch (error) {
            console.error('Failed to set coordinate system:', error)
            throw error
        }
    },

    async getCoordinateSystem({ commit }) {
        try {
            const response = await Vue.$socket.emitAndWait('printer.cnc.coordinate_system')
            commit('setCoordinateSystem', response.system)
        } catch (error) {
            console.error('Failed to get coordinate system:', error)
        }
    },

    // Probe actions
    async startProbe({ commit }, probeRequest: ProbeRequest) {
        commit('setProbing', true)
        try {
            const response = await Vue.$socket.emitAndWait('printer.cnc.probe', probeRequest)
            commit('setProbeResult', response)
            return response
        } catch (error) {
            console.error('Failed to execute probe:', error)
            throw error
        } finally {
            commit('setProbing', false)
        }
    },

    // Emergency stop
    async emergencyStop({ commit }) {
        try {
            await Vue.$socket.emitAndWait('printer.cnc.emergency_stop')
            commit('setEmergencyStop', true)
        } catch (error) {
            console.error('Failed to execute emergency stop:', error)
            throw error
        }
    },

    clearEmergencyStop({ commit }) {
        commit('setEmergencyStop', false)
    },

    // Initialize CNC state
    async init({ dispatch }) {
        try {
            await Promise.all([
                dispatch('getSpindleStatus'),
                dispatch('getCoolantStatus'),
                dispatch('getToolStatus'),
                dispatch('getCoordinateSystem'),
            ])
        } catch (error) {
            console.error('Failed to initialize CNC state:', error)
        }
    },
}
