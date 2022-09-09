import * as helpers from "./helpers/testing.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");

    let allies;
    let alliesGroup;
    let enemies;
    let coordinateGrid;
    let selectedUnit;
    let movementGrid = [];
    let legalMovement = [];
    let invalidTiles = [];

    //# of movements for the current movement sequence
    let tileMoves;
    let movingUnit;
    let pathingArray = [];
    let attackTiles = [];
    let attackGrid = [];
    let isMoving = false;

    let phase;
    let enemyCount;
    let enemyTotal;
    let sortedLegalMovement;
    let closestMove;
    let hasMoved;
    let hasAttacked;
    let enemyPrep;

    let closestAlly;
    let closestLowHealthAlly
  }

  // Preload assets into the game engine.
  preload() {
    // Preload background
    this.load.image('background', 'assets/background.png');

    //Preload UI
    this.load.image('ui1', 'assets/ui/ui1.png');
    this.load.image('ui2', 'assets/ui/ui2.png');

    // Images for the empty
    this.load.image('health-bar', 'assets/ui/ui-health-bar.png')
    this.load.image('health-bar-empty', 'assets/ui/ui-empty-health-bar.png')

    // Preload the tiles for the map, and the layout of the map itself in a JSON object.
    this.load.image("tiles", "assets/Isometric-tiles.png");
    this.load.tilemapTiledJSON("tilemap16", "assets/tilemap16.json");

    // Preload the cursor and movement tile assets and assign it as a controllable character.
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("movement-tile", "assets/movement-tile.png");
    this.load.image("attack-tile", "assets/attack-tile.png");
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
    this.load.spritesheet(
      "dragon_knight_downright_attacking",
      "assets/dragon-knight/dragon-knight-downright-attacking.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downleft_attacking",
      "assets/dragon-knight/dragon-knight-downleft-attacking.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upright_attacking",
      "assets/dragon-knight/dragon-knight-upright-attacking.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upleft_attacking",
      "assets/dragon-knight/dragon-knight-upleft-attacking.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downright_damage",
      "assets/dragon-knight/dragon-knight-downright-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downleft_damage",
      "assets/dragon-knight/dragon-knight-downleft-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upright_damage",
      "assets/dragon-knight/dragon-knight-upright-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upleft_damage",
      "assets/dragon-knight/dragon-knight-upleft-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downright_laying_down",
      "assets/dragon-knight/dragon-knight-downright-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_downleft_laying_down",
      "assets/dragon-knight/dragon-knight-downleft-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upright_laying_down",
      "assets/dragon-knight/dragon-knight-upright-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "dragon_knight_upleft_laying_down",
      "assets/dragon-knight/dragon-knight-upleft-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );

    // Preload the spritesheets and animations for the skeleton character
    this.load.spritesheet(
      "skeleton_downright_idle",
      "assets/skeleton/skeleton-downright-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_downleft_idle",
      "assets/skeleton/skeleton-downleft-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_upright_idle",
      "assets/skeleton/skeleton-upright-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_upleft_idle",
      "assets/skeleton/skeleton-upleft-idle.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_downright_damage",
      "assets/skeleton/skeleton-downright-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_downleft_damage",
      "assets/skeleton/skeleton-downleft-damage.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_downright_laying_down",
      "assets/skeleton/skeleton-downright-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "skeleton_downleft_laying_down",
      "assets/skeleton/skeleton-downleft-laying-down.png",
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  // Create objects in the game engine based on assets.
  create() {
    // Camera that zooms in on the main level.
    this.cameras.main.zoom = 2;
    this.invalidTiles = [
      {x: 4, y: 5}, {x: 4, y: 6},
      {x: 5, y: 5}, {x: 5, y: 6}, {x: 5, y: 7},
      {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8}, {x: 6, y: 9},
      {x: 7, y: 4}, {x: 7, y: 5}, {x: 7, y: 6}, {x: 7, y: 7}, {x: 7, y: 8}, {x: 7, y: 9},
      {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7}, {x: 8, y: 8}, {x: 8, y: 9},
      {x: 9, y: 6}, {x: 9, y: 7}, {x: 9, y: 8}
    ];

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
    //Create Tracker used for movement calculations
    this.tracker = this.add.sprite(this.coordinateGrid[7][7].x, this.coordinateGrid[7][7].y);
    this.tracker.setData({
      coordX: 7,
      coordY: 7,
    })

    this.player = this.add.sprite(
      this.coordinateGrid[0][0].x,
      this.coordinateGrid[0][0].y,
      "cursor"
    );
    this.player.setData({
      coordX: 0,
      coordY: 0,
    });

    // Assign placement for skeleton game object on the map.
    this.skeleton_soldier = this.physics.add.sprite(
      this.coordinateGrid[3][4].x,
      this.coordinateGrid[3][4].y,
      "skeleton_downright_idle"
    );

    this.skeleton_soldier2 = this.physics.add.sprite(
      this.coordinateGrid[4][10].x,
      this.coordinateGrid[4][10].y,
      "skeleton_downleft_idle"
    );

    // Add HUD for holding the UI
    this.uiBackground1 = this.add.sprite(395, 304, "ui1").setScale(0.5);
    this.uiBackground2 = this.add.sprite(887, 304, "ui2").setScale(0.5);
    
    // Assign a floating sprite as a character portrait and a health bar within the UI
    this.dragon_knight_portrait = this.add.sprite(394, 236, "dragon_knight_downright_idle").setScale(1.5);
    this.skeleton_soldier_portrait = this.add.sprite(886, 236, "skeleton_downleft_idle").setScale(1.5);
    
    const x = 344;
    const y = 260;
    
    // Background shadow for the health bar
	  this.healthBarEmpty1 = this.add.image(344, 260, 'health-bar-empty').setOrigin(0, 0.5).setScale(0.4);
	  this.healthBarEmpty1.displayWidth = 100;

    this.healthBarEmpty2 = this.add.image(839, 260, 'health-bar-empty').setOrigin(0, 0.5).setScale(0.4);
    this.healthBarEmpty2.displayWidth = 100;

    // Actual health bar that changes
    this.healthBar1 = this.add.image(344, 260, 'health-bar').setOrigin(0, 0.5).setScale(0.4);

    this.healthBar2 = this.add.image(839, 260, 'health-bar').setOrigin(0, 0.5).setScale(0.4);
    
	  this.setMeterPercentage1(100);
    this.setMeterPercentage2(100);

    // Create text for the character UI
    this.uiText1 = this.add.text(342, 274, "", { color: 'white' });
    this.uiText2 = this.add.text(837, 274, "", { color: 'white' });

    // Set UI to invisible until a unit is selected.
    this.uiBackground1.visible = false;
    this.uiBackground2.visible = false;
    this.dragon_knight_portrait.visible = false;
    this.skeleton_soldier_portrait.visible = false;
    this.healthBarEmpty1.visible = false;
    this.healthBar1.visible = false;
    this.healthBarEmpty2.visible = false;
    this.healthBar2.visible = false;

    this.skeleton_soldier.setData({
      direction: "right",
      turn: false,
      movement: 3,
      total_hit_points: 75,
      hit_points: 75,
      hasMoved: false,
      hasUiOpen: false,
      hasAttacked: false,
      coordX: 3,
      coordY: 4,
      animations: {
        down: `skeleton_idle_anim1`,
        left: `skeleton_idle_anim2`,
        right: `skeleton_idle_anim3`,
        up: `skeleton_idle_anim4`
      }
    });

    this.skeleton_soldier2.setData({
      direction: "right",
      turn: false,
      movement: 3,
      total_hit_points: 75,
      hit_points: 75,
      hasMoved: false,
      hasUiOpen: false,
      hasAttacked: false,
      coordX: 4,
      coordY: 10,
      animations: {
        down: `skeleton_idle_anim1`,
        left: `skeleton_idle_anim2`,
        right: `skeleton_idle_anim3`,
        up: `skeleton_idle_anim4`
      }
    });

    // Create animations for the sprites based on the spritesheet for the dragon knight.
    this.anims.create({
      key: "dragon_knight_idle_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_idle_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_idle_anim3",
      frames: this.anims.generateFrameNumbers("dragon_knight_upright_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_idle_anim4",
      frames: this.anims.generateFrameNumbers("dragon_knight_upleft_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_attacking_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_attacking"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_attacking_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_attacking"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_attacking_anim3",
      frames: this.anims.generateFrameNumbers("dragon_knight_upright_attacking"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_attacking_anim4",
      frames: this.anims.generateFrameNumbers("dragon_knight_upleft_attacking"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dragon_knight_damage_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_damage"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_damage_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_damage"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_laying_down_anim1",
      frames: this.anims.generateFrameNumbers("dragon_knight_downright_laying_down"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "dragon_knight_laying_down_anim2",
      frames: this.anims.generateFrameNumbers("dragon_knight_downleft_laying_down"),
      frameRate: 5,
      repeat: 0,
    });

    // Create animations for the sprites based on the spritesheet for the skeleton.
    this.anims.create({
      key: "skeleton_idle_anim1",
      frames: this.anims.generateFrameNumbers("skeleton_downright_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "skeleton_idle_anim2",
      frames: this.anims.generateFrameNumbers("skeleton_downleft_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "skeleton_idle_anim3",
      frames: this.anims.generateFrameNumbers("skeleton_upright_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "skeleton_idle_anim4",
      frames: this.anims.generateFrameNumbers("skeleton_upleft_idle"),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "skeleton_damage_anim1",
      frames: this.anims.generateFrameNumbers("skeleton_downright_damage"),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "skeleton_laying_down_anim1",
      frames: this.anims.generateFrameNumbers("skeleton_downright_laying_down"),
      frameRate: 5,
      repeat: 0,
    });

    // Play those animations.
    this.skeleton_soldier.play("skeleton_idle_anim1");
    this.skeleton_soldier2.play("skeleton_idle_anim2");
    this.dragon_knight_portrait.play("dragon_knight_idle_anim1");
    this.skeleton_soldier_portrait.play("skeleton_idle_anim2");

    // Add keyboard input.
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      h: Phaser.Input.Keyboard.KeyCodes.H,
      p: Phaser.Input.Keyboard.KeyCodes.P,
      k: Phaser.Input.Keyboard.KeyCodes.K,
      l: Phaser.Input.Keyboard.KeyCodes.L,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
    });

    this.enemies = [this.skeleton_soldier, this.skeleton_soldier2];

    this.physics.world.step(0);

    //Generate allied and enemy units
    const generateUnit = (unitType, x, y) => {
      const newUnit = this.physics.add.sprite(
        this.coordinateGrid[x][y].x,
        this.coordinateGrid[x][y].y,
        `${unitType}_downright_idle`
      );

      newUnit.setData({
        direction: "left",
        turn: true,
        selected: false,
        state: null,
        movement: 3,
        total_hit_points: 100,
        hit_points: 100,
        hasMoved: false,
        hasMovementTiles: false,
        hasAttacked: false,
        coordX: x,
        coordY: y,
        animations: {
          down: `${unitType}_idle_anim1`,
          left: `${unitType}_idle_anim2`,
          right: `${unitType}_idle_anim3`,
          up: `${unitType}_idle_anim4`
        },
        attack_animations: {
          down: `${unitType}_attacking_anim1`,
          left: `${unitType}_attacking_anim2`,
          right: `${unitType}_attacking_anim3`,
          up: `${unitType}_attacking_anim4`
        },
        damage_animations: {
          down: `${unitType}_damage_anim1`,
          left: `${unitType}_damage_anim2`,
          right: `${unitType}_damage_anim3`,
          up: `${unitType}_damage_anim4`
        },
        laying_down_animations: {
          down: `${unitType}_laying_down_anim1`,
          left: `${unitType}_laying_down_anim2`,
          right: `${unitType}_laying_down_anim3`,
          up: `${unitType}_laying_down_anim4`
        }
      });
      newUnit.play(newUnit.data.values.animations.down);

      return newUnit;
    }
    this.dragon_knight1 = generateUnit('dragon_knight', 3, 6);
    this.dragon_knight2 = generateUnit('dragon_knight', 2, 4);
    this.dragon_knight3 = generateUnit('dragon_knight', 5, 4);
    this.dragon_knight4 = generateUnit('dragon_knight', 0, 0);
    this.alliesGroup = this.physics.add.group();
    this.alliesGroup.add(this.dragon_knight1)
    this.alliesGroup.add(this.dragon_knight2)
    this.alliesGroup.add(this.dragon_knight3)
    this.alliesGroup.add(this.dragon_knight4)
    
    this.allies = [this.dragon_knight1, this.dragon_knight2, this.dragon_knight3, this.dragon_knight4]

    this.phase = 'player';
    this.enemyCount = 0;
    this.enemyTotal = this.enemies.length;
  };

  // Functions that determines the length of the health bar.
  setMeterPercentage1(percent = 100) {
    const width = 100 * percent / 100;
	  this.healthBar1.displayWidth = width;
  };
  setMeterPercentage2(percent = 100) {
    const width = 100 * percent / 75;
    this.healthBar2.displayWidth = width;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // UPDATE //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.z)) {
      if (this.phase === 'player') {
        this.phase = 'enemy';
      } else {
        this.phase = 'player';
      }
      this.hasMoved = false;
      this.hasAttacked - false;
      this.legalMovement = undefined;
      console.log(this.coordinateGrid[3][2].x, this.coordinateGrid[3][2].y)
      console.log(this.dragon_knight1.x, this.dragon_knight1.y)
    }
    let closestTracker = this.physics.closest(this.tracker, Phaser.GameObject);
    
    //Move the Tracker object up down left or right given a direction
    const moveTracker = (direction) => {
      if (direction === 'left') {
        this.tracker.setData({coordX: this.tracker.getData("coordX"), coordY: this.tracker.getData("coordY") + 1})
        if (this.tracker.getData('coordX') >= 0 && this.tracker.getData('coordX') <= 15 && this.tracker.getData('coordY') >= 0 && this.tracker.getData('coordY') <= 15) {
          this.tracker.x = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x;
          this.tracker.y = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y;
        }
      }
      if (direction === 'right') {
        this.tracker.setData({coordX: this.tracker.getData("coordX"), coordY: this.tracker.getData("coordY") - 1})
        if (this.tracker.getData('coordX') >= 0 && this.tracker.getData('coordX') <= 15 && this.tracker.getData('coordY') >= 0 && this.tracker.getData('coordY') <= 15) {
          this.tracker.x = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x;
          this.tracker.y = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y;
        }
      }
      if (direction === 'up') {
        this.tracker.setData({coordX: this.tracker.getData("coordX") - 1, coordY: this.tracker.getData("coordY")})
        if (this.tracker.getData('coordX') >= 0 && this.tracker.getData('coordX') <= 15 && this.tracker.getData('coordY') >= 0 && this.tracker.getData('coordY') <= 15) {
          this.tracker.x = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x;
          this.tracker.y = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y;
        }
      }
      if (direction === 'down') {
        this.tracker.setData({coordX: this.tracker.getData("coordX") + 1, coordY: this.tracker.getData("coordY")})
        if (this.tracker.getData('coordX') >= 0 && this.tracker.getData('coordX') <= 15 && this.tracker.getData('coordY') >= 0 && this.tracker.getData('coordY') <= 15) {
          this.tracker.x = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x;
          this.tracker.y = this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y;
        }
      }
    }

    const findDirection = (destination, location) => {
      console.log(destination, location);
      if (destination.x - location.x > 0 && destination.y - location.y > 0) {
        return 'left';
      } else if (destination.x - location.x > 0 && destination.y - location.y < 0) {
        return 'down';
      } else if (destination.x - location.x < 0 && destination.y - location.y > 0) {
        return 'up';
      } else if (destination.x - location.x < 0 && destination.y - location.y < 0) {
        return 'right';
      } else if (destination.x - location.x === 0 && destination.y - location.y > 0) {
        return 'left';
      } else if (destination.x - location.x > 0 && destination.y - location.y === 0) {
        return 'down';
      } else if (destination.x - location.x === 0 && destination.y - location.y < 0) {
        return 'right';
      } else if (destination.x - location.x < 0 && destination.y - location.y === 0) {
        return 'up';
      }
    }

    //Animate a unit's movement to a destination, given sequence of tiles and the unit
    const moveUnit = (unit, sequence, totalMoves) => {
      let direction = findDirection(sequence[totalMoves], {x: unit.gameObject.getData('coordX'), y: unit.gameObject.getData('coordY')})
      if (!direction) {
        unit.gameObject.setData({direction: null})
      } else {
        unit.gameObject.setData({direction});
      }
      unit.gameObject.play(`${unit.gameObject.data.values.animations[direction]}`);
      unit.gameObject.setData({coordX: sequence[totalMoves].x, coordY: sequence[totalMoves].y})
    }
    const moveEnemyUnit = (unit, sequence, totalMoves) => {
      let direction = findDirection(sequence[totalMoves], {x: unit.getData('coordX'), y: unit.getData('coordY')});
      if (!direction) {
        unit.setData({direction: null})
      } else {
        unit.setData({direction});
      }
      unit.play(`${unit.data.values.animations[direction]}`);
      unit.setData({coordX: sequence[totalMoves].x, coordY: sequence[totalMoves].y})
    }

    const movePixels = (unit) => {
      if (unit.getData('direction') === 'up') {
        unit.x -= 0.5;
        unit.y -= 0.25;
      }
      if (unit.getData('direction') === 'down') {
        unit.x += 0.5;
        unit.y += 0.25;
      }
      if (unit.getData('direction') === 'left') {
        unit.x -= 0.5;
        unit.y += 0.25;
      }
      if (unit.getData('direction') === 'right') {
        unit.x += 0.5;
        unit.y -= 0.25;
      }
    }

    //If a unit is moving, handle velocity
    if (this.isMoving) {
      //ENEMIES
      if (!this.movingUnit.gameObject) {
        movePixels(this.movingUnit);
        if (this.tileMoves === 0) {
          if (
            Math.round(this.movingUnit.x) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x &&
            Math.round(this.movingUnit.y) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
            ) {
              this.isMoving = false;
              this.hasMoved = true;
              this.movingUnit.setData({ hasMoved: true });
              movePixels(this.movingUnit);
            }
        } else {
          if (
            Math.round(this.movingUnit.x) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x &&
            Math.round(this.movingUnit.y) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
            ) { 
                this.tileMoves = this.tileMoves - 1;
                moveEnemyUnit(this.movingUnit, this.pathingArray, this.tileMoves);
            }
        }
      } else {
        //PLAYERS
        movePixels(this.movingUnit.gameObject);
        if (this.tileMoves === 0) {
          if (
            Math.round(this.movingUnit.gameObject.x) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x &&
            Math.round(this.movingUnit.gameObject.y) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
            ) {
              this.isMoving = false;
              this.hasMoved = true;
              this.movingUnit.gameObject.setData({ hasMoved: true });
              this.movingUnit.gameObject.x = this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x
              this.movingUnit.gameObject.y = this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
              console.log(this.coordinateGrid[0][1].x, this.coordinateGrid[0][1].y)
              console.log(this.movingUnit.gameObject.x, this.movingUnit.gameObject.y)
            }
        } else {
          if (
            Math.round(this.movingUnit.gameObject.x) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x &&
            Math.round(this.movingUnit.gameObject.y) === this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
            ) { 
                this.tileMoves = this.tileMoves - 1;
                moveUnit(this.movingUnit, this.pathingArray, this.tileMoves);
            }
        }
      }
    }

    //Find shortest path from selectedUnit to destination(cursor), return array of tiles leading from A to B
    const findMovementPath = (prevDirection, moveCount, totalMoves, destination) => {   
      if (moveCount === totalMoves) {
        moveTracker(prevDirection);
        return;
      }

      //Check if destination has been reached
      if (this.tracker.getData("coordX") === destination.x && this.tracker.getData("coordY") === destination.y) {
        console.log("FOUND DESTINATION")
        this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
        moveTracker(prevDirection);
        return true
      }

      //calculate direction
      let direction = findDirection(destination, {x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')}); 

      //Check valid tile
      if (this.legalMovement.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length <= 0) {
        //set tracker to prevDirection
        moveTracker(prevDirection);
        return;
      }

      //Call findMovementPath based on direction
      if (direction === 'up') {
        //check up
        moveTracker('up');
        if (findMovementPath('down', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        //check left
        moveTracker('left');
        if (findMovementPath('right', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')})
          moveTracker(prevDirection);;
          return true
        }
        moveTracker('down');
        if (findMovementPath('up', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('right');
        if (findMovementPath('left', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
      }

      if (direction === 'left') {
        //check left
        moveTracker('left');
        if (findMovementPath('right', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        //check down
        moveTracker('down');
        if (findMovementPath('up', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('left');
        if (findMovementPath('right', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('up');
        if (findMovementPath('down', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
      }

      if (direction === 'down') {
        //check down
        moveTracker('down');
        if (findMovementPath('up', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        //check right
        moveTracker('right');
        if (findMovementPath('left', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('up');
        if (findMovementPath('down', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('left');
        if (findMovementPath('right', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
      }

      if (direction === 'right') {
        //check right
        moveTracker('right');
        if (findMovementPath('left', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        //check up
        moveTracker('up');
        if (findMovementPath('down', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('down');
        if (findMovementPath('up', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
        moveTracker('left');
        if (findMovementPath('right', moveCount + 1, totalMoves, destination)) {
          this.pathingArray.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
          moveTracker(prevDirection);
          return true
        }
      }

      moveTracker(prevDirection);
      return;
    }

    //Findpath
    const findPath = (prevDirection, moveCount, totalMoves) => {
      console.log("New Tilel", this.tracker.getData('coordX'), this.tracker.getData('coordY'))
      closestTracker = this.physics.closest(this.tracker, Phaser.GameObject);
      let allInvalid = 0;
      //return if moveCount reached
      if (moveCount === totalMoves) {
        moveTracker(prevDirection);
        return;
      }

      //Check if new location is invalid
      if ((
        this.tracker.x === closestTracker.gameObject.x && this.tracker.y === closestTracker.gameObject.y) ||
        (this.invalidTiles.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length > 0||
        this.tracker.getData('coordX') < 0||
        this.tracker.getData('coordY') < 0||
        this.tracker.getData('coordX') > 15||
        this.tracker.getData('coordY') > 15)) {
        //set tracker to prevDirection
        moveTracker(prevDirection);
        return;
      }

      //Repeat in every  direciton, except origin direction
      if (prevDirection === 'left') {
        moveTracker('up');
        if (findPath('down', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('right');
        if (findPath('left', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('down');
        if (findPath('up', moveCount + 1, totalMoves)) {allInvalid += 1};
      }
      if (prevDirection === 'right') {
        moveTracker('up');
        if (findPath('down', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('left');
        if (findPath('right', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('down');
        if (findPath('up', moveCount + 1, totalMoves)) {allInvalid += 1};
      }
      if (prevDirection === 'down') {
        moveTracker('up');
        if (findPath('down', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('right');
        if (findPath('left', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('left');
        if (findPath('right', moveCount + 1, totalMoves)) {allInvalid += 1};
      }
      if (prevDirection === 'up') {
        moveTracker('left');
        if (findPath('right', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('right');
        if (findPath('left', moveCount + 1, totalMoves)) {allInvalid += 1};

        moveTracker('down');
        if (findPath('up', moveCount + 1, totalMoves)) {allInvalid += 1};
      }
      //Set Tracker to prevDirection
      if (allInvalid !== 3) {
        moveTracker(prevDirection);
        
        //Check if sprite already exists
        if (this.legalMovement.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length > 0) {
          return;
        }
      }
        
      //Add location to legalMovement
      this.legalMovement.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
        
      //Render sprite and add it to this.movementGrid
      if (this.phase === 'player') {
        this.movementGrid.push(this.add.sprite(
          this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x,
          this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y + 16,
          "movement-tile"
        ));
      }
          
      if (allInvalid === 3) {
        moveTracker(prevDirection);
      }
      return;
    }

    if (this.phase === 'player') {
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
  
      // Coordinates adjustment to target individual character sprites on the map.
      if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.allies.includes(closest.gameObject)) {
        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
          this.selectedUnit = closest;
          this.selectedUnit.gameObject.setData({ hasUiOpen: true });
        }
      }
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // PLAYER //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      if (this.selectedUnit) {
  
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // MOVEMENT //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
        //check if unit has moved this turn
        if (!this.selectedUnit.gameObject.getData("hasMoved")) {
          //check if unit has movement tiles rendered around them
          if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
            if (Phaser.Input.Keyboard.JustDown(this.inputKeys.p)) {
              this.tracker.setData({coordX: this.selectedUnit.gameObject.getData("coordX"), coordY: this.selectedUnit.gameObject.getData("coordY")});
              this.tracker.x = this.selectedUnit.x;
              this.tracker.y = this.selectedUnit.y;
              this.legalMovement = [];
              this.movementGrid = [];

              moveTracker('up');
              console.log(this.tracker.getData('coordX'), this.tracker.getData('coordY'))
              findPath('down', 0, this.selectedUnit.gameObject.getData('movement')+ 1);
              console.log("after", this.tracker.getData('coordX'), this.tracker.getData('coordY'))
      
              moveTracker('down');
              console.log(this.tracker.getData('coordX'), this.tracker.getData('coordY'))
              findPath('up', 0, this.selectedUnit.gameObject.getData('movement')+ 1);
              console.log("after", this.tracker.getData('coordX'), this.tracker.getData('coordY'))
      
              moveTracker('right');
              console.log(this.tracker.getData('coordX'), this.tracker.getData('coordY'))
              findPath('left', 0, this.selectedUnit.gameObject.getData('movement')+ 1); 
              console.log("after", this.tracker.getData('coordX'), this.tracker.getData('coordY'))
      
              moveTracker('left');
              console.log(this.tracker.getData('coordX'), this.tracker.getData('coordY'))
              findPath('right', 0, this.selectedUnit.gameObject.getData('movement')+ 1);
              console.log("after", this.tracker.getData('coordX'), this.tracker.getData('coordY'))
  
              this.selectedUnit.gameObject.setData({hasMovementTiles: true});
              console.log("Legal Movement: ", this.legalMovement);
            }
          }
  
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.p) && this.movementGrid) {
            console.log('test')
            //Confirm movement is valid
            if (
              this.legalMovement.filter(
                (coords) =>
                  coords.x === this.player.getData("coordX") &&
                  coords.y === this.player.getData("coordY")
              ).length > 0
            ) {
              //findMovementPath
              this.pathingArray = [];
              let direction = findDirection({x: this.player.getData('coordX'), y: this.player.getData('coordY')}, {x: this.selectedUnit.gameObject.getData('coordX'), y: this.selectedUnit.gameObject.getData('coordY')})
              //Decide the starting direction of the findMovementPath algorithm
              const decideOrientation = () => {
                if (this.selectedUnit.gameObject.getData('coordX') === this.player.getData('coordX') && this.selectedUnit.gameObject.getData('coordY') === this.player.getData('coordY')) {
                  this.pathingArray.push({ x: this.player.getData('coordX'), y: this.player.getData('coordY')});
                  this.selectedUnit.gameObject.setData({direction: null});
                  return;
                }

                if (direction === 'up') {
                  moveTracker('up');
                  if (findMovementPath('down', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('left');
                  if (findMovementPath('right', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('down');
                  if (findMovementPath('up', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('right');
                  if (findMovementPath('left', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                }
                if (direction === 'down') {
                  moveTracker('down');
                  if (findMovementPath('up', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('right');
                  if (findMovementPath('left', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('up');
                  if (findMovementPath('down', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('left');
                  if (findMovementPath('right', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                }
                if (direction === 'right') {
                  moveTracker('right');
                  if (findMovementPath('left', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('up');
                  if (findMovementPath('down', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('left');
                  if (findMovementPath('right', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('down');
                  if (findMovementPath('up', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                }
                if (direction === 'left') {
                  moveTracker('left');
                  if (findMovementPath('right', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('down');
                  if (findMovementPath('up', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('right');
                  if (findMovementPath('left', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                  moveTracker('up');
                  if (findMovementPath('down', 0, this.selectedUnit.gameObject.getData('movement')+ 1, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                }
              }
              decideOrientation();
              console.log(this.pathingArray);
  
              //Cleanup movement grid
              for (const sprite of this.movementGrid) {
                sprite.destroy();
              }
              this.tileMoves = this.pathingArray.length - 1;
              this.movingUnit = this.selectedUnit;
              moveUnit(this.selectedUnit, this.pathingArray, this.tileMoves)
              this.isMoving = true;
              this.legalMovement = [];
            }
          }
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Attacking //
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Check if unit has moved
        } else if (this.selectedUnit.gameObject.getData('hasMoved') && !this.selectedUnit.gameObject.getData('hasAttacked')) {
          if (!this.selectedUnit.gameObject.getData("hasAttackTiles")) {
          // If yes, check if the surrounding tiles are valid to put the red tiles on. Generate red tiles based on previous check.
          const x1 = [1, 0, -1, 0];
          const y1 = [0, 1, 0, -1];
          // For Ranged Characters
          const x2 = [];
          const y2 = [];
  
          this.attackTiles = [];
          this.attackGrid = [];
          
          for (let i in x1) {
            // Do this by calling invalidTiles array. Check whether the tiles are OOB also.
            if (this.invalidTiles.filter(
              (coords) =>
                coords.x === this.selectedUnit.gameObject.getData("coordX") + x1[i] &&
                coords.y === this.selectedUnit.gameObject.getData("coordY") + y1[i]
              ).length === 0 && 
              this.selectedUnit.gameObject.getData("coordX") + x1[i] >= 0 &&
              this.selectedUnit.gameObject.getData("coordX") + x1[i] <= 15 &&
              this.selectedUnit.gameObject.getData("coordY") + y1[i] >= 0 &&
              this.selectedUnit.gameObject.getData("coordY") + y1[i] <= 15) {
                // If no, generate red tiles and make the enemy targetable.
                this.attackGrid.push(this.add.sprite(
                  this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + x1[i]][this.selectedUnit.gameObject.getData('coordY') + y1[i]].x, 
                  this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + x1[i]][this.selectedUnit.gameObject.getData('coordY') + y1[i]].y + 16,
                  "attack-tile",
                ));
               this.attackTiles.push({ x: this.selectedUnit.gameObject.getData('coordX') + x1[i], y: this.selectedUnit.gameObject.getData('coordY') + y1[i]});
              }
            }
            this.selectedUnit.gameObject.setData({ hasAttackTiles: true });
            console.log("Attack Grid: ", this.attackTiles);
          }
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.k)) {
            if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.enemies.includes(closest.gameObject) && this.attackTiles.filter(
              (coords) =>
              coords.x === this.player.getData("coordX") &&
              coords.y === this.player.getData("coordY")
              ).length > 0) {
                // Open the enemy UI, check the UI is open.
                this.setMeterPercentage2(closest.gameObject.getData("hit_points"));
                closest.gameObject.setData({ hasUiOpen: true });
                this.uiBackground2.visible = true;
                this.skeleton_soldier_portrait.visible = true;
                this.healthBarEmpty2.visible = true;
                this.healthBar2.visible = true;
                this.uiText2.setText([
                  "HP: " + closest.gameObject.getData("hit_points") + "/" + this.skeleton_soldier.getData("total_hit_points"),
                  "Movement: " + closest.gameObject.getData("movement"),
                ]);
            }
              // Click a button to confirm your attack and launch an attack on the enemy. It should only work if you select a valid tile.
              // Play the attack animation, reduce hit points of skeleton.
          }
  
          if (this.enemies.includes(closest.gameObject) && closest.gameObject.getData('hasUiOpen') && Phaser.Input.Keyboard.JustDown(this.inputKeys.l)) {
            for (const sprite of this.attackGrid) {
              sprite.destroy();
            }
            // Dynamic animations:
            this.selectedUnit.gameObject.play("dragon_knight_attacking_anim1");
            this.selectedUnit.gameObject.playAfterRepeat("dragon_knight_idle_anim1");
            closest.gameObject.play("skeleton_damage_anim1");
            closest.gameObject.setData({ hit_points: closest.gameObject.getData('hit_points') - 25 });
            this.uiText2.setText([
              `HP: ${closest.gameObject.getData("hit_points")}/${closest.gameObject.getData("total_hit_points")}`,
              "Movement: " + this.skeleton_soldier.getData("movement"),
            ]);
            this.setMeterPercentage2(closest.gameObject.getData("hit_points"));
            this.selectedUnit.gameObject.setData({ hasAttacked: true });
            this.selectedUnit.gameObject.setData({ hasAttackTiles: false });
            this.selectedUnit.gameObject.setData({ turn: false });
            closest.gameObject.setData({ hasUiOpen: false });
            if (closest.gameObject.getData("hit_points") === 0) {
              closest.gameObject.play("skeleton_damage_anim1");
              closest.gameObject.playAfterRepeat("skeleton_laying_down_anim1");
              this.uiText2.setText([
                "HP: 0/" + closest.gameObject.getData("total_hit_points"),
                "Movement: " + closest.gameObject.getData("movement"),
              ]);
              this.time.addEvent({
                delay: 2000,
                callback: () => {
                  this.selectedUnit.gameObject.setData({ hasAttacked: true });
                  this.selectedUnit.gameObject.setData({ hasAttackTiles: false });
                  this.selectedUnit.gameObject.setData({ turn: false });
                  closest.gameObject.setData({ hasUiOpen: false });
                  this.uiBackground2.visible = false;
                  this.skeleton_soldier_portrait.visible = false;
                  this.healthBarEmpty2.visible = false;
                  this.healthBar2.visible = false;
                  this.uiText2.setText([""]);
                  // Replace the game object with a sprite at the coords of knocked out, remove enemy from enemy array.
                }
              });
            }
          }
        }
  
        //load ui
        this.uiBackground1.visible = true;
        this.dragon_knight_portrait.visible = true;
        this.healthBarEmpty1.visible = true;
        this.healthBar1.visible = true;
  
        if (this.selectedUnit.gameObject.getData("hit_points") <= 0) {
          this.uiText1.setText([
            "HP: 0/" + this.selectedUnit.gameObject.getData("total_hit_points"),
            "Movement: " + this.selectedUnit.gameObject.getData("movement"),
          ]);
        } else {
          this.uiText1.setText([
            "HP: " + this.selectedUnit.gameObject.getData("hit_points") + "/" + this.selectedUnit.gameObject.getData("total_hit_points"),
            "Movement: " + this.selectedUnit.gameObject.getData("movement"),
          ]);
          this.setMeterPercentage1(this.selectedUnit.gameObject.getData("hit_points"));
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //ENEMY PHASE//
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (this.phase === 'enemy') {
      let enemy = this.enemies[this.enemyCount];

      //Generate legalMovement
      if (!this.legalMovement) {
        this.tracker.setData({coordX: enemy.getData("coordX"), coordY: enemy.getData("coordY")});
        this.tracker.x = enemy.x;
        this.tracker.y = enemy.y;
        this.legalMovement = [];
        this.movementGrid = [];
  
        moveTracker('up');
        findPath('down', 0, enemy.getData('movement')+ 1);
  
        moveTracker('down');
        findPath('up', 0, enemy.getData('movement')+ 1);
        
        moveTracker('left');
        findPath('right', 0, enemy.getData('movement')+ 1);
        
        moveTracker('right');
        findPath('left', 0, enemy.getData('movement')+ 1);

        console.log(this.legalMovement);
      }

      //  Attack lowest hp and closest if in range
      //  Attack closest if in range
      //  Go toward lowest hp if out of range
      //  Go toward closest if out of range
      
      const inRange = (allyCoords) => {
        if (this.legalMovement.filter((coords) => coords.x === allyCoords.x + 1 && coords.y === allyCoords.y).length > 0) {
          return true;
        }
        if (this.legalMovement.filter((coords) => coords.x === allyCoords.x - 1 && coords.y === allyCoords.y).length > 0) {
          return true;
        }
        if (this.legalMovement.filter((coords) => coords.x === allyCoords.x && coords.y === allyCoords.y + 1).length > 0) {
          return true;
        }
        if (this.legalMovement.filter((coords) => coords.x === allyCoords.x && coords.y === allyCoords.y - 1).length > 0) {
          return true;
        }
        return false;
      }
        //Return an array of Ally health values
        const healthArray = () => {
          const output = [];
          for (const ally of this.allies) {
            output.push(ally.getData('hit_points'));
          }
          return output;
        }
        const alliesHealth = healthArray();

        //Return allies in range of enemy
        const alliesInRange = this.allies.filter((ally) => {
          return inRange({x: ally.getData('coordX'), y: ally.getData('coordY')});
        });

        // Find the closest ally with the lowest health to target.
        const lowHealthAllies = this.allies.filter((ally) => {
          return ally.getData('hit_points') === Math.min(...alliesHealth);
        });

        //Physics group of low health allies
        const lowHealthAlliesGroup = this.physics.add.group(); 
        for (const ally of lowHealthAllies) {
          lowHealthAlliesGroup.add(ally);
        }

        if (!this.enemyPrep) {
          // Find the closest ally to target.
          this.closestAlly = this.physics.closest(enemy, this.alliesGroup.children.entries);
  
          //Closest low health ally
          this.closestLowHealthAlly = this.physics.closest(enemy, lowHealthAlliesGroup.children.entries);
          this.enemyPrep = true;
        }

      if (!this.hasMoved) {
        //Check if allies are in range
        if (alliesInRange.length > 0) {
          console.log(alliesInRange)
          //Check if low health allies are in range
          if (alliesInRange.includes(this.closestLowHealthAlly)) {
            // Move towards lowest health ally, and attack
            console.log(this.closestLowHealthAlly.getData('coordX'), this.closestLowHealthAlly.getData('coordY'));
            const viableMoves = this.legalMovement.filter((move) => {
                if (
                  move.x === this.closestLowHealthAlly.getData('coordX') + 1 && move.y === this.closestLowHealthAlly.getData('coordY') ||
                  move.x === this.closestLowHealthAlly.getData('coordX') - 1 && move.y === this.closestLowHealthAlly.getData('coordY') ||
                  move.x === this.closestLowHealthAlly.getData('coordX') && move.y === this.closestLowHealthAlly.getData('coordY') + 1 ||
                  move.x === this.closestLowHealthAlly.getData('coordX') && move.y === this.closestLowHealthAlly.getData('coordY') - 1
                ) {
                  return true;
                }
                return false;
            });
            
            //findMovementPath
            this.pathingArray = [];
            console.log(viableMoves)
            let direction = findDirection(viableMoves[0], {x: enemy.getData('coordX'), y: enemy.getData('coordY')});
            //Decide the starting direction of the findMovementPath algorithm
            const decideOrientation = () => {
              if (enemy.getData('coordX') === viableMoves[0].x && enemy.getData('coordY') === viableMoves[0].y) {
                this.pathingArray.push(viableMoves[0]);
                enemy.setData({direction: null});
                return;
              }

              if (direction === 'up') {
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
              }
              if (direction === 'down') {
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
              }
              if (direction === 'right') {
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
              }
              if (direction === 'left') {
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: viableMoves[0].x, y: viableMoves[0].y})) {return}
              }
            }
            decideOrientation();
            console.log(this.pathingArray);

            this.tileMoves = this.pathingArray.length - 1;
            this.movingUnit = enemy;
            moveEnemyUnit(enemy, this.pathingArray, this.tileMoves);
            this.isMoving = true;
            this.legalMovement = [];
          }
        } else if (!this.isMoving) {
          //Sort legalMovement by distance from coordinate
          if (!this.closestMove) {

              let closest;
              let closestDistance;
              for (const coord of this.legalMovement) {
                if (!closest) {
                  closest = coord;
                  closestDistance = Math.abs((this.closestAlly.getData('coordX') - coord.x)) + Math.abs((this.closestAlly.getData('coordY') - coord.y));
                } else {
                  let distance = Math.abs((this.closestAlly.getData('coordX') - coord.x)) + Math.abs((this.closestAlly.getData('coordY') - coord.y));

                  if (distance <= closestDistance) {
                    closest = coord;
                    closestDistance = Math.abs((this.closestAlly.getData('coordX') - coord.x)) + Math.abs((this.closestAlly.getData('coordY') - coord.y));
                  }
                }
              }
              console.log(this.legalMovement)
              this.closestMove = closest;
              console.log(this.closestMove)

              //findMovementPath
            this.pathingArray = [];
            let direction = findDirection(this.closestMove, {x: enemy.getData('coordX'), y: enemy.getData('coordY')});
            //Decide the starting direction of the findMovementPath algorithm
            const decideOrientation = () => {
              if (direction === 'up') {
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
              }
              if (direction === 'down') {
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
              }
              if (direction === 'right') {
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
              }
              if (direction === 'left') {
                moveTracker('left');
                if (findMovementPath('right', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, enemy.getData('movement')+ 1, {x: this.closestMove.x, y: this.closestMove.y})) {return}
              }
            }
            decideOrientation();
            console.log(this.pathingArray);

            this.tileMoves = this.pathingArray.length - 1;
            this.movingUnit = enemy;
            moveEnemyUnit(enemy, this.pathingArray, this.tileMoves);
            this.isMoving = true;
            this.legalMovement = [];
            enemy.setData({ hasAttacked: true });
            
            //Cleanup
            this.enemyCount += 1;
            this.hasMoved = false;
            this.hasAttacked = false;
            this.legalMovement = undefined;
            this.closestMove = undefined;
            this.enemyPrep = undefined;
          }
        }
      }
      
      // Check if enemy has attacked.
      if (this.hasMoved && !this.hasAttacked) {
        // Open the enemy UI, check the UI is open.
        this.setMeterPercentage1(this.closestLowHealthAlly.getData("hit_points"));
        this.closestLowHealthAlly.setData({ hasUiOpen: true });
        this.uiBackground1.visible = true;
        this.dragon_knight_portrait.visible = true;
        this.healthBarEmpty1.visible = true;
        this.healthBar1.visible = true;
        this.uiText1.setText([
          "HP: " + this.closestLowHealthAlly.getData("hit_points") + "/" + this.closestLowHealthAlly.getData("total_hit_points"),
          "Movement: " + this.closestLowHealthAlly.getData("movement"),
        ]);
          // Click a button to confirm your attack and launch an attack on the enemy. It should only work if you select a valid tile.
          // Play the attack animation, reduce hit points of skeleton.

        if (this.closestLowHealthAlly.getData('hasUiOpen')) {
          // Play attack animation and then idle after
          // this.selectedUnit.gameObject.playAfterRepeat("dragon_knight_idle_anim1");
          this.closestLowHealthAlly.play("dragon_knight_damage_anim1");
          this.closestLowHealthAlly.playAfterRepeat("dragon_knight_idle_anim1");
          this.closestLowHealthAlly.setData({ hit_points: this.closestLowHealthAlly.getData('hit_points') - 25 });
          this.uiText1.setText([
            `HP: ${this.closestLowHealthAlly.getData("hit_points")}/${this.closestLowHealthAlly.getData("total_hit_points")}`,
            "Movement: " + this.closestLowHealthAlly.getData("movement"),
          ]);
          this.setMeterPercentage1(this.closestLowHealthAlly.getData("hit_points"));
          this.hasAttacked = true;
          this.closestLowHealthAlly.setData({ hasUiOpen: false });
          if (this.closestLowHealthAlly.getData("hit_points") === 0) {
            this.closestLowHealthAlly.play("dragon_knight_damage_anim1");
            this.closestLowHealthAlly.playAfterRepeat("dragon_knight_laying_down_anim1");
            this.uiText1.setText([
              "HP: 0/" + this.closestLowHealthAlly.getData("total_hit_points"),
              "Movement: " + this.closestLowHealthAlly.getData("movement"),
            ]);
            this.time.addEvent({
              delay: 2000,
              callback: () => {
                //this never executes
                this.hasAttacked = true;
                this.closestLowHealthAlly.setData({ hasUiOpen: false });
                this.uiBackground1.visible = false;
                this.dragon_knight_portrait.visible = false;
                this.healthBarEmpty1.visible = false;
                this.healthBar1.visible = false;
                this.uiText1.setText([""]);
                // Remove ally from ally array, replace with sprite at coords of knocked out.
              }
            });
          }
          //Cleanup
          this.enemyCount += 1;
          this.hasMoved = false;
          this.hasAttacked = false;
          this.legalMovement = undefined;
          this.closestMove = undefined;
          this.enemyPrep = undefined;
        }
      }

      // For every enemy that has completed its turn, increment by 1.

      // Check that each enemy has moved.
      if (this.enemyCount === this.enemyTotal) {
        this.phase = 'player';
        this.enemyCount = 0;
      }
    }
  }
}