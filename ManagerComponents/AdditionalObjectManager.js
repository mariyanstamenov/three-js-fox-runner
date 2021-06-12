import { BushComponent, RockComponent, TreeComponent } from "../Components/index";
 
export class AdditionalObjectManager {
    constructor(params) {
        this.objects = [];
        this.treeScales = [0.01, 0.02, 0.03];
        this.rockScales = [0.1, 0.12, 0.15];
        this.bushScales = [0.1, 0.08, 0.09]

        this.params = params;
        this.InitSpawn();
    }

    UpdateSpeed(speed) {
        for(let obj of this.objects) {
            obj.UpdateSpeed(speed);
        }
    }

    InitSpawn() {
        for (let i = 0; i < 100; i++) {
            let _x = Math.floor(Math.random() * 200) + 20;
            let _y = -0.2;
            let _z = i % 2 == 0 ? (Math.floor(Math.random() * 20) - 25) : (Math.floor(Math.random() * 20) + 5);
            const tree = new TreeComponent({
                ...this.params,
                x: _x,
                y: _y,
                z: _z,
                scale: this.treeScales[Math.floor(Math.random() * 3)]
            });

            this.objects.push(tree);
        }
        this.params.loadComponent();

        for (let i = 0; i < 100; i++) {
            let _x = Math.floor(Math.random() * 200) + 20;
            let _y = -0.2;
            let _z = i % 2 == 0 ? (Math.floor(Math.random() * 20) - 25) : (Math.floor(Math.random() * 20) + 5);
            const bush = new BushComponent({
                ...this.params,
                x: _x,
                y: _y,
                z: _z,
                scale: this.bushScales[Math.floor(Math.random() * 3)]
            });

            this.objects.push(bush);
        }
        this.params.loadComponent();

        for (let i = 0; i < 70; i++) {
            let _x = Math.floor(Math.random() * 200) + 20;
            let _y = -0.2;
            let _z = i % 2 == 0 ? (Math.floor(Math.random() * 20) - 75) : (Math.floor(Math.random() * 20) + 55);
            const rock = new RockComponent({
                ...this.params,
                x: i * 10,
                y: _y,
                z: _z,
                scale: this.rockScales[Math.floor(Math.random() * 3)]
            });

            this.objects.push(rock);
        }
        this.params.loadComponent();
    }

    Update(timeElapsed) {
        for (let obj of this.objects) {
            obj.Update(timeElapsed);
        }
    }
};