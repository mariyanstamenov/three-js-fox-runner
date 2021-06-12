import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export class BushComponent {
    constructor(params) {
        this.params = params;
        this.position = new THREE.Vector3();
        this.bush = null;
        this.speed = 10;

        this.LoadModel();
    }

    LoadModel() {
        const loader = new FBXLoader();
        loader.setPath('./fbx/');
        loader.load('Grass' + (Math.floor(Math.random() * 2) + 1) + '.fbx', (fbx) => {
            this.bush = fbx;
            this.params.scene.add(this.bush);

            this.position.x = this.params.x;
            this.position.y = this.params.y;
            this.position.z = this.params.z;
            this.scale = this.params.scale;

        });
    }

    UpdateSpeed(speed) {
        this.speed += speed;
    }

    Update(timeElapsed) {
        if (!this.bush) {
            return;
        }

        this.position.x -= timeElapsed * this.speed;
        if (this.position.x < -20) {
            this.position.x = 220;
        }

        this.bush.position.copy(this.position);
        this.bush.scale.setScalar(this.params.scale);
    }
};