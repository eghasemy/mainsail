import { Module } from 'vuex'
import { CncState } from './types'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

export const getDefaultState = (): CncState => {
    return {
        spindle: {
            isRunning: false,
            speed: 0,
            direction: 'CW',
            maxSpeed: 30000,
        },
        coolant: {
            mistEnabled: false,
            floodEnabled: false,
        },
        tool: {
            currentTool: 0,
            isChanging: false,
        },
        coordinateSystem: {
            current: 'G54',
            available: ['G54', 'G55', 'G56', 'G57', 'G58', 'G59'],
        },
        probe: {
            isProbing: false,
            lastResult: null,
        },
        emergencyStop: {
            isActive: false,
        },
    }
}

// initial state
const state = getDefaultState()

// eslint-disable-next-line
export const cnc: Module<CncState, any> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
