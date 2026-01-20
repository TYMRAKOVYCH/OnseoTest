import {Application, Assets, Container, Graphics, Sprite} from 'pixi.js';
import {GameController} from "./core/GameController";

(async () => {
    const app = new Application();

    const sceneSize = { width: 1000, height: 500 };

    await app.init({background: '#1099bb', width: sceneSize.width, height: sceneSize.height, antialias: true});

    document.body.appendChild(app.canvas);

    const gameController = new GameController(sceneSize);

    app.stage.addChild(gameController);

    app.ticker.add((time) => {
        gameController.update(time);
    });
})();