import { CloudComponent } from '../Components/index';

export class CloudManager {
    constructor(params) {
        this.clouds = [];

        this.params = params;
        this.InitSpawnClouds();
    }

    InitSpawnClouds() {
        for (let i = 0; i < 50; ++i) {
            const cloud = new CloudComponent({
                ...this.params,
                x: Math.floor(Math.random() * 2000) + 300,
                y: Math.floor(Math.random() * 120) + 200,
                z: i % 2 == 0 ? (Math.floor(Math.random() * 12) - (12 * i)) : (Math.floor(Math.random() * 12) + (12 * i)),
                scale: Math.floor(Math.random() * 30) + 25
            });

            this.clouds.push(cloud);
        }
        this.params.loadComponent();
    }

    ChangeCloudPosition(cloud) {
        cloud.position.x = 2300;
    }

    Update(timeElapsed) {
        for (let cloud of this.clouds) {
            if (cloud.position.x < -20) {
                this.ChangeCloudPosition(cloud);
            } else {
                cloud.Update(timeElapsed);
            }
        }
    }
};