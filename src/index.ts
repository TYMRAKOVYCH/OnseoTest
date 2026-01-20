import {Application, Assets, Container, Graphics, Sprite} from 'pixi.js';
import {GameContainer} from "./core/GameContainer";

(async () => {
    const app = new Application();

    const sceneSize = { width: 1000, height: 500 };

    await app.init({background: '#1099bb', width: sceneSize.width, height: sceneSize.height, antialias: true});

    document.body.appendChild(app.canvas);

    const gameContainer = new GameContainer(sceneSize);

    app.stage.addChild(gameContainer);

    app.ticker.add((time) => {
        gameContainer.update(time);
    });
})();