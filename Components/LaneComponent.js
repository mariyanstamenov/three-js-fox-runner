export class LaneComponent {
    constructor(params) {

        if (params.isWhite) {
            const obstacleGeometry = new THREE.BoxBufferGeometry(params.x, params.y, params.z);
            const obstacleMaterial = new THREE.MeshBasicMaterial({});
            this.lane = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        } else {
            const texLoader = new THREE.TextureLoader();
            const groundTexture = texLoader.load('./textures/' + params.textureName + '.jpg');
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set(25, 25);
            groundTexture.anisotropy = 16;
            groundTexture.encoding = THREE.sRGBEncoding;

            const obstacleGeometry = new THREE.BoxBufferGeometry(params.x, params.y, params.z);
            const obstacleMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
            this.lane = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        }
        this.lane.position.x = 220;
        this.lane.position.y = params.positionY;
        this.lane.position.z = params.laneZPostion;
        params.scene.add(this.lane);
    }
};