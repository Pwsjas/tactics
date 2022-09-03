export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  // Preload assets into the game engine.
  preload() {
    // Preload the tiles for the map, and the layout of the map itself in a JSON object.
    this.load.image('tiles', 'assets/Isometric-tiles.png');
    this.load.tilemapTiledJSON('tilemap16', 'assets/tilemap16.json');

    // Preload the cursor asset and assign it as a controllable character. 
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("character", "assets/cursor.png");

    // Asset for the UI

    // Preload the spritesheets and animations for the dragon_knight character
    this.load.spritesheet("dragon_knight_downright_idle", "assets/dragon-knight/dragon-knight-downright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_downleft_idle", "assets/dragon-knight/dragon-knight-downleft-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upright_idle", "assets/dragon-knight/dragon-knight-upright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upleft_idle", "assets/dragon-knight/dragon-knight-upleft-idle.png", {frameWidth: 32,frameHeight: 32});
  }

  // Create objects in the game engine based on assets.
  create() {
    // Create the tile map based on assets.
      // This is very complicated so I will explain here
        // 
    const map = this.make.tilemap({ key: 'tilemap16' });
    const tileset = map.addTilesetImage('punyTiles', 'tiles', 32, 32, 0, 0);

    map.createLayer('Tile Layer 1', tileset, 320, 130); // 640, 360
    
    // Function that determines position of the tile map on the screen, and renders the cursor over it.
      // Accepts the x and y coords of the map, as well as the size of the map in tiles. (Only works for square maps, has to be the same number of tiles on both sides.)      
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

    const test = createTileArray(320, 130, 16)

    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);

    // Assign cursor position based on createTileLayer function.
    this.player = this.add.sprite(test[0][0].x, test[0][0].y, "cursor");
    // const thing = this.physics.add.sprite(100, 100, 'cursor');
    this.dragon_knight = this.physics.add.sprite(test[2][12].x, test[2][12].y, "dragon_knight_downright_idle");
    this.dragon_knight2 = this.physics.add.sprite(test[11][2].x, test[11][2].y, "dragon_knight_downleft_idle");

    // Add HUD for holding the UI

    // Create text for the character UI
    this.ui = this.add.text(100, 100, '');

    // Assign manipulatable data to the dragon_knight game object.
    this.dragon_knight.setData({
      direction: 'left',
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
    });

    this.dragon_knight2.setData({
      direction: 'left',
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
    });

    // Create animations for the sprites based on the spritesheet.
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

    // Play those animations.
    this.dragon_knight.play("dragon_knight_anim1");
    this.dragon_knight2.play("dragon_knight_anim1");

    // Add keyboard input.
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      h: Phaser.Input.Keyboard.KeyCodes.H
    });

    this.physics.world.step(0);
  }

  update() {
    let closest = this.physics.closest(this.player, Phaser.GameObject);

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

    // Coordinates adjustment to target individual character sprites on the map.
    if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16) {

      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
        closest.gameObject.setData({ selected: true });
        if (closest.gameObject.getData('hit_points') <= 0) {
          this.ui.setText([
            "This guy is knocked out"
          ]);
        } else {
          this.ui.setText([
            "HP: " + closest.gameObject.getData('hit_points') + "/" + closest.gameObject.getData('total_hit_points'),
          ]);
        }
      }
      
      if (closest.gameObject.getData('selected')) {
        // console.log("Selected");
        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.h)) {
          closest.gameObject.setData({hit_points: closest.gameObject.getData('hit_points') - 50});
          this.ui.setText([
            `HP: ${closest.gameObject.getData('hit_points')}/${closest.gameObject.getData('total_hit_points')}`,
          ]);
          if (closest.gameObject.getData('hit_points') === 0) {
            // console.log('She dead gurl')
            // Set their texture to dead
            this.ui.setText([
              "This guy is knocked out"
            ]);
            closest.gameObject.setActive(false);
          }
        }
      }
    }
  }
}