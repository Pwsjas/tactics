import MainScene from "./MainScene.js";
import MapSelectionScene from "./MapSelectionScene.js";
import GameOverScene from "./GameOverScene.js";

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
  backgroundColor: '#000000',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene, GameOverScene, MapSelectionScene],
  scale: {
    zoom: 1,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);