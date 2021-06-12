export class CoinComponent {
    constructor(params) {

        const coinGeometry = new THREE.CircleGeometry(0.5, 16);
        const coinMaterial = new THREE.MeshBasicMaterial({color: 0xceb01c});
        this.coin = new THREE.Mesh(coinGeometry, coinMaterial);
        this.colliderCoin = new THREE.Box3();

        this.coin.rotation.y = -Math.PI / 2;

        params.scene.add(this.coin);
        this.position = new THREE.Vector3();
        this.position.y = 0.5;

    }

    UpdateCollider() {
        this.colliderCoin.setFromObject(this.coin);
    }

    Update(timeElapsed) {
        this.coin.position.copy(this.position);
        this.UpdateCollider();
    }
};