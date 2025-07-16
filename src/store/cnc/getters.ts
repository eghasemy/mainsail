import { GetterTree } from 'vuex'
import { CncState } from './types'
import { RootState } from '@/store/types'

export const getters: GetterTree<CncState, RootState> = {
    // Spindle getters
    isSpindleRunning: (state) => state.spindle.isRunning,
    spindleSpeed: (state) => state.spindle.speed,
    spindleDirection: (state) => state.spindle.direction,
    spindleMaxSpeed: (state) => state.spindle.maxSpeed,

    spindleStatus: (state) => ({
        running: state.spindle.isRunning,
        speed: state.spindle.speed,
        direction: state.spindle.direction,
        maxSpeed: state.spindle.maxSpeed,
    }),

    // Coolant getters
    isMistCoolantEnabled: (state) => state.coolant.mistEnabled,
    isFloodCoolantEnabled: (state) => state.coolant.floodEnabled,
    isCoolantEnabled: (state) => state.coolant.mistEnabled || state.coolant.floodEnabled,

    coolantStatus: (state) => ({
        mist: state.coolant.mistEnabled,
        flood: state.coolant.floodEnabled,
        anyEnabled: state.coolant.mistEnabled || state.coolant.floodEnabled,
    }),

    // Tool getters
    currentTool: (state) => state.tool.currentTool,
    isToolChanging: (state) => state.tool.isChanging,

    toolStatus: (state) => ({
        current: state.tool.currentTool,
        changing: state.tool.isChanging,
    }),

    // Coordinate system getters
    currentCoordinateSystem: (state) => state.coordinateSystem.current,
    availableCoordinateSystems: (state) => state.coordinateSystem.available,

    coordinateSystemStatus: (state) => ({
        current: state.coordinateSystem.current,
        available: state.coordinateSystem.available,
    }),

    // Probe getters
    isProbing: (state) => state.probe.isProbing,
    lastProbeResult: (state) => state.probe.lastResult,

    probeStatus: (state) => ({
        probing: state.probe.isProbing,
        lastResult: state.probe.lastResult,
    }),

    // Emergency stop getters
    isEmergencyStopActive: (state) => state.emergencyStop.isActive,

    // Combined status getters
    cncStatus: (state) => ({
        spindle: {
            running: state.spindle.isRunning,
            speed: state.spindle.speed,
            direction: state.spindle.direction,
        },
        coolant: {
            mist: state.coolant.mistEnabled,
            flood: state.coolant.floodEnabled,
        },
        tool: {
            current: state.tool.currentTool,
            changing: state.tool.isChanging,
        },
        coordinateSystem: state.coordinateSystem.current,
        probing: state.probe.isProbing,
        emergencyStop: state.emergencyStop.isActive,
    }),

    // Safety status - true if any potentially dangerous operations are active
    isCncActive: (state) =>
        state.spindle.isRunning ||
        state.coolant.mistEnabled ||
        state.coolant.floodEnabled ||
        state.tool.isChanging ||
        state.probe.isProbing,
}
