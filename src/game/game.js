import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI'
    }]
  }
};

const game = new Phaser.Game(config);

let controls;
let player;
let npc;
let scene;
let dialog;

let isOverlapping = false;

let leftKey;
let rightKey;

let cursors;

let zone;

function preload() {
  this.load.image('tiles', '../assets/tuxmon-sample.png');
  this.load.tilemapTiledJSON('map', '../assets/tilemap.json');
  // this.load.image('sky', '../assets/sky.png');
  // this.load.image('ground', '../assets/platform.png');
  // this.load.image('star', '../assets/star.png');
  // this.load.image('bomb', '../assets/bomb.png');
  this.load.spritesheet('dude',
    '../assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  const map = this.make.tilemap({
    key: 'map',
  });

  const tileset = map.addTilesetImage('test', 'tiles');

  const tileLayer = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);

  player = this.physics.add.sprite(50, 225, 'dude');
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });


  cursors = this.input.keyboard.createCursorKeys();

  zone = this.add.zone(200, 200).setSize(200, 200);

  this.physics.world.enable(zone);
  zone.body.moves = false;

  player.on('overlapstart', function () {
    this.body.debugBodyColor = 0xff3300;
    console.log("overlapstart");
    console.time("overlap");
    isOverlapping = true;
  })

  player.on("overlapend", function () {
    this.body.debugBodyColor = 0x00ff33;
    console.log("overlapend");
    console.timeEnd("overlap");
    isOverlapping = false;
  });

  this.physics.add.overlap(player, zone);

  scene = this;
  dialog = undefined;

  this.input.on('pointerdown', function (pointer) {
    let x = pointer.x;
    let y = pointer.y;

    if (dialog === undefined) {
      dialog = createDialog(this, x, y, function (color) {
        scene.add.circle(x, y, 20, color);
        dialog.scaleDownDestroy(100);
        dialog = undefined;
      });
    } else if (!dialog.isInTouching(pointer)) {
      dialog.scaleDownDestroy(100);
      dialog = undefined;
    }
  }, this);

  const camera = this.cameras.main;

  // // Set up the arrows to control the camera
  // const cursors = this.input.keyboard.createCursorKeys();
  // controls = new Phaser.Cameras.Controls.FixedKeyControl({
  //   camera: camera,
  //   left: cursors.left,
  //   right: cursors.right,
  //   up: cursors.up,
  //   down: cursors.down,
  //   speed: 2
  // });

  // // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
  // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // // Help text that has a "fixed" position on the screen
  // this.add
  //   .text(16, 16, "Arrow keys to scroll", {
  //     font: "18px monospace",
  //     fill: "#ffffff",
  //     padding: { x: 20, y: 10 },
  //     backgroundColor: "#000000"
  //   })
  //   .setScrollFactor(0);


}

function update(time, delta) {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (player.body.embedded) player.body.touching.none = false;

  var touching = !player.body.touching.none;
  var wasTouching = !player.body.wasTouching.none;

  if (touching && !wasTouching) player.emit("overlapstart");
  else if (!touching && wasTouching) player.emit("overlapend");
}

const createDialog = function (scene, x, y, onClick) {
  let dialog = scene.rexUI.add.dialog({
    x: x,
    y: y,
    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),
    title: scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
      text: scene.add.text(0, 0, 'Pick a color', {
        fontSize: '20px'
      }),
      space: {
        left: 15,
        right: 15,
        top: 10,
        bottom: 10
      }
    }),

    actions: [
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
      scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
    ],

    actionsAlign: 'left',

    space: {
      title: 10,
      action: 5,

      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    }
  })
    .layout()
    .pushIntoBounds()
    //.drawBounds(this.add.graphics(), 0xff0000)
    .popUp(500);

  dialog
    .on('button.click', function (button, groupName, index) {
      onClick(button.fillColor);
    })
    .on('button.over', function (button, groupName, index) {
      button.setStrokeStyle(2, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
      button.setStrokeStyle();
    });

  return dialog;
}

export default game;