import {Container, Size, Ticker} from "pixi.js";
import {Port} from "../views/Port";
import {Group, Tween} from "@tweenjs/tween.js";
import {Pier} from "../views/Pier";
import {IShip, ShipType} from "../views/Ship/IShip";
import {RedShip} from "../views/Ship/RedShip";
import {GreenShip} from "../views/Ship/GreenShip";

export class PortController extends Container {
    private readonly _sceneSize: Size;
    private _port!: Port;
    private _enterPortEmptyShipsQueue: IShip[] = [];
    private _enterPortFullShipsQueue: IShip[] = [];
    private _exitPortShipsQueue: { ship: IShip, pier: Pier }[] = [];
    private _tween: Group;
    private _timerValue: number = 0;

    constructor(sceneSize: Size) {
        super();
        this._sceneSize = sceneSize;
        this._tween = new Group();
        this.initScene(sceneSize);
    }

    public update(ticker: Ticker): void {
        this.processShipQueue();
        this._timerValue += ticker.elapsedMS;
        if(this._timerValue >= 8000) {
            this._timerValue = 0;
            this.createAndProcessShips();
        }
        this._tween.update();
    }

    private processShipQueue(): void {
        if (!this._port.isEntranceLocked()) {

            const entryQueues = [
                this._enterPortEmptyShipsQueue,
                this._enterPortFullShipsQueue
            ];

            entryQueues.sort((a, b) => b.length - a.length);

            for (const queue of entryQueues) {
                if (queue.length > 0) {
                    const shipType = queue[0]!.getType();
                    const availablePier = this._port.getAvailablePier(shipType);

                    if (availablePier) {
                        const ship = queue.shift()!;
                        this.processShip(ship, availablePier);
                        this.reorderShipQueue(queue);
                        return;
                    }
                }
            }

            if (this._exitPortShipsQueue.length) {
                const shipData = this._exitPortShipsQueue.shift()!;
                this.leavePort(shipData.ship, shipData.pier);
            }
        }
    }

    private reorderShipQueue(queue: IShip[]): void {
        if (queue.length > 0) {
            const reorderTween: Tween[] = [];
            for (let i = 0; i < queue.length; i++) {
                const currentShip = queue[i]!;
                const newPosition = i === 0 ? this._sceneSize.width / 2 : queue[i - 1]!.getQueuePosition() + (currentShip.getWidth() + currentShip.getWidth() / 5);
                currentShip.setQueuePosition(newPosition);
                const tween = new Tween(currentShip.getCurrentPosition()).to({x: newPosition}, 1000).start()
                reorderTween.push(tween);
            }
            this._tween.add(...reorderTween);
        }
    }

    private updateShipQueue(ship: IShip): void {
        const positionX = this.getQueuePosition(ship);
        ship.setQueuePosition(positionX);
        const toPark = new Tween(ship.getCurrentPosition())
            .to({x: positionX}, 1000).start();
        this._tween.add(toPark);
    }

    private initScene(sceneSize: Size): void {
        this._port = new Port(sceneSize);
        this.addChild(this._port);
        this.createAndProcessShips();
    }

    private createAndProcessShips(): void {
        const ship = Math.random() > 0.5 ? new RedShip(this._sceneSize) : new GreenShip(this._sceneSize);
        this.addChild(ship);
        this.processNewShip(ship);
    }

    private isQueueEmpty(ship: IShip): boolean {
        const queue = this.getQueueByShipType(ship);
        if (queue.length) {
            return !queue.find((queueShip) => queueShip.getType() === ship.getType());
        }
        return true;
    }

    private getQueueByShipType(ship: IShip): IShip[] {
        return ship.getType() === ShipType.FULL ? this._enterPortFullShipsQueue : this._enterPortEmptyShipsQueue;
    }

    private processNewShip(ship: IShip): void {
        if (!this._port.isEntranceLocked() && this.isQueueEmpty(ship)) {
            const availablePier = this._port.getAvailablePier(ship.getType());
            if (availablePier) {
                this.processShip(ship, availablePier);
                return;
            }
        }
        const positionX = this.getQueuePosition(ship);
        const queue = this.getQueueByShipType(ship);
        ship.setQueuePosition(positionX);
        const toPark = new Tween(ship.getCurrentPosition())
            .to({x: positionX}, 2000).onComplete(() => {
                this.updateShipQueue(ship);
                queue.push(ship);
            }).start();
        this._tween.add(toPark);
    }

    private processShip(ship: IShip, pier: Pier): void {
        this._port.lockEntrance();
        this._port.lockPier(pier);
        const portEntrancePosition = this._port.getEntrancePosition();
        const pierPoint = pier.getPierPoint();
        const toPierTween = new Tween(ship.getCurrentPosition())
            .to({x: pierPoint.x, y: pierPoint.y}, 3000)
            .onComplete(() => {
                this.processCargo(ship, pier);
            });
        const toEntranceTween = new Tween(ship.getCurrentPosition())
            .to(portEntrancePosition, 3000)
            .onComplete(() => {
                this._port.unlockEntrance();
            })
            .chain(
                toPierTween
            )
        toEntranceTween.start();
        this._tween.add(toEntranceTween, toPierTween);
    }

    private getQueuePosition(currentShip: IShip): number {
        const queue = this.getQueueByShipType(currentShip);
        if (queue.length > 0) {
            return queue[queue.length - 1]!.getQueuePosition() + (currentShip.getWidth() + currentShip.getWidth() / 5);
        }
        return this._sceneSize.width / 2;
    }

    private processCargo(ship: IShip, pier: Pier): void {
        let timerValue = 0;
        const updateTickerFunc = (timer: Ticker) => {
            timerValue += timer.elapsedMS;
            if (timerValue >= 5000) {
                timerValue = 0;
                ship.process();
                pier.process();
                this.leavePort(ship, pier);
                Ticker.shared.remove(updateTickerFunc);
            }
        }
        Ticker.shared.add(updateTickerFunc);
    }

    private leavePort(ship: IShip, pier: Pier): void {
        if (!this._port.isEntranceLocked()) {
            this._port.lockEntrance();
            const portEntrancePosition = this._port.getEntrancePosition();
            const leaveTween = new Tween(ship.getCurrentPosition())
                .to({x: this._sceneSize.width}, 3000)
                .onComplete(() => ship.dispose());
            const toEntranceTween = new Tween(ship.getCurrentPosition())
                .to(portEntrancePosition, 3000)
                .onComplete(() => {
                    this._port.unlockEntrance();
                    this._port.ulockPier(pier)
                })
                .chain(leaveTween);
            toEntranceTween.start()
            this._tween.add(toEntranceTween, leaveTween);
        } else {
            this._exitPortShipsQueue.push({ship: ship, pier: pier});
        }
    }
}