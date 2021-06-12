export class ParticleComponent {
    constructor(params) {
        this.params = params;
        this.scale = 7;

        // Left || Right
        this.directionX = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
        this.directionY = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
        this.directionZ = Math.floor(Math.random() * 2) == 0 ? -1 : 1;

        // Where it ends
        this.aimX = Math.random() * 70;
        this.aimY = Math.random() * 70;
        this.aimZ = Math.random() * 70;

        const boxGeometry = new THREE.BoxBufferGeometry(
            params.x * this.scale,
            params.y * this.scale,
            params.z * this.scale
        );

        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x7a0109 });
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.position = new THREE.Vector3();
        this.position.copy(this.params.player.position);
        this.position.x = 1;
        this.box.position.copy(this.position);
        this.box.visible = false;
        this.params.scene.add(this.box);
        this.explosionPower = 10;
    }

    Update(timeElapsed) {
        if (this.scale >= 0.0) {
            if (this.position.x <= this.aimX && this.scale > 0.0) {
                this.position.x += ((this.aimX / this.explosionPower) / 20.0) * this.directionX;
            }
            if (this.position.y <= this.aimY && this.scale > 0.0) {
                this.position.y += ((this.aimY / this.explosionPower) / 20.0) * this.directionY;
            }
            if (this.position.z <= this.aimZ && this.scale > 0.0) {
                this.position.z += ((this.aimZ / this.explosionPower) / 20.0) * this.directionZ;
            }

            this.scale -= Math.random() / 3.0;
            this.box.scale.x = this.scale;
            this.box.scale.y = this.scale;
            this.box.scale.z = this.scale;

            this.explosionPower >= 1 ? (this.explosionPower -= Math.floor(Math.random() * 10) / 100.0) : 0;
            this.box.position.copy(this.position);
        } else {
            this.box.visible = false;
        }
    }
};