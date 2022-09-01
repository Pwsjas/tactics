import MainScene from "./MainScene.js";

const config = {
  width: 1280,
  height: 720,
  backgroundColor: '#444444',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene],
  scale: {
    zoom: 1,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};

const game = new Phaser.Game(config);