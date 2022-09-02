export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');

    let allies;
    let enemies;
  }

  preload() {
    //Preload images / tilemaps
    this.load.image('tiles', 'assets/Isometric-tiles.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json')
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("character", "assets/cursor.png");
    this.load.spritesheet("dragon_knight_downright_idle", "assets/dragon-knight/dragon-knight-downright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_downleft_idle", "assets/dragon-knight/dragon-knight-downleft-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upright_idle", "assets/dragon-knight/dragon-knight-upright-idle.png", {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet("dragon_knight_upleft_idle", "assets/dragon-knight/dragon-knight-upleft-idle.png", {frameWidth: 32,frameHeight: 32});
  }

  create() {
    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('punyTiles', 'tiles', 32, 32, 0, 0)

    map.createLayer('Tile Layer 1', tileset, 640, 360)
    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    this.player = this.add.sprite(544, 432, "cursor");
    const thing = this.physics.add.sprite(100, 100, 'cursor');
    this.dragon_knight = this.physics.add.sprite(544, 416, "dragon_knight_downright_idle");
    this.dragon_knight2 = this.physics.add.sprite(560, 424, "dragon_knight_downleft_idle");
    this.dragon_knight.setData({direction: 'left'});
    console.log(this.dragon_knight);

    this.allies = {
      dragon_knight: {
       id: this.dragon_knight,
       direction: 'right',
       turn: true 
      },
      dragon_knight2: {
        id: this.dragon_knight2,
        direction: 'left',
        turn: true
      },
    }

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
    })

    //this.physics.world.step(1);
  }

  update() {
    var closest = this.physics.closest(this.player, Phaser.GameObject);

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.up)) {
      this.player.x -= 16;
      this.player.y -= 8;
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.left)) {
      this.player.x -= 16;
      this.player.y += 8;
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.down)) {
      this.player.x += 16;
      this.player.y += 8;
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.right)) {
      this.player.x += 16;
      this.player.y -= 8;
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
      closest.x += 16;
      closest.y += 8;
      closest.gameObject.setData({direction: 'right'});
    }

    if (closest.gameObject.getData('direction') === 'right') {
      closest.gameObject.play("dragon_knight_anim2");
      closest.gameObject.setData({direction: 'left'});
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