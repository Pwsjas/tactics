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
    let invalidTiles = [];
    let pathingArray = [];
    let attackTiles = [];
    let attackGrid = [];
  }

  // Preload assets into the game engine.
  preload() {
    // Preload the background
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
    // this.load.spritesheet(
    //   "skeleton_upright_idle",
    //   "assets/skeleton/skeleton-upright-idle.png",
    //   { frameWidth: 32, frameHeight: 32 }
    // );
    // this.load.spritesheet(
    //   "skeleton_upright_idle",
    //   "assets/skeleton/skeleton-upright-idle.png",
    //   { frameWidth: 32, frameHeight: 32 }
    // );
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
      "skeleton_downright_laying_dowm",
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

    this.player = this.physics.add.sprite(
      this.coordinateGrid[0][0].x,
      this.coordinateGrid[0][0].y,
      "cursor"
    );
    this.player.setData({
      coordX: 0,
      coordY: 0,
    });

    // Assign placement for dragon_knight game object on the map.
    this.dragon_knight = this.physics.add.sprite(
      this.coordinateGrid[3][3].x,
      this.coordinateGrid[3][3].y,
      "dragon_knight_downright_idle"
    );
    this.dragon_knight2 = this.physics.add.sprite(
      this.coordinateGrid[1][6].x,
      this.coordinateGrid[1][6].y,
      "dragon_knight_downleft_idle"
    );

    // Assign placement for skeleton game object on the map.
    this.skeleton_soldier = this.physics.add.sprite(
      this.coordinateGrid[8][2].x,
      this.coordinateGrid[8][2].y,
      "skeleton_downright_idle"
    );

    this.skeleton_soldier2 = this.physics.add.sprite(
      this.coordinateGrid[3][4].x,
      this.coordinateGrid[3][4].y,
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

    this.healthBarEmpty2 = this.add.image(836, 260, 'health-bar-empty').setOrigin(0, 0.5).setScale(0.4);
    this.healthBarEmpty2.displayWidth = 100;

    // Actual health bar that changes
    this.healthBar1 = this.add.image(344, 260, 'health-bar').setOrigin(0, 0.5).setScale(0.4);

    this.healthBar2 = this.add.image(836, 260, 'health-bar').setOrigin(0, 0.5).setScale(0.4);
    
	  this.setMeterPercentage1(100);
    this.setMeterPercentage2(100);

    // Create text for the character UI
    this.uiText1 = this.add.text(342, 274, "", { color: 'white' });
    this.uiText2 = this.add.text(837, 274, "", { color: 'white' });

    // Set UI to invisible until a unit is selected.
    this.uiBackground1.visible = false;
    this.uiBackground2.visible = true;
    this.dragon_knight_portrait.visible = false;
    this.healthBarEmpty1.visible = false;
    this.healthBar1.visible = false;
    this.healthBarEmpty2.visible = true;
    this.healthBar2.visible = true;

    // Assign data to the dragon_knight game object.
    this.dragon_knight.setData({
      direction: "left",
      turn: true,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
      hasMoved: false,
      hasMovementTiles: false,
      hasAttacked: false,
      hasAttackTiles: false,
      coordX: 3,
      coordY: 3,
    });

    this.dragon_knight2.setData({
      direction: "right",
      turn: true,
      movement: 3,
      total_hit_points: 100,
      hit_points: 100,
      hasMoved: false,
      hasMovementTiles: false,
      hasAttacked: false,
      hasAttackTiles: false,
      coordX: 1,
      coordY: 6,
    });

    this.skeleton_soldier.setData({
      direction: "right",
      turn: false,
      movement: 3,
      total_hit_points: 75,
      hit_points: 75,
      coordX: 8,
      coordY: 2,
    });

    this.skeleton_soldier2.setData({
      direction: "right",
      turn: false,
      movement: 3,
      total_hit_points: 75,
      hit_points: 75,
      coordX: 3,
      coordY: 4,
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


    // Play those animations.
    this.dragon_knight.play("dragon_knight_idle_anim1");
    this.dragon_knight2.play("dragon_knight_idle_anim2");
    this.skeleton_soldier.play("skeleton_idle_anim1");
    this.skeleton_soldier2.play("skeleton_idle_anim2");
    this.dragon_knight_portrait.play("dragon_knight_idle_anim1");
    this.skeleton_soldier_portrait.play("skeleton_idle_anim2");

    this.uiText2.setText([
      "HP: " + this.skeleton_soldier.getData("hit_points") + "/" + this.skeleton_soldier.getData("total_hit_points"),
      "Movement: " + this.skeleton_soldier.getData("movement"),
    ]);

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
    });

    this.allies = [this.dragon_knight, this.dragon_knight2];
    this.enemies = [this.skeleton_soldier, this.skeleton_soldier2];

    this.physics.world.step(0);
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

  update() {
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
      console.log(destination, location)
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

    //Find shortest path from selectedUnit to destination(cursor), return array of tiles leading from A to B
    const findMovementPath = (prevDirection, moveCount, totalMoves, destination) => {
      console.log("I looped!");
      console.log(`
      Tracker position
      ${this.tracker.getData('coordX')}, 
      ${this.tracker.getData('coordY')}
      `)
      
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
      console.log(direction);

      //Check valid tile
      if (this.legalMovement.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length <= 0) {
        console.log("INVALID");
        //set tracker to prevDirection
        if (prevDirection === 'left') {
          moveTracker('left');
        }
        if (prevDirection === 'right') {
          moveTracker('right');
        }
        if (prevDirection === 'up') {
          moveTracker('up');
        }
        if (prevDirection === 'down') {
          moveTracker('down');
        }
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

    console.log(this.player.getData("coordX"), this.player.getData("coordY"));
    let closest = this.physics.closest(this.player, Phaser.GameObject);
    let closestTracker = this.physics.closest(this.tracker, Phaser.GameObject);

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
    if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.allies.includes(closest.gameObject)) {
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
        this.selectedUnit = closest;
      }
    }

    if (this.selectedUnit) {

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MOVEMENT //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //check if unit has moved this turn
      if (!this.selectedUnit.gameObject.getData("hasMoved")) {
        //check if unit has movement tiles rendered around them
        if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.p)) {
            this.tracker.setData({coordX: this.player.getData("coordX"), coordY: this.player.getData("coordY")});
            this.tracker.x = this.player.x;
            this.tracker.y = this.player.y;
            this.legalMovement = [];
            this.movementGrid = [];
    
            const findPath = (prevDirection, moveCount, totalMoves) => {
              closestTracker = this.physics.closest(this.tracker, Phaser.GameObject);
              //return if moveCount reached
              if (moveCount === totalMoves) {
                if (prevDirection === 'left') {
                  moveTracker('left');
                }
                if (prevDirection === 'right') {
                  moveTracker('right');
                }
                if (prevDirection === 'up') {
                  moveTracker('up');
                }
                if (prevDirection === 'down') {
                  moveTracker('down');
                }
                return;
              }
    
              //Check if new location is valid ???
              if ((
                this.tracker.x === closestTracker.gameObject.x && this.tracker.y === closestTracker.gameObject.y)
                ||
                (this.invalidTiles.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length > 0
                ||
                this.tracker.getData('coordX') < 0
                ||
                this.tracker.getData('coordY') < 0
                )) {
                //set tracker to prevDirection
                if (prevDirection === 'left') {
                  moveTracker('left');
                }
                if (prevDirection === 'right') {
                  moveTracker('right');
                }
                if (prevDirection === 'up') {
                  moveTracker('up');
                }
                if (prevDirection === 'down') {
                  moveTracker('down');
                }
                return;
              }
    
              //Repeat in every  direciton, except origin direction
              if (prevDirection === 'left') {
                moveTracker('up');
                findPath('down', moveCount + 1, totalMoves);
    
                moveTracker('right');
                findPath('left', moveCount + 1, totalMoves);
    
                moveTracker('down');
                findPath('up', moveCount + 1, totalMoves);
              }
              if (prevDirection === 'right') {
                moveTracker('up');
                findPath('down', moveCount + 1, totalMoves);
    
                moveTracker('left');
                findPath('right', moveCount + 1, totalMoves);
    
                moveTracker('down');
                findPath('up', moveCount + 1, totalMoves);
              }
              if (prevDirection === 'down') {
                moveTracker('up');
                findPath('down', moveCount + 1, totalMoves);
    
                moveTracker('right');
                findPath('left', moveCount + 1, totalMoves);
    
                moveTracker('left');
                findPath('right', moveCount + 1, totalMoves);
              }
              if (prevDirection === 'up') {
                moveTracker('left');
                findPath('right', moveCount + 1, totalMoves);
    
                moveTracker('right');
                findPath('left', moveCount + 1, totalMoves);
    
                moveTracker('down');
                findPath('up', moveCount + 1, totalMoves);
              }
              //Set Tracker to prevDirection
              if (prevDirection === 'left') {
                moveTracker('left');
              }
              if (prevDirection === 'right') {
                moveTracker('right');
              }
              if (prevDirection === 'up') {
                moveTracker('up');
              }
              if (prevDirection === 'down') {
                moveTracker('down');
              }
              
              //Check if sprite already exists
              if (this.legalMovement.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length > 0) {
                return;
              }
    
              //Add location to legalMovement
              this.legalMovement.push({x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')});
    
              //Render sprite and add it to this.movementGrid
              this.movementGrid.push(this.add.sprite(
                this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].x,
                this.coordinateGrid[this.tracker.getData('coordX')][this.tracker.getData('coordY')].y + 16,
                "movement-tile"
              ));
    
              return;
            }
            let temporaryTracker = {x: this.tracker.getData('coordX'), y: this.tracker.getData('coordY')}
            moveTracker('up');
            findPath('down', 0, 5);
    
            moveTracker('down');
            findPath('up', 0, 5);
    
            moveTracker('right');
            findPath('left', 0, 5); 
    
            moveTracker('left');
            findPath('right', 0, 5);

            this.selectedUnit.gameObject.setData({hasMovementTiles: true});
          }
        }

        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
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
            console.log('TRACKER', this.tracker.getData('coordX'), this.tracker.getData('coordY'))
            console.log(direction);
            const decideOrientation = () => {
              if (direction === 'up') {
                moveTracker('up');
                if (findMovementPath('down', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
              }
              if (direction === 'down') {
                moveTracker('down');
                if (findMovementPath('up', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
              }
              if (direction === 'right') {
                moveTracker('right');
                if (findMovementPath('left', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('left');
                if (findMovementPath('right', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
              }
              if (direction === 'left') {
                moveTracker('left');
                if (findMovementPath('right', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('down');
                if (findMovementPath('up', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('right');
                if (findMovementPath('left', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
                moveTracker('up');
                if (findMovementPath('down', 0, 5, {x: this.player.getData('coordX'), y: this.player.getData('coordY')})) {return}
              }
            }
            decideOrientation();
            console.log(this.pathingArray);
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
      // Attacking

      // Check if unit has moved
      } else if (this.selectedUnit.gameObject.getData('hasMoved')) {
        if (!this.selectedUnit.gameObject.getData("hasAttackTiles")) {
        console.log("I moved!");
        // If yes, check if the surrounding tiles are valid to put the red tiles on. Generate red tiles based on previous check.
        const x1 = [1, 0, -1, 0];
        const y1 = [0, 1, 0, -1];
        // For Ranged Characters
        const x2 = [];
        const y2 = [];

        this.attackTiles = [];
        this.attackGrid = [];
        
        for (let i in x1) {
          console.log("In the loop.")
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
              // If yes, generate red tiles and make the enemy targetable.
              console.log("Adding Sprites");
              this.attackGrid.push(this.add.sprite(
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + x1[i]][this.selectedUnit.gameObject.getData('coordY') + y1[i]].x, 
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX') + x1[i]][this.selectedUnit.gameObject.getData('coordY') + y1[i]].y + 16,
                "attack-tile",
              ));
             this.attackTiles.push({ x: this.selectedUnit.gameObject.getData('coordX') + x1[i], y: this.selectedUnit.gameObject.getData('coordY') + y1[i] });
            }
          }
          this.selectedUnit.gameObject.setData({ hasAttackTiles: true });
        }
        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.k)) {
          if (this.enemies.includes(closest.gameObject) && this.attackTiles.filter(
            (coords) =>
              coords.x === this.player.getData("coordX") &&
              coords.y === this.player.getData("coordY")
          ).length > 0) {
            // Open the enemy UI, and then attack. Check the UI is open, and then confirm attack.
            // Play the attack animation,
            // Play the damage animation,
            // Deal damage.
            closest.gameObject.setData({ hit_points: closest.gameObject.getData('hit_points') - 25 });
            for (const sprite of this.attackGrid) {
              sprite.destroy();
            }
          }
        
            // Click a button to confirm your attack and launch an attack on the enemy. It should only work if you select a valid tile.
              // Play the attack animation, reduce hit points of skeleton.
        }
            // After attack, end turn for the selected unit.
          // If no, end the unit's turn.
      }
          // Before animation, UI.
          // After this, animation time.

      // //check if unit has moved this turn
      // if (!this.selectedUnit.gameObject.getData("hasMoved")) {
      //   //check if unit has movement tiles rendered around them
      //   if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
      //     this.movementGrid = [];
      //     this.legalMovement = [];
      //     for (let i = 0; i < 25; i++) {
      //       const relationsX = [
      //         3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1,
      //         -1, -2, -2, -2, -3,
      //       ];
      //       const relationsY = [
      //         0, 1, 0, -1, 2, 1, 0, -1, -2, 3, 2, 1, 0, -1, -2, -3, 2, 1, 0, -1,
      //         -2, 1, 0, -1, 0,        console.log('loop 1')
      //       ];

      //       //Check out of bounds
      //       if (
      //         this.selectedUnit.gameObject.getData("coordX") + relationsX[i] <
      //         0 ||
      //         this.selectedUnit.gameObject.getData("coordX") + relationsX[i] >
      //         15 ||
      //         this.selectedUnit.gameObject.getData("coordY") + relationsY[i] <
      //         0 ||
      //         this.selectedUnit.gameObject.getData("coordY") + relationsY[i] >
      //         15
      //       ) {
      //         //Add movement tile sprites
      //       } else {
      //         this.movementGrid.push(
      //           this.add.sprite(this.coordinateGrid[
      //             this.selectedUnit.gameObject.getData("coordX") + relationsX[i]
      //           ][
      //             this.selectedUnit.gameObject.getData("coordY") + relationsY[i]
      //           ].x,
      //             this.coordinateGrid[
      //               this.selectedUnit.gameObject.getData("coordX") + relationsX[i]
      //             ][
      //               this.selectedUnit.gameObject.getData("coordY") + relationsY[i]
      //             ].y + 16,
      //             "movement-tile"
      //           )
      //         );

      //         //Create legal movement array
      //         this.legalMovement.push({
      //           x:
      //             this.selectedUnit.gameObject.getData("coordX") +
      //             relationsX[i],
      //           y:
      //             this.selectedUnit.gameObject.getData("coordY") +
      //             relationsY[i],
      //         });
      //       }
      //     }
      //     console.log(this.legalMovement);
      //     console.log(this.movementGrid);
      //     this.selectedUnit.gameObject.setData({ hasMovementTiles: true });
      //   }
      //   //Check for movement input
      //   if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
      //     //Confirm movement is valid
      //     if (
      //       this.legalMovement.filter(
      //         (coords) =>
      //           coords.x === this.player.getData("coordX") &&
      //           coords.y === this.player.getData("coordY")
      //       ).length > 0
      //     ) {
      //       //Move selectedUnit
      //       this.selectedUnit.gameObject.x =
      //         this.coordinateGrid[this.player.getData("coordX")][
      //           this.player.getData("coordY")
      //         ].x;
      //       this.selectedUnit.gameObject.y =
      //         this.coordinateGrid[this.player.getData("coordX")][
      //           this.player.getData("coordY")
      //         ].y;
      //       this.selectedUnit.gameObject.setData({ hasMoved: true });

      //       //Set new Coordinates
      //       this.selectedUnit.gameObject.setData({
      //         coordX: this.player.getData("coordX"),
      //       });
      //       this.selectedUnit.gameObject.setData({
      //         coordY: this.player.getData("coordY"),
      //       });

      //       //Cleanup movement grid
      //       for (const sprite of this.movementGrid) {
      //         sprite.destroy();
      //       }
      //     }
      //   }
      // }

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
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.h)) {
        this.selectedUnit.gameObject.play("dragon_knight_damage_anim1");
        this.selectedUnit.gameObject.playAfterRepeat("dragon_knight_idle_anim1");
        this.selectedUnit.gameObject.setData({ hit_points: this.selectedUnit.gameObject.getData("hit_points") - 25 });
        this.setMeterPercentage1(this.selectedUnit.gameObject.getData("hit_points"));
        this.uiText1.setText([
          `HP: ${this.selectedUnit.gameObject.getData("hit_points")}/${this.selectedUnit.gameObject.getData("total_hit_points")}`
        ]);
        if (this.selectedUnit.gameObject.getData("hit_points") === 0) {
          this.selectedUnit.gameObject.play("dragon_knight_damage_anim1");
          this.selectedUnit.gameObject.playAfterRepeat("dragon_knight_laying_down_anim1");
          this.uiText1.setText([
            "HP: 0/" + this.selectedUnit.gameObject.getData("total_hit_points"),
            "Movement: " + this.selectedUnit.gameObject.getData("movement"),
          ]);
          this.selectedUnit = undefined;
        }
      }
    }
  }
}