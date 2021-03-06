function MainGameState(game)
{
    this.game = game;
    this.LASER_POOL_SIZE = 40;
    this.BOSS_BULLET_POOL_SIZE = 50;
    this.FIRE_DELAY = 100;
    this.BOSS_FIRE_DELAY = 180;
    this.ENEMY_SPAWN_DELAY = 600;
    this.SMALL_LASER_SPEED = 700;
    this.BOSS_BULLET_SPEED = 450;
    this.ENEMY_ATTRACTION_ZONE = 900;
    this.MAX_ENEMIES_SPAWNED = 20;
};

MainGameState.prototype.thispreload = function() 
{
    this.game.load.tilemap('lvl1', 'assets/maps/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('lvl1tiles', 'assets/maps/lvl1tiles.png');
    this.game.load.image('playerArm', 'assets/graphics/arm.png');
    this.game.load.audio('overworld', ['assets/music/overworld.mp3', 'assets/music/overworld.ogg']);
    this.game.load.audio('bossBattle', ['assets/music/bossBattle.mp3', 'assets/music/bossBattle.ogg']);
    this.game.load.audio('jumpjet', ['assets/sounds/jet.wav']);
    this.game.load.audio('bossHurt', ['assets/sounds/bossHurt.wav']);
    this.game.load.image('smallLaserBeam', 'assets/graphics/small_laser.png');
    this.game.load.spritesheet('player', 'assets/graphics/player.png', 60, 100);
    this.game.load.spritesheet('explosion', 'assets/graphics/explosion.png', 30, 30);
    this.game.load.spritesheet('boss', 'assets/graphics/boss.png', 320, 320);
    this.game.load.spritesheet('enemy', 'assets/graphics/enemy.png', 40, 40);
    this.game.load.spritesheet('vaf', 'assets/graphics/verticalAccelerationField.png', 80, 30);
    this.game.load.spritesheet('bossBullet', 'assets/graphics/bossBullet.png', 20, 20);
    this.game.load.audio('smallLaserBeamSfx', 'assets/sounds/smallLaser.wav');
};

MainGameState.prototype.create = function() 
{
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000000';
    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage('lvl1tiles');
    this.map.setCollision([1, 3, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 43], true);
    this.map.setCollision([2, 4, 12, 13, 14, 19, 20, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                          41, 42, 44, 45, 46, 51, 52], false);
    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();
    this.game.physics.arcade.gravity.y = 250;
    this.player = this.game.add.sprite(this.game.world.x+240, this.game.world.y+this.game.world.height - 150, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.bounce.y = 0.0;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(50, 90, 0, 5);
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('run', [0, 1, 2, 3], 10, true);
    this.player.animations.add('stop', [0], 10, true);
    this.player.animations.add('jet', [4, 5], 10, true);
    this.playerArm = this.game.add.sprite(this.player.x + 8, this.player.y + 36, 'playerArm');
    this.boss = this.game.add.sprite(4900, 500, 'boss');
    this.boss.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.body.allowGravity = false;
    this.boss.health = 100; // TODO Increase
    //this.boss.immovable = true;
    this.boss.body.moves = false;
    this.boss.frame = 0;
    this.playerArm.anchor.setTo(0.8,0.28);
    this.game.camera.follow(this.player);
    this.game.camera.deadzone = new Phaser.Rectangle(300, 250, 250, 50);
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.debugButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.muteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.music = this.game.add.audio('overworld');
    this.music.play('',0,1,true);
    this.bossBattleMusic = this.game.add.audio('bossBattle');
    this.jumpsfx = this.game.add.audio('jumpjet');
    this.bossHurtsfx = this.game.add.audio('bossHurt');
    this.smallLasersfx = this.game.add.audio('smallLaserBeamSfx');

    this.player.bringToTop();
    this.playerArm.bringToTop();
    this.smallLaserPool = this.game.add.group();
    for(var i = 0; i < this.LASER_POOL_SIZE; i++) {
        var smallLaserBeam = this.game.add.sprite(0, 0, 'smallLaserBeam');
        this.smallLaserPool.add(smallLaserBeam);
        smallLaserBeam.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(smallLaserBeam, Phaser.Physics.ARCADE);
        smallLaserBeam.body.allowGravity = false;
        smallLaserBeam.bringToTop();
        smallLaserBeam.kill();
    }
    
    this.explosionsPool = this.game.add.group();
    for(var i = 0; i < this.LASER_POOL_SIZE; i++) {
        var explosion = this.game.add.sprite(0, 0, 'explosion');
        this.explosionsPool.add(explosion);
        explosion.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(explosion, Phaser.Physics.ARCADE);
        explosion.body.allowGravity = false;
        explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 50, false);
        explosion.bringToTop();
        explosion.kill();
    }
    
    this.bossBulletPool = this.game.add.group();
    for(var i = 0; i < this.BOSS_BULLET_POOL_SIZE; i++) {
        var bossBullet = this.game.add.sprite(0, 0, 'bossBullet');
        this.bossBulletPool.add(bossBullet);
        bossBullet.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(bossBullet, Phaser.Physics.ARCADE);
        bossBullet.body.allowGravity = false;
        bossBullet.animations.add('spin', [0, 1], 40, true);
        bossBullet.bringToTop();
        bossBullet.kill();
    }
    
    this.clipText = this.game.add.text(16, 16, '', { fontSize: '32px', fill: '#ffffff' });
    this.clipText.fixedToCamera = true;
    
    this.createVaf();
    this.createEnemies();
    
    this.player.scale.x = -Math.abs(this.player.scale.x);
    this.setFacing('right');
    this.running = 'none';
    this.jumping = false;
    this.jumpEnd = 0;
    this.lastSmallLaserFiredAt = 0;
    this.lastBossBulletFiredAt = 0;
    this.player.animations.stop();
    this.player.frame = 0;
    
    this.player.bringToTop();
    this.playerArm.bringToTop();
    
    this.setArm();
    this.isBossBattle = false;
    this.lastSpawnAt = 0;
    this.numEnemiesSpawned = 0;
};

MainGameState.prototype.setFacing = function(facing)
{
    this.facing = facing;
    if (facing === 'left')
    {
        this.player.scale.x = Math.abs(this.player.scale.x);
        this.playerArm.scale.x = Math.abs(this.playerArm.scale.x);
    }
    else if (facing === 'right')
    {
        this.player.scale.x = -Math.abs(this.player.scale.x);
        this.playerArm.scale.x = -Math.abs(this.playerArm.scale.x);
    }
};

MainGameState.prototype.createEnemies = function()
{
    this.enemies = this.game.add.group();
    var enemy = undefined;
    for (var i = 0; i < 100; i++) 
    {
        enemy = this.game.add.sprite(
            this.game.world.x+Math.random()*this.game.world.height, 
            this.game.world.y+Math.random()*this.game.world.width, 
            'enemy');
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.allowGravity = false;
        enemy.anchor.setTo(0.5, 0.5);
        enemy.animations.add('fluctuate', [0, 1, 2], 10, true);
        enemy.animations.play('fluctuate');
        if (this.game.physics.arcade.distanceBetween(enemy, this.player) < 500 || 
            this.game.physics.arcade.collide(enemy, this.layer))
        {
            enemy.kill();
        }
        enemy.spawnedByBoss = false;        
        this.enemies.add(enemy);
    }
    
        for (var i = 0; i < this.MAX_ENEMIES_SPAWNED; i++) // More enemies for the boss to spawn
    {
        enemy = this.game.add.sprite(
            this.boss.x, 
            this.boss.y, 
            'enemy');
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.allowGravity = false;
        enemy.anchor.setTo(0.5, 0.5);
        enemy.animations.add('fluctuate', [0, 1, 2], 10, true);
        enemy.animations.play('fluctuate');
        enemy.kill();
        enemy.spawnedByBoss = true;
        this.enemies.add(enemy);
    }
};

MainGameState.prototype.createVaf = function()
{
    this.vafs = this.game.add.group();
    var vaf = undefined;
    for (var i = 0; i < 4; i++) 
    {
        vaf = this.game.add.sprite(
            this.game.world.x+1794, 
            this.game.world.y+1961 - i*170, 
            'vaf');        
        this.game.physics.enable(vaf, Phaser.Physics.ARCADE);
        vaf.body.allowGravity = false;
        vaf.anchor.setTo(0.5, 0.5);
        vaf.animations.add('fluctuate', [0, 1, 2, 3, 4], 8, true);
        vaf.animations.play('fluctuate');
        this.vafs.add(vaf);
    }
    
    for (var i = 0; i < 11; i++) 
    {
        vaf = this.game.add.sprite(
            this.game.world.x+2622, 
            this.game.world.y+2446 - i*170, 
            'vaf');        
        this.game.physics.enable(vaf, Phaser.Physics.ARCADE);
        vaf.body.allowGravity = false;
        vaf.anchor.setTo(0.5, 0.5);
        vaf.animations.add('fluctuate', [0, 1, 2, 3, 4], 8, true);
        vaf.animations.play('fluctuate');
        this.vafs.add(vaf);
    }
    
    for (var i = 0; i < 6; i++) 
    {
        vaf = this.game.add.sprite(
            this.game.world.x+5568, 
            this.game.world.y+1614 - i*170, 
            'vaf');        
        this.game.physics.enable(vaf, Phaser.Physics.ARCADE);
        vaf.body.allowGravity = false;
        vaf.anchor.setTo(0.5, 0.5);
        vaf.animations.add('fluctuate', [0, 1, 2, 3, 4], 8, true);
        vaf.animations.play('fluctuate');
        this.vafs.add(vaf);
    }
};
    

MainGameState.prototype.update = function() 
{   
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.player, this.boss);
    this.player.body.velocity.x = 0;
    
    this.enemies.forEachAlive(this.enemyHomeIn, this);
    this.smallLaserPool.forEachAlive(this.smallLaserCollideWithLayer, this);
    this.smallLaserPool.forEachAlive(this.smallLaserCollideWithEnemies, this, this.enemies);
    this.smallLaserPool.forEachAlive(this.smallLaserCollideWithBoss, this);
    this.enemies.forEachAlive(this.enemyCollideWithPlayer, this);
    this.vafs.forEachAlive(this.vafMovePlayer, this);
    this.bossBulletPool.forEachAlive(this.bossBulletCollideWithLayer, this);
    this.bossBulletPool.forEachAlive(this.bossBulletCollideWithPlayer, this);
    
    this.bossSpawnEnemies();
    this.bossFire();
    
    // TODO Show health remaining (increase flash rate of boss?)
    
    if (!this.jumping && this.jumpButton.isDown && this.game.time.now > this.jumpEnd)
    {
        this.player.body.velocity.y += -340;
        this.jumpEnd = this.game.time.now + 1000;
        this.jumping = true;
        this.player.animations.play('jet');
        this.jumpsfx.play('',0,1,false);
    }
    else if (this.jumping && this.player.body.onFloor())
    {
        this.jumping = false;
    }
    
    if (this.leftButton.isDown)
    {
        this.player.body.velocity.x = -150;
        if (!this.jumping)
        {
            if (this.player.body.onFloor())
            {
                this.player.animations.play('run');
            }
            else
            {
                this.player.animations.stop();
            }
        }
        if (this.running != 'left')
        {
            this.setFacing('left');
            this.running = 'left';
        }
    }
    else if (this.rightButton.isDown)
    {
        this.player.body.velocity.x = 150;

        if (!this.jumping)
        {
            if (this.player.body.onFloor())
            {
                this.player.animations.play('run');
            }
            else
            {
                this.player.animations.stop();
            }
        }
        if (this.running != 'right')
        {
            this.setFacing('right');
            this.running = 'right';
        }
    }
    else if (!this.jumping)
    {
        this.running = 'none';
        this.player.animations.stop();
        this.player.frame = 0;
    }
    this.setArm();
    if (this.spaceButton.isDown || this.game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON)
    {
        this.fire();
    }  
    if (this.debugButton.isDown)
    {
        console.log("Player pos.: "+this.player.x+", "+this.player.y);
    }
    if (this.muteButton.isDown)
    {
        this.music.mute = true;
    }
    if (!this.isBossBattle && this.player.x > 4600 && this.player.y < 1422)
    {
        this.music.stop();
        this.bossBattleMusic.play('',0,1,true);
        this.isBossBattle = true;
    }
};

