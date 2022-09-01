export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  preload()
    {
		this.load.image('tiles', 'assets/Isometric-tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json')
    }

    create()
    {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('punyTiles', 'tiles', 32, 32, 0, 0)
		
		map.createLayer('Tile Layer 1', tileset, 640, 360)
    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    // this.player = this.add.sprite(200,150, "char_walk_right");
    // this.player.setScale(2)

    // this.inputKeys = this.input.keyboard.addKeys({
    //   up: Phaser.Input.Keyboard.KeyCodes.W,
    //   down: Phaser.Input.Keyboard.KeyCodes.S,
    //   left: Phaser.Input.Keyboard.KeyCodes.A,
    //   right: Phaser.Input.Keyboard.KeyCodes.D,
    // })
  }

  update() {
    console.log('upload');

    // if (this.inputKeys.up.isDown) {
    //   this.player.y -= 2;
    // }
    // if (this.inputKeys.left.isDown) {
    //   this.player.x -= 2;
    // }
    // if (this.inputKeys.down.isDown) {
    //   this.player.y += 2;
    // }
    // if (this.inputKeys.right.isDown) {
    //   this.player.x += 2;
    // }
  }
}