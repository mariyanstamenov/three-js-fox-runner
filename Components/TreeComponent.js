import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export class TreeComponent {
    constructor(params) {
        this.params = params;
        this.position = new THREE.Vector3();
        this.scale = 0.01;
        this.tree = null;
        this.speed = 10;

        this.LoadModel();
    }

    LoadModel() {
        const loader = new FBXLoader();
        loader.setPath('./fbx/');
        loader.load('Tree' + (Math.floor(Math.random() * 2) + 1) + '.fbx', (fbx) => {
            this.tree = fbx;
            this.params.scene.add(this.tree);

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
        if (!this.tree) {
            return;
        }

        this.position.x -= timeElapsed * this.speed;
        if (this.position.x < -20) {
            this.position.x = 220;
        }

        this.tree.position.copy(this.position);
        this.tree.scale.setScalar(this.scale);
    }
};