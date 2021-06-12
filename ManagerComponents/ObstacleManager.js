import { DISTANCE, START_POSITION, MIN_DISTANCE, MAX_DISTANCE } from '../Config/consts';
import { LaneComponent, CoinComponent, ObstacleComponent } from '../Components/index';

export class ObstacleManager {
    constructor(params) {
        this.obstacles = [];
        this.coins = [];
        this.unused = [];
        this.unusedCoin = [];
        this.speed = 10;
        this.params = params;

        this.myDistance = Math.floor(Math.random() * MAX_DISTANCE) + MIN_DISTANCE;
        this.coinDistance = 2;

        this.InitPath();
    }

    UpdateSpeed(speed) {
        this.speed += speed;
    }

    InitPath() {
        new LaneComponent({ ...this.params, laneZPostion: 0, x: 1000, y: 0, z: 1.6, textureName: "asphalt-bright", positionY: -0.1 });
        new LaneComponent({ ...this.params, laneZPostion: -1.75, x: 1000, y: 0, z: 1.6, textureName: "asphalt-bright", positionY: -0.1 });
        new LaneComponent({ ...this.params, laneZPostion: 1.75, x: 1000, y: 0, z: 1.6, textureName: "asphalt-bright", positionY: -0.1 });
        new LaneComponent({ ...this.params, laneZPostion: 0, x: 1000, y: 0, z: 5.4, positionY: -0.11, isWhite: true });
        new LaneComponent({ ...this.params, laneZPostion: 0, x: 1000, y: 0, z: 5.8, textureName: "asphalt-dark", positionY: -0.12 });
    }

    SpawnObstacles() { // may be spawn
        const obj = this.LastObjectPosition();
        if (Math.abs(START_POSITION - obj) > this.myDistance) {
            this.myDistance = Math.floor(Math.random() * MAX_DISTANCE) + MIN_DISTANCE;
            this.SpawnObstacle();
        }

        if (Math.abs(START_POSITION - obj) > 4
            && Math.abs(START_POSITION - obj) < (this.myDistance - 4)
            && Math.floor(Math.random() * 130) == 4) {
            this.SpawnCoin();
        }
    }

    GetColliders() {
        return this.obstacles;
    }

    GetCoinColliders() {
        return this.coins;
    }

    SpawnObstacle() {
        let obstacle = null;
        if (this.unused.length > 0) {
            obstacle = this.unused.pop();
            obstacle.obstacle.visible = true;
        } else {
            obstacle = new ObstacleComponent({ ...this.params, obstacleType: Math.floor(Math.random() * 3) });
        }

        obstacle.position.x = START_POSITION;
        obstacle.position.z = this.params.zPosition;
        this.obstacles.push(obstacle);
    }

    SpawnCoin() {
        let coin = null;
        if (this.unusedCoin.length > 0) {
            coin = this.unusedCoin.pop();
            coin.coin.visible = true;
        } else {
            coin = new CoinComponent({ ...this.params });
        }

        coin.position.x = START_POSITION;
        coin.position.z = this.params.zPosition;
        this.coins.push(coin);
    }

    LastObjectPosition() {
        if (this.obstacles.length == 0) {
            return DISTANCE;
        }
        return this.obstacles[this.obstacles.length - 1].position.x;
    }

    LastCoinPosition() {
        if (this.coins.length == 0) {
            return 3;
        }
        return this.coins[this.coins.length - 1].position.x;
    }

    Update(timeElapsed) {
        this.SpawnObstacles();

        const visible = [];
        const invisible = [];

        for (let obstacle of this.obstacles) {
            obstacle.position.x -= timeElapsed * this.speed;

            if (obstacle.position.x <= -20) {
                invisible.push(obstacle);
                obstacle.obstacle.visible = false;
            } else {
                visible.push(obstacle);
            }

            obstacle.Update(timeElapsed);
        }

        const visibleCoins = [];
        const invisibleCoins = [];

        for (let coin of this.coins) {
            coin.position.x -= timeElapsed * this.speed;

            if (coin.position.x <= -20) {
                invisibleCoins.push(coin);
                coin.coin.visible = false;
            } else {
                visibleCoins.push(coin);
            }
            coin.Update(timeElapsed);
        }

        this.obstacles = visible;
        this.unused.push(...invisible);

        this.coins = visibleCoins;
        this.unusedCoin.push(...invisibleCoins);
    }
};