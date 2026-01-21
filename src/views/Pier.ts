import {Container, Graphics} from "pixi.js";

export enum PierState {
    AVAILABLE,
    IN_PROGRESS,
}

export enum PierType {
    FULL,
    EMPTY
}

export class Pier extends Container {
    private _state = PierState.AVAILABLE;
    private _type = PierType.FULL;
    private _pierPoint: { x: 0, y: 0 } | undefined;

    constructor(private readonly _width: number, private readonly _height: number) {
        super();
        this.initialize();
    }

    public getPierState(): PierState {
        return this._state;
    }

    public setPierState(pierState: PierState) {
        this._state = pierState;
    }

    public getPierType(): PierType {
        return this._type;
    }

    public getPierPoint(): { x: number, y: number } {
        return this._pierPoint ? this._pierPoint : {x: this._width, y: this._height / 2 + this.position.y};
    }

    public changePierType() {
        this._type = this._type === PierType.FULL ? PierType.EMPTY : PierType.FULL;
    }

    public process(): void {
        const pier = this.children[0] as Graphics;
        pier.clear();
        pier.rect(0, 0, this._width, this._height).fill({color: this._type === PierType.FULL ? '#1099bb' : '#ffc800'}).stroke({
            width: 5,
            color: '#ffc800'
        });
    }

    private initialize(): void {
        const graphic = new Graphics();
        const rect = graphic.rect(0, 0, this._width, this._height).fill({color: '#ffc800', alpha: 1}).stroke({
            width: 5,
            color: '#ffc800'
        });
        this.addChild(rect);
    }
}