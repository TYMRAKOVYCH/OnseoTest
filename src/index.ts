import {Application} from 'pixi.js';
import {PortController} from "./core/PortController";

(async () => {
    const app = new Application();

    const sceneSize = {width: 800, height: 500};

    await app.init({background: '#1099bb', width: sceneSize.width, height: sceneSize.height, antialias: true});

    document.body.appendChild(app.canvas);

    const gameController = new PortController(sceneSize);

    app.stage.addChild(gameController);

    app.ticker.add(() => {
        gameController.update();
    });
})();