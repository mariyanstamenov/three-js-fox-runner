import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export class PlayerComponent {
    constructor(params) {
        this.score = 0.0;

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = 0.0;

        this.playerBox = new THREE.Box3();
        this.params = params;

        this.LoadCharacter();
        this.InitInput();

        this.aimSideMovement = 0.0;
    }

    LoadCharacter() {
        const loader = new FBXLoader();
        loader.setPath('./fbx/');
        loader.load('Character.fbx', (fbx) => {
            fbx.scale.setScalar(0.015);
            fbx.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); // rotation

            fbx.traverse(c => {
                let materials = c.material;
                if (!(c.material instanceof Array)) {
                    materials = [c.material];
                }

                for (let m of materials) {
                    if (m) {
                        m.specular = new THREE.Color(0x000000);
                        m.color.offsetHSL(0, 0, 0.25);
                    }
                }
                c.castShadow = true;
                c.receiveShadow = true;
            });

            const animation = new FBXLoader();
            animation.setPath('./fbx/');
            animation.load('Running.fbx', (run) => {
                const runningAnimation = new THREE.AnimationMixer(fbx);
                fbx.animations.push(runningAnimation);
                const idle = fbx.animations[0].clipAction(run.animations[0]);
                idle.play();
            });
            this.params.loadComponent();

            this.player = fbx;
            this.params.scene.add(fbx);
        });
    }

    InitInput() {
        this.keys = {
            spacebar: false,
            left: false,
            right: false
        };
        this.oldKeys = { ...this.keys };

        document.addEventListener('keydown', (e) => this.OnKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.OnKeyUp(e), false);
    }

    OnKeyDown(event) {
        switch (event.keyCode) {
            case 32:
                if(!this.keys.space) this.keys.space = true;
                break;
            case 37: // left
                if (this.position.z > -1.5 && !this.keys.left && !this.keys.right) {
                    this.keys.left = true;
                    this.aimSideMovement = this.position.z - 1.5;
                }
                break;
            case 39: // right
                if (this.position.z < 1.5 && !this.keys.left && !this.keys.right) {
                    this.keys.right = true;
                    this.aimSideMovement = this.position.z + 1.5;
                }
                break;
        }
    }

    OnKeyUp(event) {
        switch (event.keyCode) {
            case 32:
                this.keys.space = false;
                break;
        }
    }

    CheckCollisions() {
        for (let w of this.params.world) {
            const colliders = w.GetColliders();

            const colliderCoins = w.GetCoinColliders();

            this.playerBox.setFromObject(this.player);

            for (let collider of colliders) {
                const cur = collider.collider;

                if (cur.intersectsBox(this.playerBox)) {
                    this.gameOver = true;
                }
            }

            for(let colliderCoin of colliderCoins) {
                const cur = colliderCoin.colliderCoin;
                

                if (cur.intersectsBox(this.playerBox) && colliderCoin.coin.visible) {
                    colliderCoin.coin.visible = false;
                    this.score += 3;
                }
            }
        }
    }

    Update(timeElapsed) {
        if (this.keys.space && this.position.y == 0.0) {
            this.velocity = 30;
        }

        if (this.keys.left) {
            if (this.position.z != this.aimSideMovement) {
                this.position.z = Number(this.position.z.toFixed(2)) - Number((0.3).toFixed(2));
            } else {
                this.keys.left = false;
            }
        }

        if (this.keys.right) {
            if (this.position.z != this.aimSideMovement) {
                this.position.z = Number(this.position.z.toFixed(2)) + Number((0.3).toFixed(2));
            } else {
                this.keys.right = false;
            }
        }

        const acceleration = -100 * timeElapsed;

        this.position.y += timeElapsed * (this.velocity + acceleration * 0.7);
        this.position.y = Math.max(this.position.y, 0.0);

        this.velocity += acceleration;
        this.velocity = Math.max(this.velocity, -70);

        if (this.player) {
            if (this.player.animations && this.player.animations[0]) {
                this.player.animations[0].update(timeElapsed);
            }
            this.player.position.copy(this.position);
            this.CheckCollisions();
        }

        this.UpdateScore(timeElapsed);
    }

    UpdateScore(timeElapsed) {
        this.score += timeElapsed * 3.0;

        const scoreText = Math.round(this.score);

        if (scoreText == this.scoreText) {
            return;
        }

        document.getElementById('score').innerText = scoreText;
    }
};