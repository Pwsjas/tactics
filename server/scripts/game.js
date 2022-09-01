import MainScene from "./MainScene.js";

const config = {
  width: "30%",
  height: 500,
  backgroundColor: '#444444',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene],
  scale: {
    zoom: 2,
  }
}

const game = new Phaser.Game(config);