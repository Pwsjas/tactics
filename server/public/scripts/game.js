import MainScene from "./MainScene.js";

// class CharacterGameObject extends Phaser.GameObjects.Image {
//   constructor (scene, x, y) {
//     super(scene, x, y, 'character');
//   }
// }

// class CharacterPlugin extends Phaser.Plugins.BasePlugin {
//   constructor(pluginManager){
//     super(pluginManager);

//     //register Game Object type
//     pluginManager.registerGameObject('character', this.createCharacter);
//   }

//   createCharacter(x,y) {
//     return this.displayList.add(new CharacterGameObject(this.scene,x,y));
//   }
// }

const config = {
  width: 1280,
  height: 720,
  backgroundColor: '#444444',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene],
  scale: {
    zoom: 2,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};

const game = new Phaser.Game(config);