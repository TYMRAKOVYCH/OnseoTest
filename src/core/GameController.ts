import {Container, type Size, Ticker} from "pixi.js";
import {Port} from "../views/Port";
import {Ship, ShipType} from "../views/Ship";
import {Group} from "@tweenjs/tween.js";

export class GameController extends Container {
    private _port!: Port;
    private _fullShipsQueue: Ship[] = [];
    private _emptyShipsQueue: Ship[] = [];
    private _sceneSize: Size;
    private _tweenGroup: Group;

    constructor(sceneSize: Size) {
        super();
        this._sceneSize = sceneSize;
        this.initScene(sceneSize);
        this._tweenGroup = new Group();
    }

    public update(ticker: Ticker) {
        this._tweenGroup.update(ticker.elapsedMS);
    }

    private initScene(sceneSize: Size): void {
        this._port = new Port(sceneSize);
        this.addChild(this._port);
        this.startGenerateShips();
    }

    private startGenerateShips(): void {
        setInterval(() => {
            const type = Math.random() > 0.5 ? ShipType.FULL : ShipType.EMPTY;
            const ship = new Ship(this._sceneSize, type);
            this.addChild(ship);
            this.processShip(ship);
        }, 8000);
    }

    private processShip(ship: Ship): void {

    }
}