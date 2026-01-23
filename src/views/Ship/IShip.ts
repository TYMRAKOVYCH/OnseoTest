export enum ShipType {
    EMPTY,
    FULL
}

export interface IShip {
    getType(): ShipType
    setQueuePosition (x: number): void
    getQueuePosition() : number
    getCurrentPosition(): { x: number; y: number }
    getWidth(): number
    process(): void
    dispose(): void
}