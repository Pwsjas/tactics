export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");

    this.message;
  }

  init(data) {
    this.team = data.team;
    this.map = data.map;
    this.message = data.message;
  }

  preload() {
    //Units
    if (team === 'humans') {
      this.load.image('ally1', 'assets/unit-images/human-dragon-knight.png')
      this.load.image('ally2', 'assets/unit-images/human-archer.png')
      this.load.image('ally3', 'assets/unit-images/human-thief.png')
      this.load.image('ally4', 'assets/unit-images/human-fighter.png')
    }

    if (team === 'dwarfs') {
      this.load.image('ally1', 'assets/unit-images/dwarf-blacksmith.png')
      this.load.image('ally2', 'assets/unit-images/dwarf-worker.png')
      this.load.image('ally3', 'assets/unit-images/dwarf-captain.png')
      this.load.image('ally4', 'assets/unit-images/dwarf-hunter.png')
    }

    if (team === 'elves') {
      this.load.image('ally1', 'assets/unit-images/elf-elder.png')
      this.load.image('ally2', 'assets/unit-images/elf-stalker.png')
      this.load.image('ally3', 'assets/unit-images/elf-recruit.png')
      this.load.image('ally4', 'assets/unit-images/elf-warrior.png')
    }

    
  }

  create() {
    //Message
    this.selectionText = this.add.text(640, 320, "Select a Level", { color: 'white', fontSize: 64 });
  }

  update() {

  }
}