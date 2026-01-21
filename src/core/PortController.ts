import {Container, type Size} from "pixi.js";
import {Port} from "../views/Port";
import {Ship, ShipType} from "../views/Ship";
import {Group, Tween} from "@tweenjs/tween.js";
import {type Pier} from "../views/Pier";


export class PortController extends Container {
    private readonly _sceneSize: Size;
    private _port!: Port;
    private _enterPortEmptyShipsQueue: Ship[] = [];
    private _enterPortFullShipsQueue: Ship[] = [];
    private _exitPortShipsQueue: { ship: Ship, pier: Pier }[] = [];
    private _tween: Group;

    constructor(sceneSize: Size) {
        super();
        this._sceneSize = sceneSize;
        this._tween = new Group();
        this.initScene(sceneSize);
    }

    public update() {
        this.processShipQueue();
        this._tween.update();
    }

    private processShipQueue() {
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
                        break;
                    }
                }
            }

            if (this._exitPortShipsQueue.length) {
                const shipData = this._exitPortShipsQueue.shift()!;
                this.leavePort(shipData.ship, shipData.pier);
            }
        }
    }

    private reorderShipQueue(queue: Ship[]) {
        if (queue.length > 0) {
            const reorderTween: Tween[] = [];
            for (let i = 0; i < queue.length; i++) {
                const currentShip = queue[i]!;
                const newPosition = i === 0 ? this._sceneSize.width / 2 : queue[i - 1]!.getQueuePosition() + 50;
                currentShip.setQueuePosition(newPosition);
                const tween = new Tween(currentShip.position).to({x: newPosition}, 1000).start()
                reorderTween.push(tween);
            }
            this._tween.add(...reorderTween);
        }
    }

    private updateShipQueue(ship: Ship) {
        const positionX = this.getQueuePosition(ship);
        const toPark = new Tween(ship.position)
            .to({x: positionX}, 1000).start();
        this._tween.add(toPark);
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
        const type = Math.random() > 0.5 ? ShipType.FULL : ShipType.EMPTY;
        const ship = new Ship(this._sceneSize, type);
        this.addChild(ship);
        this.processNewShip(ship);
    }

    private isQueueEmpty(ship: Ship): boolean {
        const queue = this.getQueueByShipType(ship);
        if (queue.length) {
            return !queue.find((queueShip) => queueShip.getType() === ship.getType());
        }
        return true;
    }

    private getQueueByShipType(ship: Ship): Ship[] {
        return ship.getType() === ShipType.FULL ? this._enterPortFullShipsQueue : this._enterPortEmptyShipsQueue;
    }

    private processNewShip(ship: Ship): void {
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
        const toPark = new Tween(ship.position)
            .to({x: positionX}, 2000).onComplete(() => {
                this.updateShipQueue(ship);
                queue.push(ship);
            }).start();
        this._tween.add(toPark);
    }

    private processShip(ship: Ship, pier: Pier): void {
        this._port.lockEntrance();
        this._port.lockPier(pier);
        const portEntrancePosition = this._port.getEntrancePosition();
        const pierPoint = pier.getPierPoint();
        const toPierTween = new Tween(ship.position)
            .to({x: pierPoint.x, y: pierPoint.y}, 3000)
            .onComplete(() => {
                this.processCargo(ship, pier);
            });
        const toEntranceTween = new Tween(ship.position)
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

    private getQueuePosition(currentShip: Ship): number {
        const queue = this.getQueueByShipType(currentShip);
        if (queue.length > 0) {
            return queue[queue.length - 1]!.getQueuePosition() + 50;
        }
        return this._sceneSize.width / 2;
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
                .to({x: this._sceneSize.width}, 3000)
                .onComplete(() => ship.destroy());
            const toEntranceTween = new Tween(ship.position)
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