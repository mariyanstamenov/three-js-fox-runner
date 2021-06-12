import { PlayerComponent, GroundComponent } from './Components/index';
import { ObstacleManager, CloudManager, AdditionalObjectManager, ExplosionManager } from './ManagerComponents/index';
import { AIM_LOADED_COMPONENTS, SPEED_FACTOR, SPEED_INTERVAL } from './Config/consts';
import { SkyVS, SkyFS } from './Config/shaders';

class Game {

    constructor() {
        this.loadedComponents = 0;
        this.isStarted = false;
        this.isPause = false;
        this.previousLoadedComponents = 0;
        this.Initialize();
        this.aimLoadedComponents = AIM_LOADED_COMPONENTS;

        document.addEventListener('keyup', (e) => this.OnKeyUp(e), false);
    }

    OnKeyUp(event) {
        switch (event.keyCode) {
            case 13: // Enter
                if (this.loadedComponents == this.aimLoadedComponents && !document.getElementById('welcome').classList.contains("hide")) {
                    this.isStarted = true;
                    document.getElementById('score-box').classList.remove("hide");
                    document.getElementById('welcome').classList.add("hide");
                    document.getElementById('loader').classList.add("hide");
                    this.IntervalHandler();
                }
                if (this.gameOver) {
                    this.ResetGame();
                    clearInterval(this.interval);
                }
                break;
            case 80: // pause : p
                if (this.isStarted) {
                    this.isPause = !this.isPause;
                    if (this.isPause) {
                        document.getElementById('pause-label').classList.remove("hide");
                        clearInterval(this.interval);
                    } else {
                        document.getElementById('pause-label').classList.add("hide");
                        this.IntervalHandler();
                    }
                }
                break;
        }
    }

    IntervalHandler() {
        this.interval = setInterval(() => {
            if (this.isStarted) {
                this._obstacles.UpdateSpeed(SPEED_FACTOR);
                this._obstaclesLeft.UpdateSpeed(SPEED_FACTOR);
                this._obstaclesRight.UpdateSpeed(SPEED_FACTOR);
                this._anotherObjects.UpdateSpeed(SPEED_FACTOR);
            }
        }, SPEED_INTERVAL);
    }

    ResetGame() {
        this.loadedComponents = 0;
        this.previousLoadedComponents = 0;
        this.isStarted = false;
        this.isPause = false;
        this.gameOver = false;
        document.getElementById("loader-status").style.width = "0px";
        document.getElementsByTagName("canvas")[0].remove();
        document.getElementById('loader').classList.remove("hide");
        document.getElementById('gameover').classList.add("hide");
        document.getElementById('score-box').classList.add("hide");
        document.getElementById('gameover').classList.remove("active");
        this.Initialize();
    }

    LoadingHandler() {
        this.loadedComponents += 1;
    }

    Initialize() {
        this.threejs = new THREE.WebGLRenderer({
            antialias: true,
        });

        this.threejs.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x253655);
        this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

        this.camera = new THREE.PerspectiveCamera(60, 1920 / 1080, 1.0, 10000.0);
        this.camera.position.set(-30, 7, 5);
        this.camera.lookAt(0, 3, 0);

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-10, 50, -50);
        light.target.position.set(40, 0, 0);
        light.castShadow = true;
        this.scene.add(light);

        light = new THREE.HemisphereLight(0x202020, 0x004080, 0.6);
        this.scene.add(light);
        this._ground = new GroundComponent({ scene: this.scene });

        document.body.appendChild(this.threejs.domElement);

        const skyGeometry = new THREE.SphereBufferGeometry(3000, 32, 15);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0xfcfcfc) },
                bottomColor: { value: new THREE.Color(0x5e80be) },
                exponent: { value: 0.7 }
            },
            vertexShader: SkyVS,
            fragmentShader: SkyFS,
            side: THREE.BackSide // for the shaders
        });
        this.scene.add(new THREE.Mesh(skyGeometry, skyMaterial));

        this._obstaclesLeft = new ObstacleManager({ scene: this.scene, zPosition: -1.5, isStarted: this.isStarted });
        this._obstacles = new ObstacleManager({ scene: this.scene, zPosition: 0 });
        this._obstaclesRight = new ObstacleManager({ scene: this.scene, zPosition: 1.5 });
        this._clouds = new CloudManager({ scene: this.scene, loadComponent: () => { this.loadedComponents += 1; } });
        this._anotherObjects = new AdditionalObjectManager({ scene: this.scene, loadComponent: () => { this.loadedComponents += 1; } });
        this._player = new PlayerComponent({
            scene: this.scene,
            world: [this._obstacles, this._obstaclesLeft, this._obstaclesRight],
            isStarted: this.isStarted,
            loadComponent: () => { this.loadedComponents += 1; }
        });
        this._explosion = new ExplosionManager({ scene: this.scene, player: this._player, loadComponent: () => { this.loadedComponents += 1; } });

        this.gameOver = false;
        this.previousRender = null;
        this.Draw();
        this.OnWindowResize();
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.threejs.setSize(window.innerWidth, window.innerHeight);
    }

    Draw() {
        requestAnimationFrame((t) => {
            if (this.previousRender === null) {
                this.previousRender = t;
            }

            /** Loading */
            if (this.previousLoadedComponents != this.loadedComponents) {
                document.getElementById("loader-status").style.width = ((this.loadedComponents / this.aimLoadedComponents) * 100) + "%";
                this.previousLoadedComponents = this.loadedComponents;


                if (this.loadedComponents == this.aimLoadedComponents) {
                    setTimeout(() => {
                        document.getElementById("loader").classList.add("hide");
                        document.getElementById('welcome').classList.remove("hide");
                    }, 1000);
                }
            }

            /** Camera moves when we start the game */
            if (this.isStarted) {
                let isMoving = false;
                if (this.camera.position.x < -10) {
                    this.camera.position.x += 0.2;
                    isMoving = true;
                }
                if (this.camera.position.y > 5) {
                    this.camera.position.y -= 0.1;
                    isMoving = true;
                }
                if (this.camera.position.z > 0) {
                    this.camera.position.z -= 0.05;
                    isMoving = true;
                }

                if (isMoving) {
                    this.camera.lookAt(0, 3, 0);
                }
            }

            this.Draw();
            this.threejs.render(this.scene, this.camera);

            this.Step((t - this.previousRender) / 1000.0);
            this.previousRender = t;

        });
    }

    Step(timeElapsed) {
        if (!this.isStarted || this.isPause) {
            return;
        }
        if (this.gameOver) {
            this._explosion.Update(timeElapsed);
            if (this._player.player.visible) {
                this._player.player.visible = false;
            }
            return null;
        } else {
            this._player.Update(timeElapsed);
            this._obstacles.Update(timeElapsed);
            this._obstaclesLeft.Update(timeElapsed);
            this._obstaclesRight.Update(timeElapsed);
            this._anotherObjects.Update(timeElapsed);
            this._clouds.Update(timeElapsed);

            if (this._player.gameOver && !this.gameOver) {
                this.gameOver = true;
                document.getElementById('gameover').classList.toggle('active');
                document.getElementById('gameover-score').innerHTML = "Your Score: " + Math.round(this._player.score);
            }
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const world = new Game();
});