MainGameState.prototype.setArm = function()
{
    if (this.facing === 'right')
    {
        this.playerArm.x = this.player.x - 8;
        this.playerArm.y = this.player.y - this.player.body.halfHeight + 36;
    }
    else
    {
        this.playerArm.x = this.player.x + 8;
        this.playerArm.y = this.player.y - this.player.body.halfHeight + 36;
    }
    if (this.facing === 'right')
    {
        this.playerArm.rotation = 
            this.game.physics.arcade.angleBetween(
                this.playerArm, 
                {x: this.game.input.worldX, y: this.game.input.worldY});
    }
    else
    {
        this.playerArm.rotation = 
            this.game.physics.arcade.angleBetween(
            this.playerArm, 
            {x: this.game.input.worldX, y: this.game.input.worldY}) + Math.PI;
    }
};

MainGameState.prototype.enemyHomeIn = function(enemy)
{
    if (this.game.physics.arcade.distanceBetween(enemy, this.player) < this.ENEMY_ATTRACTION_ZONE)
    {
        this.game.physics.arcade.accelerateToObject(enemy, this.player, 50, 130, 130)
    }
    else
    {
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
    }
    this.game.physics.arcade.collide(enemy, this.layer);
};

MainGameState.prototype.bossSpawnEnemies = function()
{
    if (this.game.time.now - this.lastSpawnAt < this.ENEMY_SPAWN_DELAY) return;
    if (this.game.physics.arcade.distanceBetween(this.boss, this.player) < this.ENEMY_ATTRACTION_ZONE &&
       this.numEnemiesSpawned < this.MAX_ENEMIES_SPAWNED)
    {
        this.lastSpawnAt = this.game.time.now;
        this.numEnemiesSpawned++;
        var enemy = this.enemies.getFirstDead();
        if (enemy === null || enemy === undefined) return;
        enemy.revive();
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
        enemy.reset(
            this.boss.x + Math.floor(Math.random() * 300)-150, 
            this.boss.y + Math.floor(Math.random() * 300)-150);
    }
};

