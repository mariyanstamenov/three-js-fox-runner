import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export class RockComponent {
    constructor(params) {
        this.params = params;
        this.position = new THREE.Vector3();
        this.scale = 0.01;
        this.rock = null;
        this.speed = 10;

        this.LoadModel();
    }

    LoadModel() {
        const loader = new FBXLoader();
        loader.setPath('./fbx/');
        loader.load('Rock' + (Math.floor(Math.random() * 2) + 1) + '.fbx', (fbx) => {
            this.rock = fbx;
            this.params.scene.add(this.rock);

            this.position.x = this.params.x;
            this.position.y = this.params.y;
            this.position.z = this.params.z;
            this.scale = this.params.scale;

            this.rock.traverse(element => {
                if (element.geometry) {
                    element.geometry.computeBoundingBox();
                }

                let materials = element.material;
                if (!(element.material instanceof Array)) {
                    materials = [element.material];
                }

                for (let material of materials) {
                    if (material) {
                        material.specular = new THREE.Color(0xFFFFFF);
                    }
                }
                element.castShadow = true;
                element.receiveShadow = true;
            });
        });
    }

    UpdateSpeed(speed) {
        this.speed += speed;
    }

    Update(timeElapsed) {
        if (!this.rock) {
            return;
        }

        this.position.x -= timeElapsed * this.speed;
        if (this.position.x < -20) {
            this.position.x = 220;
        }

        this.rock.position.copy(this.position);
        this.rock.scale.setScalar(this.scale);
    }
};