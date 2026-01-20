import {Container, type Graphics} from "pixi.js";

export enum PierState {
    FULL = 0,
    EMPTY = 1,
    IN_PROGRESS = 2,
}

export class Pier extends Container {
    private _id: number;
    private _pierGraphics: Graphics;
    private _isReady = false;
    private _state = PierState.FULL;

    constructor(id: number, graphics: Graphics) {
        super();
        this._id = id;
        this._pierGraphics = graphics;
    }

    public getPierStet(): PierState {
        return this._state;
    }

    public setPierState(pierState: PierState) {
        this._state = pierState;
    }
}