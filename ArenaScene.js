class ChooseHeroScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ChooseHeroScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        
    }
    update(){
        
    }
}

class ArenaScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ArenaScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        gameState.scroll = 0;
        gameState.mapWidth = 2000;
        gameState.globalScene = this;
        gameState.arena = this;
        /*this.physics.add.collider(gameState.player, gameState.barriers,(hero,barrier)=>{
            
        });*/
        gameState.input=this.input;
        gameState.mouse=this.input.mousePointer;
        this.input.mouse.disableContextMenu();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC,LEFT,RIGHT');
        gameState.bullets = this.physics.add.group();
        gameState.enemy = this.physics.add.group();
        gameState.troops = this.physics.add.group();
        gameState.buildings = this.physics.add.group();
        
        
        gameState.camera = this.cameras.main;
        
        gameState.color = 'Yellow';
        gameState.race = 'Raito';
        gameState.playerTeam = 0;
        
        gameState.createBuilding(this,gameState.raitoHqStats,0,'Yellow',100,300);
        gameState.createBuilding(this,gameState.raitoDojoStats,0,'Yellow',300,500);
        gameState.createBuilding(this,gameState.raitoDojoStats,0,'Yellow',250,350);
        gameState.createBuilding(this,gameState.raitoMineStats,0,'Yellow',100,100);
        
        gameState.createBuilding(this,gameState.raitoHqStats,1,'Red',1200,300);
        gameState.createBuilding(this,gameState.raitoDojoStats,1,'Red',1200,600, true);
        gameState.createBuilding(this,gameState.raitoDojoStats,1,'Red',1100,300, true);
        gameState.createBuilding(this,gameState.raitoDojoStats,1,'Red',1200,100, true);
        gameState.createBuilding(this,gameState.raitoTowerStats,1,'Red',900,350);
        
        
        
        /*this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                gameState.createTroop(this,gameState.raitoSamuraiStats,1,'Red',window.innerWidth/2+Math.ceil(Math.random()*(window.innerWidth/2)),Math.ceil(Math.random()*window.innerHeight));
            },  
            startAt: 0,
            timeScale: 1,
            repeat: 19
        });*/
        
        
        gameState.selectMenu.create(this);
        
        this.time.addEvent({
            delay: 120000,
            callback: ()=>{
                this.time.addEvent({
                    delay: 75000,
                    callback: ()=>{
                        gameState.AiMovement.attack(this,gameState.AiMovement.attackers,100,300);
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            },  
            startAt: 0,
            timeScale: 1
        }); 
        
        
       
        
        
        gameState.camera.x = 0;
        gameState.camera.y = 0;
        //gameState.buildings = this.physics.add.group();
        //this.physics.add.collider(gameState.character, gameState.buildings);
        //this.physics.add.overlap(gameState.blueprint, gameState.buildings)
    }
    update(){
        if(gameState.keys.D.isDown && gameState.scroll <= gameState.mapWidth-1300){
            gameState.camera.scrollX += 10;
            gameState.scroll += 10;
        } else if (gameState.keys.A.isDown && gameState.scroll >= 10){
            gameState.camera.scrollX -= 10;
            gameState.scroll -= 10;
        }
    }
}