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
    let liftedTiles = [];

    //# of movements for the current movement sequence
    let tileMoves;
    let movingUnit;
    let pathingArray = [];
    let attackTiles = [];
    let attackGrid = [];
    let isMoving = false;
    let finishMove = false;
    let finishAttack = false;

    let phase;
    let enemyCount;
    let enemyTotal;
    let allyCount;
    let allyTotal;
    let sortedLegalMovement;
    let closestMove;
    let hasMoved;
    let hasAttacked;
    let enemyPrep;

    let closestAlly;
    let closestLowHealthAlly
    let alliesInRange;

    let map;
    let mapShift;
    let tileName;

  }

  init(data) {
    this.map = data.map;
    this.team = data.team;
    this.cameras.main.fadeIn(2000, 0, 0, 0)
  }

  // Preload assets into the game engine.
  preload() {
    //Preload UI
    this.load.image('ui1', 'assets/ui/ui1.png');
    this.load.image('ui2', 'assets/ui/ui2.png');

    // Images for the empty
    this.load.image('health-bar', 'assets/ui/ui-health-bar.png')
    this.load.image('health-bar-empty', 'assets/ui/ui-empty-health-bar.png')

    //Load tilemap.png
    this.load.image("tiles", "assets/tilemap.png");

    //Load tilemap.json based on map selections
    if (this.map === 'desert') {
      this.load.tilemapTiledJSON("tilemap16", "assets/desert-zone.json");
    }
    
    if (this.map === 'water') {
      this.load.tilemapTiledJSON("tilemap16", "assets/water-land.json");
    }

    if (this.map === 'lava') {
      this.load.tilemapTiledJSON("tilemap16", "assets/lava-world.json");
    }

    // Preload the cursor and movement tile assets and assign it as a controllable character.
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("movement-tile", "assets/movement-tile.png");
    this.load.image("attack-tile", "assets/attack-tile.png");
    this.load.image("character", "assets/cursor.png");

    const spriteSheetLoader = (unit, unitDash) => {
      this.load.spritesheet(
        `${unit}_downright_idle`,
        `assets/${unitDash}/${unitDash}-downright-idle.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downleft_idle`,
        `assets/${unitDash}/${unitDash}-downleft-idle.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upright_idle`,
        `assets/${unitDash}/${unitDash}-upright-idle.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upleft_idle`,
        `assets/${unitDash}/${unitDash}-upleft-idle.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downright_attacking`,
        `assets/${unitDash}/${unitDash}-downright-attacking.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downleft_attacking`,
        `assets/${unitDash}/${unitDash}-downleft-attacking.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upright_attacking`,
        `assets/${unitDash}/${unitDash}-upright-attacking.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upleft_attacking`,
        `assets/${unitDash}/${unitDash}-upleft-attacking.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downright_damage`,
        `assets/${unitDash}/${unitDash}-downright-damage.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downleft_damage`,
        `assets/${unitDash}/${unitDash}-downleft-damage.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upright_damage`,
        `assets/${unitDash}/${unitDash}-upright-damage.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upleft_damage`,
        `assets/${unitDash}/${unitDash}-upleft-damage.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downright_laying_down`,
        `assets/${unitDash}/${unitDash}-downright-laying-down.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_downleft_laying_down`,
        `assets/${unitDash}/${unitDash}-downleft-laying-down.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upright_laying_down`,
        `assets/${unitDash}/${unitDash}-upright-laying-down.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
      this.load.spritesheet(
        `${unit}_upleft_laying_down`,
        `assets/${unitDash}/${unitDash}-upleft-laying-down.png`,
        { frameWidth: 32, frameHeight: 32 }
      );
    }

    //load spritesheets
    if (this.team === 'dwarfs') {
      spriteSheetLoader('dwarf_worker', 'dwarf-worker');
      spriteSheetLoader('dwarf_blacksmith', 'dwarf-blacksmith');
      spriteSheetLoader('dwarf_captain', 'dwarf-captain');
      spriteSheetLoader('dwarf_hunter', 'dwarf-hunter');
    }
    if (this.team === 'elves') {
      spriteSheetLoader('elf_elder', 'elf-elder');
      spriteSheetLoader('elf_recruit', 'elf-recruit');
      spriteSheetLoader('elf_stalker', 'elf-stalker');
      spriteSheetLoader('elf_warrior', 'elf-warrior');
    }
    if (this.team ==='humans') {
      spriteSheetLoader('human_fighter', 'human-fighter');
      spriteSheetLoader('human_archer', 'human-archer');
      spriteSheetLoader('human_thief', 'human-thief');
      spriteSheetLoader('dragon_knight', 'dragon-knight');
    }

    if (this.map === 'lava') {
      spriteSheetLoader('demon_soldier', 'demon-soldier');
      spriteSheetLoader('demon_shaman', 'demon-shaman');
    }
    if (this.map === 'water') {
      spriteSheetLoader('orc_shogun', 'orc-shogun');
      spriteSheetLoader('orc_soldier', 'orc-soldier');
    }
    if (this.map === 'desert') {
      spriteSheetLoader('skeleton', 'skeleton');
      spriteSheetLoader('skeleton_shaman', 'skeleton-shaman');
    }
    // spriteSheetLoader('dragon_knight', 'dragon-knight');
    // spriteSheetLoader('skeleton', 'skeleton');
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

    if (this.map === 'desert') {
        //Desert Zone invalid Tiles
      this.invalidTiles = [
        {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2},
        {x: 1, y: 0}, {x: 1, y: 1},
        {x: 2, y: 0},
        {x: 4, y: 5}, {x: 4, y: 6}, 
        {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6}, {x: 5, y: 7}, 
        {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8}, 
        {x: 7, y: 4}, {x: 7, y: 5}, {x: 7, y: 6}, {x: 7, y: 7}, {x: 7, y: 8}, {x: 7, y: 9}, 
        {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7}, {x: 8, y: 8}, {x: 8, y: 9}, {x: 8, y: 10}, 
        {x: 9, y: 7}, {x: 9, y: 8}, {x: 9, y: 9}, {x: 9, y: 10}, 
        {x: 10, y:9}, 
      ];
      this.mapShift = -141;
    }

    if (this.map === 'water') {
      //Water Land Invalid Tiles
      this.invalidTiles = [
        {x: 2, y: 2}, {x: 2, y: 3},
        {x: 3, y: 2}, {x: 3, y: 3}, {x: 2, y: 3},
        {x: 4, y: 3}, {x: 4, y: 5}, {x: 4, y: 6},
        {x: 5, y: 5}, {x: 5, y: 6},
        {x: 6, y: 5}, {x: 6, y: 6},
        {x: 7, y: 12}, {x: 7, y: 13},
        {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13},
        {x: 10, y: 11}, {x: 10, y: 12}, {x: 10, y: 13},
        {x: 11, y: 9}, {x: 11, y: 12}, {x: 11, y: 13},
        {x: 12, y: 9}, {x: 12, y: 10},
        {x: 13, y: 10}, {x: 13, y: 12},
      ];
      this.mapShift = -141;
    }

    if (this.map === 'lava') {
      // Lava World Invalid Tiles
      this.invalidTiles = [
        {x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6},
        {x: 3, y: 3}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 3, y: 6},
        {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6},
        {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6},
        {x: 6, y: 3}, {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 10},
        {x: 7, y: 8}, {x: 7, y: 9}, {x: 7, y: 10},
        {x: 8, y: 8}, {x: 8, y: 8}, {x: 8, y: 10}, {x: 8, y: 11},
        {x: 9, y: 8}, {x: 9, y: 9}, {x: 9, y: 10}, {x: 9, y: 11}, {x: 9, y: 12},
        {x: 10, y: 3}, {x: 10, y: 4}, {x: 10, y: 7}, {x: 10, y: 8}, {x: 10, y: 9}, {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}, {x: 10, y: 13},
        {x: 11, y: 1}, {x: 11, y: 2}, {x: 11, y: 3}, {x: 11, y: 4}, {x: 11, y: 8}, {x: 11, y: 9}, {x: 11, y: 10}, {x: 11, y: 11}, {x: 11, y: 12},
        {x: 12, y: 2}, {x: 12, y: 3}, {x: 12, y: 4}, {x: 12, y: 5}, {x: 12, y: 9}, {x: 12, y: 10}, {x: 12, y: 11},
      ]
      this.mapShift = -144;
    }


    if (this.map === 'desert' || this.map === 'lava') {
      this.tileName = 'Gio Tiles';
      this.tileLayers = 3;
    }

    if (this.map === 'water') {
      this.tileName = 'gioTiles32';
      if (this.map === 'water') {
        this.tileLayers = 9;
      } else {
        this.tileLayers = 3;
      }
    }

    console.log(this.map);
    console.log(this.tileName);
    
    // Create the tile map based on assets.
    const map = this.make.tilemap({ key: "tilemap16" });
    const tileset = map.addTilesetImage(this.tileName, "tiles", 32, 32, 0, 0); //Changed

    // Function that determines position of the tile map on the screen, and renders the cursor over it.
    // Accepts the x and y coords of the map, as well as the size of the map in tiles. (Only works for square maps, has to be the same number of tiles on both sides.)
    for (let i = 1; i <= this.tileLayers; i++) {
      map.createLayer(`Tile Layer ${i}`, tileset, 624, this.mapShift);
    };

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
            y: y + 8 + i * 8 + j * 8,
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

    // Add HUD for holding the UI
    this.uiBackground1 = this.add.sprite(395, 304, "ui1").setScale(0.5);
    this.uiBackground2 = this.add.sprite(887, 304, "ui2").setScale(0.5);
    
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
    this.healthBarEmpty1.visible = false;
    this.healthBar1.visible = false;
    this.healthBarEmpty2.visible = false;
    this.healthBar2.visible = false;

    // Create animations for the sprites based on the spritesheet for the dragon knight.
    
    const animationCreator = (unit) => {
      this.anims.create({
        key: `${unit}_idle_anim1`,
        frames: this.anims.generateFrameNumbers(`${unit}_downright_idle`),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: `${unit}_idle_anim2`,
        frames: this.anims.generateFrameNumbers(`${unit}_downleft_idle`),
        frameRate: 5,
        repeat: -1,
      });
  
      this.anims.create({
        key: `${unit}_idle_anim3`,
        frames: this.anims.generateFrameNumbers(`${unit}_upright_idle`),
        frameRate: 5,
        repeat: -1,
      });
  
      this.anims.create({
        key: `${unit}_idle_anim4`,
        frames: this.anims.generateFrameNumbers(`${unit}_upleft_idle`),
        frameRate: 5,
        repeat: -1,
      });
  
      this.anims.create({
        key: `${unit}_attacking_anim1`,
        frames: this.anims.generateFrameNumbers(`${unit}_downright_attacking`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_attacking_anim2`,
        frames: this.anims.generateFrameNumbers(`${unit}_downleft_attacking`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_attacking_anim3`,
        frames: this.anims.generateFrameNumbers(`${unit}_upright_attacking`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_attacking_anim4`,
        frames: this.anims.generateFrameNumbers(`${unit}_upleft_attacking`),
        frameRate: 5,
        repeat: -1,
      });
  
      this.anims.create({
        key: `${unit}_damage_anim1`,
        frames: this.anims.generateFrameNumbers(`${unit}_downright_damage`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_damage_anim2`,
        frames: this.anims.generateFrameNumbers(`${unit}_downleft_damage`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_damage_anim3`,
        frames: this.anims.generateFrameNumbers(`${unit}_upright_damage`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_damage_anim4`,
        frames: this.anims.generateFrameNumbers(`${unit}_upleft_damage`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_laying_down_anim1`,
        frames: this.anims.generateFrameNumbers(`${unit}_downright_laying_down`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_laying_down_anim2`,
        frames: this.anims.generateFrameNumbers(`${unit}_downleft_laying_down`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_laying_down_anim3`,
        frames: this.anims.generateFrameNumbers(`${unit}_upright_laying_down`),
        frameRate: 5,
        repeat: 0,
      });
  
      this.anims.create({
        key: `${unit}_laying_down_anim4`,
        frames: this.anims.generateFrameNumbers(`${unit}_upleft_laying_down`),
        frameRate: 5,
        repeat: 0,
      });
    };

    if (this.team === 'dwarfs') {
      animationCreator('dwarf_worker');
      animationCreator('dwarf_blacksmith');
      animationCreator('dwarf_captain');
      animationCreator('dwarf_hunter');
    }
    if (this.team === 'elves') {
      animationCreator('elf_elder');
      animationCreator('elf_recruit');
      animationCreator('elf_stalker');
      animationCreator('elf_warrior');
    }
    if (this.team === 'humans') {
      animationCreator('human_fighter');
      animationCreator('human_archer');
      animationCreator('human_thief');
      animationCreator('dragon_knight');
    }

    if (this.map === 'desert') {
      animationCreator('skeleton');
      animationCreator('skeleton_shaman');
    }
    if (this.map === 'lava') {
      animationCreator('demon_shaman');
      animationCreator('demon_soldier');
    }
    if (this.map === 'water') {
      animationCreator('orc_shogun');
      animationCreator('orc_soldier');
    }


    // Add keyboard input.
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      p: Phaser.Input.Keyboard.KeyCodes.P,
      k: Phaser.Input.Keyboard.KeyCodes.K,
      l: Phaser.Input.Keyboard.KeyCodes.L,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      e: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.physics.world.step(1);

    // Assign a floating sprite as a character portrait and a health bar within the UI
    const createAllyPortrait = (unit) => {
      return this.add.sprite(394, 236, `${unit}_idle_anim1`).setScale(1.5);
    }

    const createEnemyPortrait = (unit) => {
      return this.add.sprite(888, 236, `${unit}_idle_anim2`).setScale(1.5);
    }

    //Generate allied and enemy units
    const generateUnit = (unitType, x, y, health) => {
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
        total_hit_points: health,
        hit_points: health,
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
        },
        allyPortrait: createAllyPortrait(unitType),
        enemyPortrait: createEnemyPortrait(unitType),
      });
      newUnit.play(newUnit.data.values.animations.down);
      newUnit.data.values.allyPortrait.play(`${unitType}_idle_anim1`);
      newUnit.data.values.enemyPortrait.play(`${unitType}_idle_anim2`);
      newUnit.data.values.allyPortrait.visible = false;
      newUnit.data.values.enemyPortrait.visible = false;
      
      return newUnit;
    };

    //Create units based on team selection
    if (this.team === "humans") {
      this.ally1 = generateUnit('human_fighter', 4, 11, 100);
      this.ally2 = generateUnit('human_archer', 2, 13, 100);
      this.ally3 = generateUnit('human_thief', 2, 11, 100);
      this.ally4 = generateUnit('dragon_knight', 4, 13, 100);
    }
    if (this.team === "dwarfs") {
      this.ally1 = generateUnit('dwarf_captain', 4, 11, 100);
      this.ally2 = generateUnit('dwarf_hunter', 2, 13, 100);
      this.ally3 = generateUnit('dwarf_worker', 2, 11, 100);
      this.ally4 = generateUnit('dwarf_blacksmith', 4, 13, 100);
    }
    if (this.team === "elves") {
      this.ally1 = generateUnit('elf_elder', 4, 11, 100);
      this.ally2 = generateUnit('elf_recruit', 2, 13, 100);
      this.ally3 = generateUnit('elf_stalker', 2, 11, 100);
      this.ally4 = generateUnit('elf_warrior', 4, 13, 100);
    }

    //Create enemies based on map selection
    if (this.map === 'water') {
      this.enemy1 = generateUnit('orc_shogun', 15, 0, 150);
      this.enemy2 = generateUnit('orc_soldier', 13, 2, 100);
      this.enemy3 = generateUnit('orc_soldier', 13, 0, 100);
      this.enemy4 = generateUnit('orc_soldier', 15, 2, 100);
    }
    if (this.map === 'desert') {
      this.enemy1 = generateUnit('skeleton_shaman', 15, 0, 150);
      this.enemy2 = generateUnit('skeleton', 13, 2, 100);
      this.enemy3 = generateUnit('skeleton', 13, 0, 100);
      this.enemy4 = generateUnit('skeleton', 15, 2, 100);
    }
    if (this.map === 'lava') {
      this.enemy1 = generateUnit('demon_shaman', 15, 0, 150);
      this.enemy2 = generateUnit('demon_soldier', 13, 2, 100);
      this.enemy3 = generateUnit('demon_soldier', 13, 0, 100);
      this.enemy4 = generateUnit('demon_soldier', 15, 2, 100);
    }

    this.alliesGroup = this.physics.add.group();
    this.alliesGroup.add(this.ally1);
    this.alliesGroup.add(this.ally2);
    this.alliesGroup.add(this.ally3);
    this.alliesGroup.add(this.ally4);
    
    this.allies = [this.ally1, this.ally2, this.ally3, this.ally4];
    this.enemies = [this.enemy1, this.enemy2, this.enemy3, this.enemy4];

    this.phase = 'player';
    this.enemyCount = 0;
    this.enemyTotal = this.enemies.length;
    this.allyCount = 0;
    this.allyTotal = this.allies.length;
  };

  // Functions that determines the length of the health bar.
  setMeterPercentage1(percent) {
    this.healthBar1.displayWidth = percent;
  };
  setMeterPercentage2(percent, boss = false) {
    let width;
    if (boss) {
      width = 100 * percent / 150;
    } else {
      width = percent;
    }
    this.healthBar2.displayWidth = width;
  };
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
      this.selectedUnit = undefined;
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
              this.movingUnit.x = this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].x
              this.movingUnit.y = this.coordinateGrid[this.pathingArray[this.tileMoves].x][this.pathingArray[this.tileMoves].y].y
              this.finishMove = true;
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
        return true;
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
        
        //Check if sprite already exists
      if (this.legalMovement.filter((coords) => coords.x === this.tracker.getData("coordX") && coords.y === this.tracker.getData("coordY")).length > 0) {
        moveTracker(prevDirection);
        return;
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
      
      moveTracker(prevDirection);
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
      //UNIT SELECTION
      if (this.selectedUnit) {
        if (this.selectedUnit.gameObject.getData('hasMoved')) {
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
            // Assign the target enemy and attacker.
            const attacker = this.selectedUnit.gameObject;
            // Find the orientation of the selected unit to the enemy it wants to attack.
            const directionToAttack = findDirection({ x: closest.gameObject.getData('coordX'), y: closest.gameObject.getData('coordY') }, { x: attacker.getData('coordX'), y: attacker.getData('coordY') });

            attacker.play(`${attacker.data.values.animations[directionToAttack]}`);
            // Make sure the target is an enemy, that the cursor is over it, and that it is within the generated attack tiles.
            if (this.enemies.includes(closest.gameObject) && this.player.x === closest.x + 16 && this.player.y === closest.y + 16) {
              for (const enemy of this.enemies) {
                enemy.data.values.enemyPortrait.visible = false;
              }
              // Open the enemy UI, check the UI is open.
              if (closest.gameObject === this.enemy1) {
                this.setMeterPercentage2(closest.gameObject.getData('hit_points'), true);
              } else {
                this.setMeterPercentage2(closest.gameObject.getData("hit_points"));
              }
              // if (closest.gameObject === this.enemy1)
              closest.gameObject.setData({ hasUiOpen: true });
              closest.gameObject.data.values.enemyPortrait.visible = true;
              this.uiBackground2.visible = true;
              this.healthBarEmpty2.visible = true;
              this.healthBar2.visible = true;
              this.uiText2.setText([
                "HP: " + closest.gameObject.getData("hit_points") + "/" + closest.gameObject.getData("total_hit_points"),
                "Movement: " + closest.gameObject.getData("movement"),
              ]);
            }
          }
        }
      } else {
        if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.allies.includes(closest.gameObject) && !closest.gameObject.getData('hasEndedTurn')) {
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
            for (const ally of this.allies) {
              ally.data.values.allyPortrait.visible = false;
            }
            this.selectedUnit = closest;
            this.selectedUnit.gameObject.setData({ hasUiOpen: true });
            this.selectedUnit.gameObject.data.values.allyPortrait.visible = true;
            this.uiBackground1.visible = true;
            this.healthBarEmpty1.visible = true;
            this.healthBar1.visible = true;
            this.uiText1.setText([
              `HP: ${this.selectedUnit.gameObject.getData("hit_points")}/${this.selectedUnit.gameObject.getData("total_hit_points")}`,
              "Movement: " + this.selectedUnit.gameObject.getData("movement"),
            ]);
            this.setMeterPercentage1(this.selectedUnit.gameObject.getData("hit_points"));
          }
        }
      }
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // PLAYER //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      if (this.selectedUnit && !this.selectedUnit.gameObject.getData('hasEndedTurn')) {
  
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // MOVEMENT //
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
        //check if unit has moved this turn
        if (!this.hasMoved) {
          //check if unit has movement tiles rendered around them
          if (!this.selectedUnit.gameObject.getData("hasMovementTiles")) {
            if (Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
              this.tracker.setData({coordX: this.selectedUnit.gameObject.getData("coordX"), coordY: this.selectedUnit.gameObject.getData("coordY")});
              this.tracker.x = this.selectedUnit.x;
              this.tracker.y = this.selectedUnit.y;
              this.legalMovement = [{x: this.selectedUnit.gameObject.getData('coordX'), y: this.selectedUnit.gameObject.getData('coordY')}];
              this.movementGrid = [];

              this.movementGrid.push(this.add.sprite(
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX')][this.selectedUnit.gameObject.getData('coordY')].x,
                this.coordinateGrid[this.selectedUnit.gameObject.getData('coordX')][this.selectedUnit.gameObject.getData('coordY')].y + 16,
                "movement-tile"
              ));

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
  
          if (Phaser.Input.Keyboard.JustDown(this.inputKeys.e) && this.movementGrid) {
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
              this.legalMovement = undefined;
              this.selectedUnit.gameObject.setData({ hasAttackTiles: false });
            }
          }
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Attacking //
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Check if unit has moved
        } else if (this.hasMoved && !this.hasAttacked) {
          // Assign the target enemy and attacker.
          const attacker = this.selectedUnit.gameObject;
          // Find the orientation of the selected unit to the enemy it wants to attack.
          const directionToAttack = findDirection({ x: closest.gameObject.getData('coordX'), y: closest.gameObject.getData('coordY') }, { x: attacker.getData('coordX'), y: attacker.getData('coordY') });
          
          // If yes, check if the surrounding tiles are valid to put the red tiles on. Generate red tiles based on previous check.
          if (!this.selectedUnit.gameObject.getData("hasAttackTiles")) {
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
                  coords.x === attacker.getData("coordX") + x1[i] &&
                  coords.y === attacker.getData("coordY") + y1[i]
                ).length === 0 && 
                attacker.getData("coordX") + x1[i] >= 0 &&
                attacker.getData("coordX") + x1[i] <= 15 &&
                attacker.getData("coordY") + y1[i] >= 0 &&
                attacker.getData("coordY") + y1[i] <= 15) {
                  // If no, generate red tiles and make the enemy targetable.
                  this.attackGrid.push(this.add.sprite(
                    this.coordinateGrid[attacker.getData('coordX') + x1[i]][attacker.getData('coordY') + y1[i]].x, 
                    this.coordinateGrid[attacker.getData('coordX') + x1[i]][attacker.getData('coordY') + y1[i]].y + 16,
                    "attack-tile",
                  ));
                 this.attackTiles.push({ x: attacker.getData('coordX') + x1[i], y: attacker.getData('coordY') + y1[i]});
                }
              }
              this.selectedUnit.gameObject.setData({ hasAttackTiles: true });
              console.log("Attack Grid: ", this.attackTiles);
        }
          // if (Phaser.Input.Keyboard.JustDown(this.inputKeys.k)) {
          //   attacker.play(`${attacker.data.values.animations[directionToAttack]}`);
          //   // Make sure the target is an enemy, that the cursor is over it, and that it is within the generated attack tiles.
          //   if (this.enemies.includes(closest.gameObject) && this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.attackTiles.filter(
          //     (coords) =>
          //     coords.x === this.player.getData("coordX") &&
          //     coords.y === this.player.getData("coordY")
          //     ).length > 0) {
          //       // Open the enemy UI, check the UI is open.
          //       this.setMeterPercentage2(closest.gameObject.getData("hit_points"));
          //       closest.gameObject.setData({ hasUiOpen: true });
          //       this.uiBackground2.visible = true;
          //       this.skeleton_soldier_portrait.visible = true;
          //       this.healthBarEmpty2.visible = true;
          //       this.healthBar2.visible = true;
          //       this.uiText2.setText([
          //         "HP: " + closest.gameObject.getData("hit_points") + "/" + closest.gameObject.getData("total_hit_points"),
          //         "Movement: " + closest.gameObject.getData("movement"),
          //       ]);
          //   }
          // }

          if (this.player.x === closest.x + 16 && this.player.y === closest.y + 16 && this.allies.includes(closest.gameObject) && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
            // Destroy the targeting sprites
            for (const sprite of this.attackGrid) {
              sprite.destroy();
            }

            //Cleanup
            this.allyCount += 1;
            this.hasMoved = false;
            this.selectedUnit.gameObject.setData({hasAttackTiles: false });
            this.selectedUnit.gameObject.setData({hasMovementTiles: false});
            this.selectedUnit.gameObject.setData({hasEndedTurn: true});
            this.selectedUnit.gameObject.data.values.allyPortrait.visible = false;
            this.uiBackground1.visible = false;
            this.healthBarEmpty1.visible = false;
            this.healthBar1.visible = false;
            this.uiText1.setText([""]);
            this.selectedUnit = undefined;
            this.uiBackground2.visible = false;
            this.healthBarEmpty2.visible = false;
            this.healthBar2.visible = false;
            this.uiText2.setText([""]);
            for (const enemy of this.enemies) {
              enemy.data.values.enemyPortrait.visible = false;
              enemy.setData({ hasAttackTiles: false });
              enemy.setData({ hasUiOpen: false });
            }
          }

          if (this.enemies.includes(closest.gameObject) && closest.gameObject.getData('hasUiOpen') && Phaser.Input.Keyboard.JustDown(this.inputKeys.e) && this.attackTiles.filter(
            (coords) =>
            coords.x === this.player.getData("coordX") &&
            coords.y === this.player.getData("coordY")
            ).length > 0)  {
            // Destroy the targeting sprites
            for (const sprite of this.attackGrid) {
              sprite.destroy();
            }
            // Dynamic animations:
            // Define direction for animations of the attack target.
            const directionFromAttack = findDirection({ x: attacker.getData('coordX'), y: attacker.getData('coordY') }, { x: closest.gameObject.getData('coordX'), y: closest.gameObject.getData('coordY') });

            attacker.play(`${attacker.data.values.attack_animations[directionToAttack]}`);
            attacker.playAfterRepeat(`${attacker.data.values.animations[directionToAttack]}`);
            closest.gameObject.play(`${closest.gameObject.data.values.damage_animations[directionFromAttack]}`);
            closest.gameObject.playAfterRepeat(`${closest.gameObject.data.values.animations[directionFromAttack]}`);
            closest.gameObject.setData({ hit_points: closest.gameObject.getData('hit_points') - 25 });
            this.uiText2.setText([
              `HP: ${closest.gameObject.getData("hit_points")}/${closest.gameObject.getData("total_hit_points")}`,
              "Movement: " + closest.gameObject.getData("movement"),
            ]);
            if (closest.gameObject === this.enemy1) {
              this.setMeterPercentage2(closest.gameObject.getData('hit_points'), true);
            } else {
              this.setMeterPercentage2(closest.gameObject.getData("hit_points"));
            }

            //Cleanup
            this.allyCount += 1;
            this.hasMoved = false;
            this.selectedUnit.gameObject.setData({hasMovementTiles: false});
            this.selectedUnit.gameObject.setData({hasEndedTurn: true});
            this.selectedUnit.gameObject.data.values.allyPortrait.visible = false;
            this.uiBackground1.visible = false;
            this.healthBarEmpty1.visible = false;
            this.healthBar1.visible = false;
            this.uiText1.setText([""]);
            this.selectedUnit = undefined;
            this.uiBackground2.visible = false;
            this.healthBarEmpty2.visible = false;
            this.healthBar2.visible = false;
            this.uiText2.setText([""]);
            for (const enemy of this.enemies) {
              enemy.data.values.enemyPortrait.visible = false;
              enemy.setData({ hasAttackTiles: false });
              enemy.setData({ hasUiOpen: false });
            }
            
            if (closest.gameObject.getData("hit_points") === 0) {
              this.enemies.splice(this.enemies.map(enemy => enemy.data.values.hit_points).indexOf(0), 1);
              this.enemyTotal -= 1;
              closest.gameObject.play(`${closest.gameObject.data.values.damage_animations[directionFromAttack]}`);
              closest.gameObject.playAfterRepeat(`${closest.gameObject.data.values.laying_down_animations[directionFromAttack]}`);
              this.uiBackground2.visible = true;
              this.healthBarEmpty2.visible = true;
              this.healthBar2.visible = true;
              this.uiText2.setText([
                `HP: 0/${closest.gameObject.getData("total_hit_points")}`,
                "Movement: " + closest.gameObject.getData("movement"),
              ]);
              this.time.addEvent({
                delay: 2000,
                callback: () => {
                  closest.gameObject.setData({ hasAttackTiles: false });
                  closest.gameObject.setData({ hasUiOpen: false });
                  this.uiBackground2.visible = false;
                  this.healthBarEmpty2.visible = false;
                  this.healthBar2.visible = false;
                  closest.gameObject.data.values.enemyPortrait.visible = false;
                  this.uiText2.setText([""]);
                  closest.gameObject.destroy();
                }
              });
            }
          }
        }

        // End player phase
        if (this.allyCount === this.allyTotal) {
          this.allyCount = 0;

          this.time.addEvent({
            delay: 1000,
            callback: () => {
              if (this.enemies.length === 0) {
                //Game Victory Scene
                this.cameras.main.fadeOut(1000, 0, 0, 0)
              
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                  this.scene.start('GameOverScene', {map: this.map, team: this.team, message: "Congratulations!"});
                })
                return;
              }
              if (this.allies.length === 0) {
                //Game Over Scene
                this.cameras.main.fadeOut(1000, 0, 0, 0)
              
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                  this.scene.start('GameOverScene', {map: this.map, team: this.team, message: "Game Over"});
                })
                return;
              }
              
              this.phase = 'enemy';

              for (const ally of this.allies) {
                ally.setData({hasEndedTurn: false});
              }
              console.log('--------Player Phase Complete--------');
            }
          });
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
        this.legalMovement = [{x: enemy.getData('coordX'), y: enemy.getData('coordY')}];
        this.movementGrid = [];
  
        moveTracker('up');
        findPath('down', 0, enemy.getData('movement')+ 1);
  
        moveTracker('down');
        findPath('up', 0, enemy.getData('movement')+ 1);
        
        moveTracker('left');
        findPath('right', 0, enemy.getData('movement')+ 1);
        
        moveTracker('right');
        findPath('left', 0, enemy.getData('movement')+ 1);

        console.log(this.legalMovement)
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
        this.closestAlly = this.physics.closest(enemy, this.alliesGroup.children.entries); //PROBLEM

        //Closest low health ally
        this.closestLowHealthAlly = this.physics.closest(enemy, lowHealthAlliesGroup.children.entries);

        //Return allies in range of enemy
        this.alliesInRange = this.allies.filter((ally) => {
          return inRange({x: ally.getData('coordX'), y: ally.getData('coordY')});
        });
        this.enemyPrep = true;
        console.log("----------------new turn--------------------")
        console.log(this.alliesInRange)
        console.log(this.legalMovement)
      }

      if (!this.hasMoved) {
        //Check if allies are in range
        if (this.alliesInRange.length > 0 && !this.isMoving) {
          //Check if low health allies are in range
          if (this.alliesInRange.includes(this.closestLowHealthAlly)) {
            // Move towards lowest health ally, and attack
            console.log("Closest Low Health Ally Move: ", this.closestLowHealthAlly.getData('coordX'), this.closestLowHealthAlly.getData('coordY'));
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
          } else {
            // Move towards closest ally, and attack
            console.log("Closest Ally Move: ", this.closestAlly.getData('coordX'), this.closestAlly.getData('coordY'));
            let viableMoves = [];
            let allyNumber = 0;
            while (viableMoves.length < 1) {
              viableMoves = this.legalMovement.filter((move) => {
                if (
                  move.x === this.alliesInRange[allyNumber].getData('coordX') + 1 && move.y === this.alliesInRange[allyNumber].getData('coordY') ||
                  move.x === this.alliesInRange[allyNumber].getData('coordX') - 1 && move.y === this.alliesInRange[allyNumber].getData('coordY') ||
                  move.x === this.alliesInRange[allyNumber].getData('coordX') && move.y === this.alliesInRange[allyNumber].getData('coordY') + 1 ||
                  move.x === this.alliesInRange[allyNumber].getData('coordX') && move.y === this.alliesInRange[allyNumber].getData('coordY') - 1
                ) {
                  return true;
                }
                return false;
            });
            allyNumber += 1;
            }
            this.closestAlly = this.alliesInRange[allyNumber - 1];
            
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
              if (enemy.getData('coordX') === this.closestMove.x && enemy.getData('coordY') === this.closestMove.y) {
                this.pathingArray.push(this.closestMove);
                enemy.setData({direction: null});
                return;
              }

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
            this.hasAttacked = true;

            this.finishAttack = true;
          }
        }
      }
      
      // Check if enemy has attacked.
      if (this.hasMoved && !this.hasAttacked) {
        if (this.alliesInRange.includes(this.closestLowHealthAlly)) {
          this.closestLowHealthAlly.data.values.allyPortrait.visible = false;
          // Assign the target enemy and attacker.
          const attacker = enemy;
          // Find the orientation of the selected unit to the enemy it wants to attack.
          const directionToAttack = findDirection({ x: this.closestLowHealthAlly.getData('coordX'), y: this.closestLowHealthAlly.getData('coordY') }, { x: attacker.getData('coordX'), y: attacker.getData('coordY') });
          const directionFromAttack = findDirection({ x: attacker.getData('coordX'), y: attacker.getData('coordY') }, { x: this.closestLowHealthAlly.getData('coordX'), y: this.closestLowHealthAlly.getData('coordY') });
          // Open the enemy UI, check the UI is open.
          this.setMeterPercentage1(this.closestLowHealthAlly.getData("hit_points"));
          this.closestLowHealthAlly.setData({ hasUiOpen: true });
          this.closestLowHealthAlly.data.values.allyPortrait.visible = true;
          this.uiBackground1.visible = true;
          this.healthBarEmpty1.visible = true;
          this.healthBar1.visible = true;
          this.uiText1.setText([
            "HP: " + this.closestLowHealthAlly.getData("hit_points") + "/" + this.closestLowHealthAlly.getData("total_hit_points"),
            "Movement: " + this.closestLowHealthAlly.getData("movement"),
          ]);

          if (this.closestLowHealthAlly.getData('hasUiOpen')) {
            attacker.play(`${attacker.data.values.attack_animations[directionToAttack]}`);
            attacker.playAfterRepeat(`${attacker.data.values.animations[directionToAttack]}`);
            this.closestLowHealthAlly.play(`${this.closestLowHealthAlly.data.values.damage_animations[directionFromAttack]}`);
            this.closestLowHealthAlly.playAfterRepeat(`${this.closestLowHealthAlly.data.values.animations[directionFromAttack]}`);
            this.closestLowHealthAlly.setData({ hit_points: this.closestLowHealthAlly.getData('hit_points') - 25 });
            this.setMeterPercentage1(this.closestLowHealthAlly.getData("hit_points"));
            this.uiText1.setText([
              `HP: ${this.closestLowHealthAlly.getData("hit_points")}/${this.closestLowHealthAlly.getData("total_hit_points")}`,
              "Movement: " + this.closestLowHealthAlly.getData("movement"),
            ]);
            this.hasAttacked = true;
            this.closestLowHealthAlly.setData({ hasUiOpen: false });
            if (this.closestLowHealthAlly.getData("hit_points") === 0) {
              this.closestLowHealthAlly.data.values.allyPortrait.visible = true;
              this.allies.splice(this.allies.map(ally => ally.data.values.hit_points).indexOf(0), 1);
              this.allyTotal -= 1;
              this.alliesGroup
              const isSleepingAlly = this.closestLowHealthAlly;
              isSleepingAlly.play(`${this.closestLowHealthAlly.data.values.damage_animations[directionFromAttack]}`);
              isSleepingAlly.playAfterRepeat(`${this.closestLowHealthAlly.data.values.laying_down_animations[directionFromAttack]}`);
              this.uiText1.setText([
                "HP: 0/" + isSleepingAlly.getData("total_hit_points"),
                "Movement: " + isSleepingAlly.getData("movement"),
              ]);
              this.time.addEvent({
                delay: 2000,
                callback: () => {
                  //this never executes
                  isSleepingAlly.setData({ hasUiOpen: false });
                  this.uiBackground1.visible = false;
                  this.healthBarEmpty1.visible = false;
                  this.healthBar1.visible = false;
                  this.uiText1.setText([""]);
                  isSleepingAlly.data.values.allyPortrait.visible = false;
                  isSleepingAlly.destroy();
                }
              });
            }
          }
        } else if (this.alliesInRange.includes(this.closestAlly)) {
          this.closestAlly.data.values.allyPortrait.visible = false;
          const attacker = enemy;

          const directionToAttack = findDirection({ x: this.closestAlly.getData('coordX'), y: this.closestAlly.getData('coordY') }, { x: attacker.getData('coordX'), y: attacker.getData('coordY') });
          const directionFromAttack = findDirection({ x: attacker.getData('coordX'), y: attacker.getData('coordY') }, { x: this.closestAlly.getData('coordX'), y: this.closestAlly.getData('coordY') });
          // Open the enemy UI, check the UI is open.
          // console.log("Closest Ally Attack: ", this.closestAlly.getData('coordX'), this.closestAlly.getData('coordY'));
          this.setMeterPercentage1(this.closestAlly.getData("hit_points"));
          this.closestAlly.setData({ hasUiOpen: true });
          this.closestAlly.data.values.allyPortrait.visible = true;
          this.uiBackground1.visible = true;
          this.healthBarEmpty1.visible = true;
          this.healthBar1.visible = true;
          this.uiText1.setText([
            "HP: " + this.closestAlly.getData("hit_points") + "/" + this.closestAlly.getData("total_hit_points"),
            "Movement: " + this.closestAlly.getData("movement"),
          ]);
            // Click a button to confirm your attack and launch an attack on the enemy. It should only work if you select a valid tile.
            // Play the attack animation, reduce hit points of skeleton.

          if (this.closestAlly.getData('hasUiOpen')) {
            // Play attack animation and then idle after
            attacker.play(`${attacker.data.values.attack_animations[directionToAttack]}`);
            attacker.playAfterRepeat(`${attacker.data.values.animations[directionToAttack]}`);
            this.closestAlly.play(`${this.closestAlly.data.values.damage_animations[directionFromAttack]}`);
            this.closestAlly.playAfterRepeat(`${this.closestAlly.data.values.animations[directionFromAttack]}`);
            this.closestAlly.setData({ hit_points: this.closestAlly.getData('hit_points') - 25 });
            this.uiText1.setText([
              `HP: ${this.closestAlly.getData("hit_points")}/${this.closestAlly.getData("total_hit_points")}`,
              "Movement: " + this.closestAlly.getData("movement"),
            ]);
            this.setMeterPercentage1(this.closestAlly.getData("hit_points"));
            this.hasAttacked = true;
            this.closestAlly.setData({ hasUiOpen: false });
            if (this.closestAlly.getData("hit_points") === 0) {
              this.closestAlly.data.values.allyPortrait.visible = true;
              this.allies.splice(this.allies.map(ally => ally.data.values.hit_points).indexOf(0), 1);
              const isSleepingAlly = this.closestAlly;
              isSleepingAlly.play(`${this.closestAlly.data.values.damage_animations[directionFromAttack]}`);
              isSleepingAlly.playAfterRepeat(`${this.closestAlly.data.values.laying_down_animations[directionFromAttack]}`);
              this.uiText1.setText([
                "HP: 0/" + isSleepingAlly.getData("total_hit_points"),
                "Movement: " + isSleepingAlly.getData("movement"),
              ]);
              this.time.addEvent({
                delay: 2000,
                callback: () => {
                  isSleepingAlly.setData({ hasUiOpen: false });
                  this.uiBackground1.visible = false;
                  this.healthBarEmpty1.visible = false;
                  this.healthBar1.visible = false;
                  this.uiText1.setText([""]);
                  isSleepingAlly.data.values.allyPortrait.visible = false;
                  isSleepingAlly.destroy();
                }
              });
            }
          }
        }
        this.finishAttack = true;
      }

      if (this.finishMove && this.finishAttack) {
        this.finishMove = false;
        this.finishAttack = false;
        //Cleanup
        this.time.addEvent({
          delay: 1000,
          callback: () => {
            if (this.enemies.length === 0) {
              //Game Victory Scene
              this.cameras.main.fadeOut(1000, 0, 0, 0)
            
              this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameOverScene', {map: this.map, team: this.team, message: "Congratulations!"});
              })
            }
            if (this.allies.length === 0) {
              //Game Over Scene
              this.cameras.main.fadeOut(1000, 0, 0, 0)
            
              this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameOverScene', {map: this.map, team: this.team, message: "Game Over"});
              })
            }

            this.enemyCount += 1;
            this.hasMoved = false;
            this.hasAttacked = false;
            this.legalMovement = undefined;
            this.closestMove = undefined;
            this.enemyPrep = undefined;
            if (this.enemyCount === this.enemyTotal) {
              this.phase = 'player';
              this.enemyCount = 0;
            }
            console.log("--------CLEANUP DONE--------");
          }
        });
      }
    }
  }
}