MainGameState.prototype.smallLaserCollideWithBoss = function(smallLaser)
{
    if (this.game.physics.arcade.collide(smallLaser, this.boss))
    {
        smallLaser.kill();
        this.boss.damage(1);
        this.bossHurtsfx.play('',0,1,false);
        this.boss.frame = (this.boss.frame + 1) % 2;
        this.explosionAt(smallLaser.x, smallLaser.y);
        if (!this.boss.alive)
        {
            this.game.state.start('winState');
        }
    }
    
};

MainGameState.prototype.bossBulletCollideWithPlayer = function(bossBullet)
{
    if(this.game.physics.arcade.collide(bossBullet, this.player))
    {
        this.game.state.start('gameOver');
    }
};

MainGameState.prototype.vafMovePlayer = function(vaf)
{
    if (this.game.physics.arcade.distanceBetween(vaf, this.player) < 40)
    {
        if (this.jumping)
        {
            this.player.body.velocity.y -= 17;
        }
        else if (this.player.body.velocity.y > 50)
        {
            this.player.body.velocity.y -= 8;
        }
    }
};

MainGameState.prototype.enemyCollideWithPlayer = function(enemy)
{
    if(this.game.physics.arcade.collide(enemy, this.player))
    {
        this.game.state.start('gameOver');
    }
};

