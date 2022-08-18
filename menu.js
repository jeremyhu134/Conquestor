
class MenuScene extends Phaser.Scene {
    constructor() {
		super({ key: 'MenuScene' })
	}
    preload(){
        this.load.image('selectedCircle','images/selectedCircle.png');
        this.load.image('confirmButton','images/confirmButton.png');
        this.load.image('cancelButton','images/cancelButton.png');
        this.load.image('buildMenuButton','images/buildMenuButton.png');
        
        //Misc
        this.load.spritesheet('bloodDeath','images/bloodDeath.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('explosion','images/explosion.png',{frameWidth: 75,frameHeight:75});
        this.load.image('moneyIcon','images/moneyIcon.png');
        this.load.image('upgradeIncomeIcon','images/upgradeIncomeIcon.png');
        this.load.image('upgradeTierIcon','images/upgradeTierIcon.png');
        this.load.image('summonDefenseIcon','images/summonDefenseIcon.png');
        
        //Projectiles
        this.load.image('bullet1','images/bullet1.png');
        this.load.image('arrow','images/arrow.png');
        
        
        
       
        //Raitu 
        this.load.image('raitoHqIcon','images/raitoHqIcon.png');
        this.load.image('raitoHqYellow','images/raitoHqYellow.png');
        this.load.image('raitoHqRed','images/raitoHqRed.png');
        
        
        this.load.image('raitoDojoIcon','images/raitoDojoIcon.png');
        this.load.image('raitoDojoYellow','images/raitoDojoYellow.png');
        this.load.image('raitoDojoRed','images/raitoDojoRed.png');
        
        
        this.load.image('raitoMineIcon','images/raitoMineIcon.png');
        this.load.image('raitoMineYellow','images/raitoMineYellow.png');
        this.load.image('raitoMineRed','images/raitoMineRed.png');
        
        
        this.load.image('raitoTowerIcon','images/raitoTowerIcon.png');
        this.load.spritesheet('raitoTowerYellow','images/raitoTowerYellow.png',{frameWidth: 46,frameHeight:64});
        this.load.spritesheet('raitoTowerRed','images/raitoTowerRed.png',{frameWidth: 46,frameHeight:64});
        
        
        this.load.image('raitoSamuraiIcon','images/raitoSamuraiIcon.png');
        this.load.spritesheet('samuraiYellow','images/samuraiYellow.png',{frameWidth: 40,frameHeight:40});
        this.load.spritesheet('samuraiRed','images/samuraiRed.png',{frameWidth: 40,frameHeight:40});
        
        
        this.load.image('raitoBowsmanIcon','images/raitoBowsmanIcon.png');
        this.load.spritesheet('raitoBowsmanYellow','images/raitoBowsmanYellow.png',{frameWidth: 40,frameHeight:40});
    }
    create() {
        this.scale.pageAlignVertically = true;
        
        this.anims.create({
            key: 'samuraiIdleYellow',
            frameRate: 0,
            frames:this.anims.generateFrameNames('samuraiYellow',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'samuraiMoveYellow',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('samuraiYellow',{start: 1,end: 4})
        });
        this.anims.create({
            key: 'samuraiAttackYellow',
            frameRate: 10,
            frames:this.anims.generateFrameNames('samuraiYellow',{start: 5,end: 8})
        });
        
        //Red Raito
        this.anims.create({
            key: 'samuraiIdleRed',
            frameRate: 0,
            frames:this.anims.generateFrameNames('samuraiRed',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'samuraiMoveRed',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('samuraiRed',{start: 1,end: 4})
        });
        this.anims.create({
            key: 'samuraiAttackRed',
            frameRate: 10,
            frames:this.anims.generateFrameNames('samuraiRed',{start: 5,end: 8})
        });
        
        this.anims.create({
            key: 'raitoBowsmanIdleYellow',
            frameRate: 0,
            frames:this.anims.generateFrameNames('raitoBowsmanYellow',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'raitoBowsmanMoveYellow',
            frameRate: 11,
            repeat: -1,
            frames:this.anims.generateFrameNames('raitoBowsmanYellow',{start: 1,end: 4})
        });
        this.anims.create({
            key: 'raitoBowsmanAttackYellow',
            frameRate: 10,
            frames:this.anims.generateFrameNames('raitoBowsmanYellow',{start: 5,end: 9})
        });
        
        
        this.anims.create({
            key: 'raitoTowerAttackYellow',
            frameRate: 15,
            frames:this.anims.generateFrameNames('raitoTowerYellow',{start: 1,end: 4})
        });
        this.anims.create({
            key: 'raitoTowerAttackRed',
            frameRate: 15,
            frames:this.anims.generateFrameNames('raitoTowerRed',{start: 1,end: 4})
        });
            
        
        
        //var button = this.add.image(window.innerWidth/2,window.innerHeight/2,'startButton').setInteractive();
        gameState.globalScene = this;
        gameState.input = this.input;
        this.scene.launch("BuyTroopScene");
        gameState.globalScene.scene.start('ArenaScene');
        /*button.on('pointerdown', function(pointer){
            
        });*/
	}
    update(){
        
    }
}