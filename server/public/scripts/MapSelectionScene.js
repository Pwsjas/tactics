export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MapSelectionScene");

    this.map;
    this.team;
    this.selection;
    this.mapChosen;
    this.teamChosen;
  }

  preload() {
    //Maps
    this.load.image('water-map', 'assets/maps/water.png');
    this.load.image('desert-map', 'assets/maps/desert.png');
    this.load.image('lava-map', 'assets/maps/lava.png');

    //Cursor
    this.load.image('cursor', 'assets/cursor.png')

    //Units
    this.load.image('human-dragon-knight', 'assets/unit-images/human-dragon-knight.png')
    this.load.image('human-archer', 'assets/unit-images/human-archer.png')
    this.load.image('human-thief', 'assets/unit-images/human-thief.png')
    this.load.image('human-fighter', 'assets/unit-images/human-fighter.png')

    this.load.image('elf-elder', 'assets/unit-images/elf-elder.png')
    this.load.image('elf-stalker', 'assets/unit-images/elf-stalker.png')
    this.load.image('elf-recruit', 'assets/unit-images/elf-recruit.png')
    this.load.image('elf-warrior', 'assets/unit-images/elf-warrior.png')
    
    this.load.image('dwarf-blacksmith', 'assets/unit-images/dwarf-blacksmith.png')
    this.load.image('dwarf-worker', 'assets/unit-images/dwarf-worker.png')
    this.load.image('dwarf-captain', 'assets/unit-images/dwarf-captain.png')
    this.load.image('dwarf-hunter', 'assets/unit-images/dwarf-hunter.png')

    //Background
    this.load.image('background', 'assets/batthern.png')
  }

  create() {
    // Rectangle for selection
    this.r1 = this.add.rectangle(240, 200, 400, 230, 0x6666ff);
    this.r2 = this.add.rectangle(240, 460, 170, 70);
    this.r2.setStrokeStyle(4, 0x1a65ac);
    this.r3 = this.add.rectangle(640, 610, 160, 60, 0x5DBB63);

    //Maps
    this.waterMap = this.add.sprite(240, 200, 'water-map');
    this.desertMap = this.add.sprite(640, 200, 'desert-map');
    this.lavaMap = this.add.sprite(1040, 200, 'lava-map');
    this.lavaMap.scale = 0.3;
    this.waterMap.scale = 0.3;
    this.desertMap.scale = 0.3;

    //Cursor
    this.player = this.add.sprite(240, 340, 'cursor');
    this.player.scale = 2;

    //Units
    this.h1 = this.add.sprite(180, 460, 'human-dragon-knight').scale = 2;
    this.h2 = this.add.sprite(220, 460, 'human-archer').scale = 2;
    this.h3 = this.add.sprite(260, 460, 'human-thief').scale = 2;
    this.h4 = this.add.sprite(300, 460, 'human-fighter').scale = 2;

    this.e1 = this.add.sprite(580, 460, 'elf-elder').scale = 2;;
    this.e2 = this.add.sprite(620, 460, 'elf-stalker').scale = 2;;
    this.e3 = this.add.sprite(660, 460, 'elf-recruit').scale = 2;;
    this.e4 = this.add.sprite(700, 460, 'elf-warrior').scale = 2;;

    this.d1 = this.add.sprite(980, 460, 'dwarf-blacksmith').scale = 2;;
    this.d2 = this.add.sprite(1020, 460, 'dwarf-worker').scale = 2;;
    this.d3 = this.add.sprite(1060, 460, 'dwarf-captain').scale = 2;;
    this.d4 = this.add.sprite(1100, 460, 'dwarf-hunter').scale = 2;;

    this.selectionText = this.add.text(505, 30, "Select a Level", { color: 'white', fontSize: 32 });
    this.selectionText = this.add.text(505, 380, "Select a Team", { color: 'white', fontSize: 32 });
    this.selectionText = this.add.text(594, 594, "Start", { color: 'white', fontSize: 32 });

    this.inputKeys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    this.selection = 'map';
  }

  update() {
    if (this.player.y === 650) {
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.w)) {
        this.player.y = 526;
      }
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
        //Call new Scene
        this.cameras.main.fadeOut(1000, 0, 0, 0)
      
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          this.scene.start('MainScene', {map: this.map, team: this.team});
        })
      }
      
    } else {
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.a)) {
        if (this.player.x === 240) {
          this.player.x = 1040;
  
          if (this.selection === 'map' && !this.mapChosen) {
            this.r1.x = this.player.x;
          };
  
          if (this.selection === 'unit' && !this.teamChosen) {
            this.r2.x = this.player.x;
          };
        } else {
          this.player.x -= 400;
  
          if (this.selection === 'map' && !this.mapChosen) {
            this.r1.x = this.player.x;
          };
          
          if (this.selection === 'unit' && !this.teamChosen) {
            this.r2.x = this.player.x;
          };
        }
      }
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.d)) {
        if (this.player.x === 1040) {
          this.player.x = 240;
  
          if (this.selection === 'map' && !this.mapChosen) {
            this.r1.x = this.player.x;
          };
          if (this.selection === 'unit' && !this.teamChosen) {
            this.r2.x = this.player.x;
          };
        } else {
          this.player.x += 400;
  
          if (this.selection === 'map' && !this.mapChosen) {
            this.r1.x = this.player.x;
          };
          if (this.selection === 'unit' && !this.teamChosen) {
            this.r2.x = this.player.x;
          };
        }
      }
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
        if (this.selection === 'unit') {
          if (this.player.x === 240) {
            this.team = 'humans';
          }
          if (this.player.x === 640) {
            this.team = 'elves';
          }
          if (this.player.x === 1040) {
            this.team = 'dwarfs';
          }
          this.teamChosen = true;
          this.r2.x = this.player.x;
          this.r2.setStrokeStyle(4, 0x5DBB63);
        }
        if (this.selection === 'map') {
          if (this.player.x === 240) {
            this.map = 'water';
          }
          if (this.player.x === 640) {
            this.map = 'desert';
          }
          if (this.player.x === 1040) {
            this.map = 'lava';
          }
          this.mapChosen = true;
          this.r1.x = this.player.x;
          
          // Move to Character Select
          this.r1.setFillStyle(0x5DBB63);
        }
        console.log(this.map, this.team);
      }
  
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.w)) {
        if (this.player.y === 526) {
          this.player.y = 340;
          if (!this.mapChosen) {
            this.r1.x = this.player.x;
          }
          if (this.player.y === 340) {
            this.selection = 'map';
          } else {
            this.selection = "unit";
          }
        }
      }

      if (this.mapChosen && this.teamChosen) {
        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.s)) {
          if (this.player.y === 526) {
            this.player.y = 650;
            this.player.x = 640;
          }
          if (this.player.y === 340) {
            this.player.y = 526;
          }

          if (this.player.y === 340) {
            this.selection = 'map';
          } else if (this.player.y === 526) {
            this.selection = "unit";
          }
        }
      }
  
      if (Phaser.Input.Keyboard.JustDown(this.inputKeys.s)) {
        if (this.player.y === 340) {
          this.player.y = 526;
          if (!this.teamChosen) {
            this.r2.x = this.player.x;
          }
          if (this.player.y === 340) {
            this.selection = 'map';
          } else if (this.player.y === 526) {
            this.selection = "unit";
          }
        }
      }
    }
  }
}