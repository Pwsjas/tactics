import * as helpers from "./helpers/testing.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");

    let allies;
    let enemies;
    let coordinateGrid;
    let selectedUnit;
    let movementGrid = [];
    let legalMovement = [];
  }

  // Preload assets into the game engine.
  preload() {
    // Preload the background
    this.load.image('background', 'assets/background.png');

    //Preload UI
    this.load.image('ui1', 'assets/ui1.png');

    // Images for the empty
    this.load.image('health-bar', 'assets/ui-health-bar.png')
    this.load.image('health-bar-empty', 'assets/ui-empty-health-bar.png')

    // Preload the tiles for the map, and the layout of the map itself in a JSON object.
    this.load.image("tiles", "assets/Isometric-tiles.png");
    this.load.tilemapTiledJSON("tilemap16", "assets/tilemap16.json");

    // Preload the cursor and movement tile assets and assign it as a controllable character.
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("movement-tile", "assets/movement-tile.png");
    this.load.image("character", "assets/cursor.png");

    // Preload the spritesheets and animations for the dragon_knight character
    this.load.spritesheet(
      "dragon_knight_downright_idle",
      "assets/dragon-knight/dragon-knight-downright-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downleft_idle",
      "assets/dragon-knight/dragon-knight-downleft-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upright_idle",
      "assets/dragon-knight/dragon-knight-upright-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upleft_idle",
      "assets/dragon-knight/dragon-knight-upleft-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  // Create objects in the game engine based on assets.
  create() {
    // Camera that zooms in on the main level.
    this.cameras.main.zoom = 2;

    //Create the background
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1.7);

    // Create the tile map based on assets.
    const map = this.make.tilemap({ key: "tilemap16" });
    const tileset = map.addTilesetImage("punyTiles", "tiles", 32, 32, 0, 0);

    // Function that determines position of the tile map on the screen, and renders the cursor over it.
    // Accepts the x and y coords of the map, as well as the size of the map in tiles. (Only works for square maps, has to be the same number of tiles on both sides.)
    map.createLayer("Tile Layer 1", tileset, 624, 232); // 640, 360

    //Create an array of tile coordinates relating tile number to pixel values
    const createTileArray = (x, y, size) => {
      const output = [];

      for (let i = 0; i < size; i++) {
        output.push([]);
      }

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          output[i].push({
            x: x + 16 + i * 16 + j * -16,
            y: y + i * 8 + j * 8,
          });
        }
      }

      return output;
    };

    this.coordinateGrid = createTileArray(624, 232, 16);

    // const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);

    // Assign cursor position based on createTileLayer function.
    this.player = this.physics.add.sprite(
      this.coordinateGrid[0][0].x,
      this.coordinateGrid[0][0].y,
      "cursor"
    );
    this.player.setData({
      coordX: 0,
      coordY: 0,
    });

    // Assign manipulatable data to the dragon_knight game object.
    this.dragon_knight = this.physics.add.sprite(
      this.coordinateGrid[2][1].x,
      this.coordinateGrid[2][1].y,
      "dragon_knight_downright_idle"
    );
    this.dragon_knight2 = this.physics.add.sprite(
      this.coordinateGrid[11][3].x,
      this.coordinateGrid[11][3].y,
      "dragon_knight_downleft_idle"
    );

    // Add HUD for holding the UI
    this.uiBackground = this.add.sprite(395, 304, "ui1").setScale(0.5);
    
    // Assign a floating sprite as a character portrait and a health bar within the UI
    this.dragon_knight_portrait = this.add.sprite(394, 236, "dragon_knight_downright_idle").setScale(1.5);
    
    const x = 344;
    const y = 260;
    
    // Background shadow for the health bar
	  this.healthBarEmpty = this.add.image(x, y, 'health-bar-empty').setOrigin(0, 0.5).setScale(0.4);
	  this.healthBarEmpty.displayWidth = 100;

    // Actual health bar that changes
    this.healthBar = this.add.image(x, y, 'health-bar').setOrigin(0, 0.5).setScale(0.4);
    
	  this.setMeterPercentage(100);

    // Create text for the character UI
    this.uiText = this.add.text(342, 274, "", { color: 'white' });

    // Set UI to invisible until a unit is selected.
    this.uiBackground.visible = false;
    this.dragon_knight_portrait.visible = false;
    this.healthBarEmpty.visible = false;
    this.healthBar.visible = false;

    this.dragon_knight.setData({
      direction: "left",
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
      hasMoved: false,
      hasMovementTiles: false,
      coordX: 2,
      coordY: 1,
    });

    this.dragon_knight2.setData({
      direction: "right",
      turn: true,
      selected: false,
      state: null,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
      hasMoved: false,
      hasMovementTiles: false,
      coordX: 11,
      coordY: 3,
    });

    // Create animations for the sprites based on the spritesheet.
    this.anims.create({
      key: "dragon_knight_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_idle"),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_idle"),
      frameRate: 4,
      repeat: -1,
    });

    // Play those animations.
    this.dragon_knight.play("dragon_knight_anim1");
    this.dragon_knight2.play("dragon_knight_anim2");
    this.dragon_knight_portrait.play("dragon_knight_anim1")

    // Add keyboard input.
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      h: Phaser.Input.Keyboard.KeyCodes.H,
    });

    this.physics.world.step(0);
  };

  setMeterPercentage(percent = 100) {
    const width = 100 * percent / 100;
	  this.healthBar.displayWidth = width;
  };

  update() {

    console.log(this.player.getData("coordX"), this.player.getData("coordY"));
    let closest = this.physics.closest(this.player, Phaser.GameObject);

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.up)) {
      this.player.x -= 16;
      this.player.y -= 8;
      this.player.setData({ coordX: this.player.getData("coordX") - 1 });
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.left)) {
      this.player.x -= 16;
      this.player.y += 8;
      this.player.setData({ coordY: this.player.getData("coordY") + 1 });
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.down)) {
      this.player.x += 16;
      this.player.y += 8;
      this.player.setData({ coordX: this.player.getData("coordX") + 1 });
    }
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.right)) {
      this.player.x += 16;
      this.player.y -= 8;
      this.player.setData({ coordY: this.player.getData("coordY") - 1 });
    }

    // console.log("x: ", this.player.x, closest.x);
    // console.log("y: ", this.player.y, closest.y);

    // Coordinates adjustment to target individual character sprites on the map.
    if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16) {
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
        this.selectedUnit = closest;
      }
    }

    if (this.selectedUnit) {

      //check if unit has moved this turn
      if (!this.selectedUnit.gameObject.getData("hasMoved")) {
        //check if unit has movement tiles rendered around them
        if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
          this.movementGrid = [];
          this.legalMovement = [];
          for (let i = 0; i < 25; i++) {
            const relationsX = [
              3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1,
              -1, -2, -2, -2, -3,
            ];
            const relationsY = [
              0, 1, 0, -1, 2, 1, 0, -1, -2, 3, 2, 1, 0, -1, -2, -3, 2, 1, 0, -1,
              -2, 1, 0, -1, 0,
            ];

            //Check out of bounds
            if (
              this.selectedUnit.gameObject.getData("coordX") + relationsX[i] <
              0 ||
              this.selectedUnit.gameObject.getData("coordX") + relationsX[i] >
              15 ||
              this.selectedUnit.gameObject.getData("coordY") + relationsY[i] <
              0 ||
              this.selectedUnit.gameObject.getData("coordY") + relationsY[i] >
              15
            ) {
              //Add movement tile sprites
            } else {
              this.movementGrid.push(
                this.add.sprite(this.coordinateGrid[
                  this.selectedUnit.gameObject.getData("coordX") + relationsX[i]
                ][
                  this.selectedUnit.gameObject.getData("coordY") + relationsY[i]
                ].x,
                  this.coordinateGrid[
                    this.selectedUnit.gameObject.getData("coordX") + relationsX[i]
                  ][
                    this.selectedUnit.gameObject.getData("coordY") + relationsY[i]
                  ].y + 16,
                  "movement-tile"
                )
              );

              //Create legal movement array
              this.legalMovement.push({
                x:
                  this.selectedUnit.gameObject.getData("coordX") +
                  relationsX[i],
                y:
                  this.selectedUnit.gameObject.getData("coordY") +
                  relationsY[i],
              });
            }
          }
          console.log(this.legalMovement);
          console.log(this.movementGrid);
          this.selectedUnit.gameObject.setData({ hasMovementTiles: true });
        }
        //Check for movement input
        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
          //Confirm movement is valid
          if (
            this.legalMovement.filter(
              (coords) =>
                coords.x === this.player.getData("coordX") &&
                coords.y === this.player.getData("coordY")
            ).length > 0
          ) {
            //Move selectedUnit
            this.selectedUnit.gameObject.x =
              this.coordinateGrid[this.player.getData("coordX")][
                this.player.getData("coordY")
              ].x;
            this.selectedUnit.gameObject.y =
              this.coordinateGrid[this.player.getData("coordX")][
                this.player.getData("coordY")
              ].y;
            this.selectedUnit.gameObject.setData({ hasMoved: true });

            //Set new Coordinates
            this.selectedUnit.gameObject.setData({
              coordX: this.player.getData("coordX"),
            });
            this.selectedUnit.gameObject.setData({
              coordY: this.player.getData("coordY"),
            });

            //Cleanup movement grid
            for (const sprite of this.movementGrid) {
              sprite.destroy();
            }
          }
        }
      }
      // Load ui
      this.uiBackground.visible = true;
      this.dragon_knight_portrait.visible = true;
      this.healthBarEmpty.visible = true;
      this.healthBar.visible = true;

      if (this.selectedUnit.gameObject.getData("hit_points") <= 0) {
        this.uiText.setText(["This guy is knocked out"]);
      } else {
        this.uiText.setText([
          "HP: " + this.selectedUnit.gameObject.getData("hit_points") + "/" + this.selectedUnit.gameObject.getData("total_hit_points"),
          "Movement: " + this.selectedUnit.gameObject.getData("movement"),
        ]);
      }
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.h)) {
        const damage = 25;
        this.selectedUnit.gameObject.setData({ hit_points: this.selectedUnit.gameObject.getData("hit_points") - damage });
        this.setMeterPercentage(this.selectedUnit.gameObject.getData("hit_points"));
        this.uiText.setText([
          `HP: ${this.selectedUnit.gameObject.getData("hit_points")}/${this.selectedUnit.gameObject.getData("total_hit_points")}`
        ]);
        if (this.selectedUnit.gameObject.getData("hit_points") === 0) {
          // Set their sprite to dead
          this.uiText.setText([
            "HP: 0/" + this.selectedUnit.gameObject.getData("total_hit_points"),
            "Movement: " + this.selectedUnit.gameObject.getData("movement"),
          ]);
          this.selectedUnit.gameObject.destroy();
          this.selectedUnit = undefined;
        }
      }
    }
  }
}