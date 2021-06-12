import { ParticleComponent } from '../Components/index';

export class ExplosionManager {
    constructor(params) {
        this.params = params;
        this.boxes = [];
        this.isVisible = false;

        this.InitExplosion();
    }

    InitExplosion() {
        for (let i = 0; i < 100; i++) {
            this.boxes.push(
                new ParticleComponent({
                    ...this.params,
                    x: (Math.floor(Math.random() * 9) + 1) / 100.0,
                    y: (Math.floor(Math.random() * 9) + 1) / 100.0,
                    z: (Math.floor(Math.random() * 9) + 1) / 100.0,
                    scale: 10
                })
            );
        }
        this.params.loadComponent();
    }

    Update(timeElapsed) {
        if (!this.isVisible) {
            for (let i = 0; i < this.boxes.length; i++) {
                this.boxes[i].box.visible = true;
            }

            this.isVisible = true;
        }

        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].Update(timeElapsed);
        }
    }
};