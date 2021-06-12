import { GLTFLoader } from '../libs/GLTFLoader';

export class CloudComponent {
    constructor(params) {
        this.params = params;
        this.position = new THREE.Vector3();
        this.scale = 1.0;
        this.cloud = null;

        this.LoadModel();
    }

    LoadModel() {
        const loader = new GLTFLoader();
        loader.setPath('./gltf/');
        loader.load('Cloud'+  (Math.floor(Math.random() * 2) + 1) + '.glb', (glb) => {
            this.cloud = glb.scene;
            this.params.scene.add(this.cloud);

            this.position.x = this.params.x;
            this.position.y = this.params.y;
            this.position.z = this.params.z;
            this.scale = this.params.scale;

            // traverse cloud and its children
            this.cloud.traverse(element => {
                if (element.geometry) {
                    element.geometry.computeBoundingBox();
                }

                let materials = [];
                if (!(element.material instanceof Array) && element.material) {
                    materials = [element.material];
                }

                for (let material of materials) {
                    material.emissive = new THREE.Color(0xFFFFFF);
                }
                element.castShadow = true;
                element.receiveShadow = true;
            });
        });
    }

    Update(timeElapsed) {
        if (!this.cloud) {
            return;
        }

        this.position.x -= timeElapsed * 30;
        if (this.position.x < -100) {
            this.position.x = this.params.x;
        }
        
        this.cloud.position.copy(this.position);
        this.cloud.scale.setScalar(this.scale);
    }
};