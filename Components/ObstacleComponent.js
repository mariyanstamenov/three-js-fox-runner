export class ObstacleComponent {
    constructor(params) {
        const texture = new THREE.TextureLoader().load('./textures/crate.gif');
        this.size = [{
            height: 0.8,
            y: 0.4
        },{
            height: 1.2,
            y: 0.6
        }, {
            height: 1.6,
            y: 0.8
        }];
        texture.encoding = THREE.sRGBEncoding;
        const obstacleGeometry = new THREE.BoxBufferGeometry(1, this.size[params.obstacleType].height, 1);
        const obstacleMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });
        this.obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

        params.scene.add(this.obstacle);
        this.position = new THREE.Vector3();
        this.position.y = this.size[params.obstacleType].y;
        this.collider = new THREE.Box3();

        this.obstacle.traverse(element => {
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
        });
    }

    UpdateCollider() {
        this.collider.setFromObject(this.obstacle);
    }

    Update(timeElapsed) {
        this.obstacle.position.copy(this.position);
        this.UpdateCollider();
    }
};