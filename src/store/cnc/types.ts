export interface CncState {
    spindle: {
        isRunning: boolean
        speed: number
        direction: 'CW' | 'CCW'
        maxSpeed: number
    }
    coolant: {
        mistEnabled: boolean
        floodEnabled: boolean
    }
    tool: {
        currentTool: number
        isChanging: boolean
    }
    coordinateSystem: {
        current: string
        available: string[]
    }
    probe: {
        isProbing: boolean
        lastResult: {
            x: number | null
            y: number | null
            z: number | null
        } | null
    }
    emergencyStop: {
        isActive: boolean
    }
}

export interface SpindleControlRequest {
    speed: number
    direction: 'CW' | 'CCW'
}

export interface ToolChangeRequest {
    tool: number
}

export interface CoordinateSystemRequest {
    system: string
}

export interface ProbeRequest {
    x?: number
    y?: number
    z?: number
    feedRate?: number
}
