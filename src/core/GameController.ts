import {Container, type Size, Ticker} from "pixi.js";
import {Port} from "../views/Port";
import {Ship, ShipState, ShipType} from "../views/Ship";
import {Group, Tween} from "@tweenjs/tween.js";
import {type Pier} from "../views/Pier";


export class GameController extends Container {
    private _port!: Port;
    private _enterPortShipsQueue: Ship[] = [];
    private _exitPortShipsQueue: { ship :Ship, pier: Pier}[] = [];
    private _sceneSize: Size;
    private _tween: Group;

    constructor(sceneSize: Size) {
        super();
        this._sceneSize = sceneSize;
        this._tween = new Group();
        this.initScene(sceneSize);
    }

    public update(ticker: Ticker) {
        this._tween.update();
        this.processShipQueue();
    }

    private processShipQueue() {
        if (!this._port.isEntranceLocked()) {
            if (this._enterPortShipsQueue.length) {
                const ship = this._enterPortShipsQueue.shift()!;
                this.processShip(ship);
            }
            if (this._exitPortShipsQueue.length) {
                const shipData = this._exitPortShipsQueue.shift()!;
                this.leavePort(shipData.ship, shipData.pier!);
            }
        }
    }

    private initScene(sceneSize: Size): void {
        this._port = new Port(sceneSize);
        this.addChild(this._port);
        this.startGenerateShips();
    }

    private startGenerateShips(): void {
        this.createAndProcessShips();
        setInterval(() => {
            this.createAndProcessShips();
        }, 8000);
    }

    private createAndProcessShips(): void {
        const type = Math.random() > 0.6 ? ShipType.FULL : ShipType.EMPTY;
        const ship = new Ship(this._sceneSize, type);
        this.addChild(ship);
        this.processShip(ship);
    }

    private processShip(ship: Ship): void {
        const availablePier = this._port.getAvailablePier(ship.getType());
        if (!this._port.isEntranceLocked() && availablePier) {
            this._port.lockEntrance();
            this._port.lockPier(availablePier);
            ship.setState(ShipState.IN_PROGRESS)
            const portEntrancePosition = this._port.getEntrancePosition();
            const pierPoint = availablePier.getPierPoint();
            const toPierTween = new Tween(ship.position)
                .to({ x: pierPoint.x, y: pierPoint.y }, 3000)
                .onComplete(() => { this.processCargo(ship, availablePier); console.log("cargo") });
            const toEntranceTween = new Tween(ship.position)
                .to(portEntrancePosition, 3000)
                .onComplete(() => { this._port.unlockEntrance(); })
                .chain(
                    toPierTween
                )
            toEntranceTween.start();
            this._tween.add(toEntranceTween, toPierTween);
        }
        else {
            this._enterPortShipsQueue.push(ship);
            const toPark = new Tween(ship.position)
                .to({ x: this._sceneSize.width / 2 }, 3000).onComplete(() => ship.setState(ShipState.WAIT_ENTER)).start();
            this._tween.add(toPark);
        }
    }

    private checkQueue(shipType: ShipType): boolean | undefined {
        if (this._enterPortShipsQueue.length) {
            return !this._enterPortShipsQueue.find((ship: Ship) => {
                return ship.getType() === shipType
            });
        }
    }

    private processCargo(ship: Ship, pier: Pier): void {
        setTimeout(() => {
            ship.process();
            pier.process();
            this.leavePort(ship, pier);
        }, 5000);
    }

    private leavePort(ship: Ship, pier: Pier): void {
        if (!this._port.isEntranceLocked()) {
            this._port.lockEntrance();
            const portEntrancePosition = this._port.getEntrancePosition();
            const leaveTween = new Tween(ship.position)
                .to({ x: this._sceneSize.width }, 3000)
                .onComplete(() => ship.destroy());
            const toEntranceTween = new Tween(ship.position)
                .to(portEntrancePosition, 3000)
                .onComplete(() => { this._port.unlockEntrance(); this._port.ulockPier(pier) })
                .chain(leaveTween);
            toEntranceTween.start()
            this._tween.add(toEntranceTween, leaveTween);
        }
        else {
            ship.setState(ShipState.WAIT_EXIT);
            this._exitPortShipsQueue.push({ ship: ship, pier: pier });
        }
    }
}