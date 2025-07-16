import { MutationTree } from 'vuex'
import { CncState } from './types'
import { getDefaultState } from './index'

export const mutations: MutationTree<CncState> = {
    reset(state) {
        Object.assign(state, getDefaultState())
    },

    // Spindle mutations
    setSpindleStarting(state) {
        // Optimistic update - assume it will start
        state.spindle.isRunning = true
    },

    setSpindleRunning(state, { speed, direction }: { speed: number; direction: 'CW' | 'CCW' }) {
        state.spindle.isRunning = true
        state.spindle.speed = speed
        state.spindle.direction = direction
    },

    setSpindleStopped(state) {
        state.spindle.isRunning = false
        state.spindle.speed = 0
    },

    setSpindleStatus(state, status: any) {
        state.spindle.isRunning = status.running || false
        state.spindle.speed = status.speed || 0
        state.spindle.direction = status.direction || 'CW'
    },

    setSpindleError(state) {
        // On error, assume spindle stopped for safety
        state.spindle.isRunning = false
        state.spindle.speed = 0
    },

    // Coolant mutations
    setCoolantMist(state, enabled: boolean) {
        state.coolant.mistEnabled = enabled
        if (enabled) {
            state.coolant.floodEnabled = false // Only one type at a time
        }
    },

    setCoolantFlood(state, enabled: boolean) {
        state.coolant.floodEnabled = enabled
        if (enabled) {
            state.coolant.mistEnabled = false // Only one type at a time
        }
    },

    setCoolantOff(state) {
        state.coolant.mistEnabled = false
        state.coolant.floodEnabled = false
    },

    setCoolantStatus(state, status: any) {
        state.coolant.mistEnabled = status.mist || false
        state.coolant.floodEnabled = status.flood || false
    },

    // Tool mutations
    setCurrentTool(state, tool: number) {
        state.tool.currentTool = tool
    },

    setToolChanging(state, changing: boolean) {
        state.tool.isChanging = changing
    },

    // Coordinate system mutations
    setCoordinateSystem(state, system: string) {
        state.coordinateSystem.current = system
    },

    // Probe mutations
    setProbing(state, probing: boolean) {
        state.probe.isProbing = probing
    },

    setProbeResult(state, result: any) {
        state.probe.lastResult = {
            x: result.x || null,
            y: result.y || null,
            z: result.z || null,
        }
    },

    // Emergency stop mutations
    setEmergencyStop(state, active: boolean) {
        state.emergencyStop.isActive = active
    },
}