MainGameState.prototype.smallLaserCollideWithLayer = function(smallLaser) 
{
    if (this.game.physics.arcade.collide(smallLaser, this.layer))
    {
        smallLaser.kill();
        this.explosionAt(smallLaser.x, smallLaser.y);
    }
};

MainGameState.prototype.bossBulletCollideWithLayer = function(bossBullet) 
{
    if (this.game.physics.arcade.collide(bossBullet, this.layer))
    {
        bossBullet.kill();
        this.explosionAt(bossBullet.x, bossBullet.y);
    }
};

MainGameState.prototype.smallLaserCollideWithEnemies = function(smallLaser, enemies) 
{
    enemies.forEachAlive(this.smallLaserCollideWithEnemy, this, smallLaser);
}

MainGameState.prototype.smallLaserCollideWithEnemy = function(enemy, smallLaser) 
{
    if (this.game.physics.arcade.collide(smallLaser, enemy))
    {
        this.explosionAt(enemy.x, enemy.y);
        if (enemy.spawnedByBoss = true) this.numEnemiesSpawned--;
        enemy.kill();
        smallLaser.kill();
    }
};

MainGameState.prototype.explosionAt = function(x, y)
{
    var explosion = this.explosionsPool.getFirstDead();
    if (explosion === null || explosion === undefined) return;
    explosion.revive();
    explosion.checkWorldBounds = true;
    explosion.outOfBoundsKill = true;
    explosion.reset(x, y);
    explosion.animations.play('explode', 50, false, true);
    //this.explosionsfx.play('',0,1,false);
};

