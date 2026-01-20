import {Container, type Size, Ticker} from "pixi.js";
import {Port} from "../views/Port";
import type {Ship} from "../views/Ship";

export class GameContainer extends Container {
    private _port!: Port;
    private _ships: Ship[] = [];

    constructor(sceneSize: Size) {
        super();
        this.initScene(sceneSize);
    }

    public update(time: Ticker) {

    }

    private initScene(sceneSize: Size): void {
        this._port = new Port(sceneSize);
        this.addChild(this._port);
    }
}