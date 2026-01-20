import {Container, type Graphics} from "pixi.js";

export class Pier extends Container {
    private _pierGraphics: Graphics;

    constructor(graphics: Graphics) {
        super();
        this._pierGraphics = graphics;
    }
}