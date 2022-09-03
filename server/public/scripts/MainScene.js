export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');

    let allies;
    let enemies;
    let coordinateGrid;
    let selectedUnit;
    let movementGrid = [];
  }

  preload() {
    //Preload images / tilemaps
    this.load.image('tiles', 'assets/Isometric-tiles.png');
    this.load.tilemapTiledJSON('tilemap16', 'assets/tilemap16.json');
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("movement-tile", "assets/movement-tile.png");
    this.load.image("character", "assets/cursor.png");
    this.load.spritesheet("dragon_knight_downright_idle", "assets/dragon-knight/dragon-knight-downright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_downleft_idle", "assets/dragon-knight/dragon-knight-downleft-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upright_idle", "assets/dragon-knight/dragon-knight-upright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upleft_idle", "assets/dragon-knight/dragon-knight-upleft-idle.png", {frameWidth: 32,frameHeight: 32});
  }

  create() {
    const map = this.make.tilemap({ key: 'tilemap16' });
    const tileset = map.addTilesetImage('punyTiles', 'tiles', 32, 32, 0, 0);

    map.createLayer('Tile Layer 1', tileset, 362, 79); //640, 360

    const createTileArray = (x, y, size) => {
      const output = []

      for (let i = 0; i < size; i++) {
        output.push([]);
      }


      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          output[i].push({x: (x + 16 + (i * 16)) + (j * -16),y: (y + (i * 8)) + (j * 8)});
        }
      }

      return output;
    }

    this.coordinateGrid = createTileArray(362, 79, 16)

    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    this.player = this.add.sprite(this.coordinateGrid[1][0].x, this.coordinateGrid[1][0].y, "cursor");
    const thing = this.physics.add.sprite(100, 100, 'cursor');
    this.dragon_knight = this.physics.add.sprite(this.coordinateGrid[2][1].x, this.coordinateGrid[2][1].y, "dragon_knight_downright_idle");
    this.dragon_knight2 = this.physics.add.sprite(this.coordinateGrid[11][3].x, this.coordinateGrid[11][3].y, "dragon_knight_downleft_idle");
    this.dragon_knight.setData({
      direction: 'left',
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      hasMoved: false,
      hasMovementTiles: false,
      coordX: 2,
      coordY: 1
    });
    this.dragon_knight2.setData({
      direction: 'left',
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      hasMoved: false,
      hasMovementTiles: false,
      coordX: 11,
      coordY: 3
    });
    console.log(this.dragon_knight);

    // this.allies = {
    //   dragon_knight,
    //   dragon_knight2
    // };

    this.anims.create({
      key: "dragon_knight_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_idle"),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: "dragon_knight_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_idle"),
      frameRate: 4,
      repeat: -1
    });

    this.dragon_knight.play("dragon_knight_anim1");
    this.dragon_knight2.play("dragon_knight_anim1");

    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q
    });

    //this.physics.world.step(1);
  }

  update() {
    var closest = this.physics.closest(this.player, Phaser.GameObject);
    console.log(this.selectedUnit);
    this.movementGrid = [];

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.up)) {
      this.player.x -= 16;
      this.player.y -= 8;
    };
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.left)) {
      this.player.x -= 16;
      this.player.y += 8;
    };
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.down)) {
      this.player.x += 16;
      this.player.y += 8;
    };
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.right)) {
      this.player.x += 16;
      this.player.y -= 8;
    };

    // console.log("x: ", this.player.x, closest.x);
    // console.log("y: ", this.player.y, closest.y);

    if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16) {

      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
        // closest.x += 16;
        // closest.y += 8;
        // closest.gameObject.setData({direction: 'right'});
        //closest.gameObject.setData({selected: true})
        this.selectedUnit = closest;
      }
  
      // if (closest.gameObject.getData('selected')) {
      //   closest.gameObject.setdata({direction: ''})
      // }
    }

    if (this.selectedUnit) {
      //check if unit has moved this turn
      if (!this.selectedUnit.gameObject.getData("hasMoved")) {
        //check if unit has movement tiles rendered around them
        if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
          for (let i = 0; i < 25; i++) {
            const relationsX = [3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -2, -2, -2, -3]
            const relationsY = [0, 1, 0, -1, 2, 1, 0, -1, -2, 3, 2, 1, 0, -1, -2, -3, 2, 1, 0, -1, -2, 1, 0, -1, 0]
          
            //Check out of bounds
            if (this.selectedUnit.gameObject.getData('coordX') + relationsX[i] < 0 
            || this.selectedUnit.gameObject.getData('coordX') + relationsX[i] > 15
            || this.selectedUnit.gameObject.getData('coordY') + relationsY[i] < 0 
            || this.selectedUnit.gameObject.getData('coordY') + relationsY[i] > 15) {

            } else {
              this.movementGrid.push(this.add.sprite(
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + relationsX[i]][this.selectedUnit.gameObject.getData('coordY') + relationsY[i]].x,
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + relationsX[i]][this.selectedUnit.gameObject.getData('coordY') + relationsY[i]].y + 16,
                'movement-tile'))
            }
          }
          this.selectedUnit.gameObject.setData({hasMovementTiles: true})
        }
      }
    }

    // if (this.inputKeys.up.JustDown) {
    //   this.player.y -= 16;
    // }
    // if (this.inputKeys.left.isDown) {
    //   this.player.x -= 32;
    // }
    // if (this.inputKeys.down.isDown) {
    //   this.player.y += 16;
    // }
    // if (this.inputKeys.right.isDown) {
    //   this.player.x += 32;
    // }
  }
}