MainGameState.prototype.bossFire = function() 
{
    if (this.isBossBattle)
    {
        if (this.game.time.now - this.lastBossBulletFiredAt < this.FIRE_DELAY) return;
        this.lastBossBulletFiredAt = this.game.time.now;
        var bossBullet = this.bossBulletPool.getFirstDead();
        if (bossBullet === null || bossBullet === undefined) return;
        bossBullet.revive();
        bossBullet.checkWorldBounds = true;
        bossBullet.outOfBoundsKill = true;
        bossBullet.reset(this.boss.x, this.boss.y);
        var angle = Math.random() * 2 * Math.PI;
        bossBullet.body.velocity.x = 
            this.BOSS_BULLET_SPEED*Math.cos(angle);
        bossBullet.body.velocity.y = 
            this.BOSS_BULLET_SPEED*Math.sin(angle);
        bossBullet.animations.play('spin');
    }
};

MainGameState.prototype.fire = function() 
{
    if (this.game.time.now - this.lastSmallLaserFiredAt < this.FIRE_DELAY) return;
    this.lastSmallLaserFiredAt = this.game.time.now;
    var smallLaserBeam = this.smallLaserPool.getFirstDead();
    if (smallLaserBeam === null || smallLaserBeam === undefined) return;
    smallLaserBeam.revive();
    smallLaserBeam.checkWorldBounds = true;
    smallLaserBeam.outOfBoundsKill = true;
    var rotation = this.playerArm.rotation;
    if (this.facing === 'left')
    {
        rotation += Math.PI;
        smallLaserBeam.reset(
        this.playerArm.x + 38*Math.cos(rotation) + 16*Math.sin(rotation), 
        this.playerArm.y + 38*Math.sin(rotation) - 16*Math.cos(rotation));
        var spread = Math.floor(this.gaussian() * 100);
        smallLaserBeam.body.velocity.x = 
            this.SMALL_LASER_SPEED*Math.cos(rotation) + 
            spread*Math.cos(rotation+Math.PI/2);
        smallLaserBeam.body.velocity.y = 
            this.player.body.velocity.y + 
            this.SMALL_LASER_SPEED*Math.sin(rotation) + 
            spread*Math.sin(rotation+Math.PI/2);
    }
    else
    {
        smallLaserBeam.reset(
        this.playerArm.x + 38*Math.cos(rotation) - 16*Math.sin(rotation), 
        this.playerArm.y + 38*Math.sin(rotation) + 16*Math.cos(rotation));
        var recoil = Math.floor(this.gaussian() * 80) + 1;
        smallLaserBeam.body.velocity.x = 
            this.SMALL_LASER_SPEED*Math.cos(rotation) + 
            recoil*Math.cos(rotation+Math.PI/2);
        smallLaserBeam.body.velocity.y = 
            this.player.body.velocity.y + 
            this.SMALL_LASER_SPEED*Math.sin(rotation) + 
            recoil*Math.sin(rotation+Math.PI/2);
    }
    this.smallLasersfx.play('',0,1,false);
};

MainGameState.prototype.gaussian = function()
{
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
};

MainGameState.prototype.render = function() 
{

};

MainGameState.prototype.shutdown = function() 
{
    this.enemies.destroy();
    this.player.destroy();
    this.music.destroy();
    this.smallLaserPool.destroy();
    this.enemies.destroy();
    this.explosionsPool.destroy();
    this.jumpsfx.destroy();
    this.smallLasersfx.destroy();
    this.map.destroy();
    this.playerArm.destroy();
    this.bossBattleMusic.destroy();
    this.bossHurtsfx.destroy();
    this.bossBulletPool.destroy();
};