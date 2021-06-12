export class GroundComponent {
    constructor(params) {
        const texLoader = new THREE.TextureLoader();
        const groundTexture = texLoader.load('./textures/Ground.png');
        const groundGeometry = new THREE.PlaneGeometry(3000, 3000);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xf6f47f, map: groundTexture });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.2;

        params.scene.add(this.ground);
        this.params = params;
    }
};