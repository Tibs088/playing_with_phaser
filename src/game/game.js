import Phaser from 'phaser'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png');
    this.load.tilemapTiledJSON('map', 'https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json');
    // this.load.image('sky', '../assets/sky.png');
    // this.load.image('ground', '../assets/platform.png');
    // this.load.image('star', '../assets/star.png');
    // this.load.image('bomb', '../assets/bomb.png');
    // this.load.spritesheet('dude',
    //   '../assets/dude.png',
    //   { frameWidth: 32, frameHeight: 48 }
    // );
}

function create() {
    const username = 'Charly';

    const map = this.make.tilemap({
        key: 'map',
    });

    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

    const tileLayer = map.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    var text = this.add.text(300, 5, '', { color: 'white', fontSize: '20px ' });
    text.setText(username);
}

function update() {

}

export default game;