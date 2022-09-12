export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    //Camera Fade In
    this.cameras.main.fadeIn(2000, 0, 0, 0)
    
    //Data passed from MainScene
    this.team = data.team;
    this.map = data.map;
    this.message = data.message;
  }

  preload() {
    //Units
    if (this.team === 'humans') {
      this.load.image('ally1', 'assets/unit-images/human-dragon-knight.png')
      this.load.image('ally2', 'assets/unit-images/human-archer.png')
      this.load.image('ally3', 'assets/unit-images/human-thief.png')
      this.load.image('ally4', 'assets/unit-images/human-fighter.png')
    }

    if (this.team === 'dwarfs') {
      this.load.image('ally1', 'assets/unit-images/dwarf-blacksmith.png')
      this.load.image('ally2', 'assets/unit-images/dwarf-worker.png')
      this.load.image('ally3', 'assets/unit-images/dwarf-captain.png')
      this.load.image('ally4', 'assets/unit-images/dwarf-hunter.png')
    }

    if (this.team === 'elves') {
      this.load.image('ally1', 'assets/unit-images/elf-elder.png')
      this.load.image('ally2', 'assets/unit-images/elf-stalker.png')
      this.load.image('ally3', 'assets/unit-images/elf-recruit.png')
      this.load.image('ally4', 'assets/unit-images/elf-warrior.png')
    }

    if (this.map === "water") {
      this.load.image('enemy1', 'assets/unit-images/orc-shogun.png')
      this.load.image('enemy2', 'assets/unit-images/orc-soldier.png')
    }

    if (this.map === "desert") {
      this.load.image('enemy1', 'assets/unit-images/skeleton-shaman.png')
      this.load.image('enemy2', 'assets/unit-images/skeleton.png')
    }
    if (this.map === "lava") {
      this.load.image('enemy1', 'assets/unit-images/demon-shaman.png')
      this.load.image('enemy2', 'assets/unit-images/demon-soldier.png')
    }
  }

  create() {

    if (this.message !== 'Game Over') {
      this.selectionText = this.add.text(360, 280, `${this.message}`, { color: 'white', fontSize: 64 });

      this.a1 = this.add.sprite(580, 400, 'ally1').scale = 3;
      this.a2 = this.add.sprite(620, 400, 'ally2').scale = 3;
      this.a3 = this.add.sprite(660, 400, 'ally3').scale = 3;
      this.a4 = this.add.sprite(700, 400, 'ally4').scale = 3;

      this.e1 = this.add.sprite(580, 460, 'enemy1').scale = 2;
      this.e2 = this.add.sprite(620, 460, 'enemy2').scale = 2;
      this.e2 = this.add.sprite(660, 460, 'enemy2').scale = 2;
      this.e2 = this.add.sprite(700, 460, 'enemy2').scale = 2;
    } else {
      this.selectionText = this.add.text(480, 280, `${this.message}`, { color: 'white', fontSize: 64 });

      this.e1 = this.add.sprite(580, 400, 'enemy1').scale = 3;
      this.e2 = this.add.sprite(620, 400, 'enemy2').scale = 3;
      this.e2 = this.add.sprite(660, 400, 'enemy2').scale = 3;
      this.e2 = this.add.sprite(700, 400, 'enemy2').scale = 3;

      this.a1 = this.add.sprite(580, 460, 'ally1').scale = 2;
      this.a2 = this.add.sprite(620, 460, 'ally2').scale = 2;
      this.a3 = this.add.sprite(660, 460, 'ally3').scale = 2;
      this.a4 = this.add.sprite(700, 460, 'ally4').scale = 2;
    }

    this.inputKeys = this.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
      this.cameras.main.fadeOut(1000, 0, 0, 0)
              
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('MapSelectionScene');
    })
    }
  }
}