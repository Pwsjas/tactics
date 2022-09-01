export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  preload() {
    console.log('preload');
    // this.load.image("char_walk_right", "../images/char_walk_right.gif");
  }

  create() {
    console.log('create');

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