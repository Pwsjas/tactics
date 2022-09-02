export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  preload()
    {
      //Preload images / tilemaps
		this.load.image('tiles', 'assets/Isometric-tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json')
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("character", "assets/cursor.png");
    }

    create()
    {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('punyTiles', 'tiles', 32, 32, 0, 0)
		
		map.createLayer('Tile Layer 1', tileset, 640, 360)
    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    this.player = this.add.sprite(544,432, "cursor");
    const thing = this.physics.add.sprite(100,100, 'cursor');
    // this.add.character(100,100)
    // this.player.setScale(2)

    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    //this.physics.world.step(0);
  }

  update() {
    console.log('upload');
    console.log(this.thingy);

    if(Phaser.Input.Keyboard.JustDown(this.inputKeys.up)) {
      this.player.y -=8;
      this.player.x -=16;
    }
    if(Phaser.Input.Keyboard.JustDown(this.inputKeys.left)) {
      this.player.x -= 16;
      this.player.y += 8;
    }
    if(Phaser.Input.Keyboard.JustDown(this.inputKeys.down)) {
      this.player.y +=8;
      this.player.x +=16;
    }
    if(Phaser.Input.Keyboard.JustDown(this.inputKeys.right)) {
      this.player.x += 16;
      this.player.y -= 8;
    }

    var closest = this.physics.closest(this.player);
    closest.x +=0.5;
    closest.y +=0.9;
    console.log(closest);

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