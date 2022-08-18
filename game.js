const config = {
    type: Phaser.AUTO,
    width : 1300,
    height: 650,
    backgroundColor: "#999999",
    audio: {
        disableWebAudio: false
      },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true
            //debug: true
        }
    },
    scene:[MenuScene,PauseScene,BuyTroopScene,ArenaScene],
    scale: {
        zoom: 1,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NONE
    }
};

const game = new Phaser.Game(config);

let gameState = {
    gameWindow:{
        width: 1300,
        height: 650
    },
    
    money: 200,
    
    
    //humans
    
    //Turret
    raitoSamuraiStats:{
        name: 'Raito Samurai',
        description: 'Heavy Armoured Melee Unit.',
        sprite: 'samurai',
        cost: 100,
        health: 200,
        speed: 75,
        sightRange: 175,
        attackRange: 50,
        damage: 30,
        fireRate: 1800,
        type: 'ground',
        trainTime: 40000,
        building: false,
        armour: 1,
        target: 'ground',
        attack: function(scene,troop){
            troop.target.health -= (gameState.raitoSamuraiStats.damage-troop.target.armour);
        },
        death: function(scene,troop){
            troop.destroy();
        }
    },
    raitoBowsmanStats:{
        name: 'Raito Bowsman',
        description: 'Medium damage Ranged Unit.',
        sprite: 'raitoBowsman',
        cost: 125,
        health: 150,
        speed: 90,
        sightRange: 225,
        attackRange: 170,
        damage: 20,
        fireRate: 1500,
        type: 'ground',
        trainTime: 45000,
        building: false,
        armour: 0,
        target: 'ground&air',
        attack: function(scene,troop){
            var arrow = gameState.bullets.create(troop.x,troop.y, `arrow`);
            arrow.setRotation(Phaser.Math.Angle.Between(troop.x,troop.y,troop.target.x,troop.target.y)); 
            scene.physics.moveTo(arrow, troop.target.x, troop.target.y,1300);
            scene.physics.add.overlap(arrow, troop.target,(arrow, targ)=>{
                arrow.destroy();
                troop.target.health -= (gameState.raitoBowsmanStats.damage-troop.target.armour);
            });
        },
        death: function(scene,troop){
            troop.destroy();
        }
    },
    
    raitoHqStats:{
        name: 'Raito Hq',
        description: 'Main Raito HeadQuarters.',
        sprite: 'raitoHq',
        cost: 500,
        health: 2000,
        sightRange: 350,
        attackRange: 50,
        armour: 0,
        death: function(scene,troop){
            troop.destroy();
        }
    },
    
    raitoDojoStats:{
        name: 'Raito Dojo',
        description: 'Building to train Raito Warriors.',
        sprite: 'raitoDojo',
        cost: 200,
        health: 800,
        sightRange: 350,
        attackRange: 50,
        armour: 0,
        ability1:{
            icon: 'raitoSamuraiIcon',
            make: function(scene, building){
                
                //Train Samurai
                building.action2 = gameState.border.add.image(1140,585,`${gameState.raitoDojoStats.ability1.icon}`).setOrigin(0,0).setInteractive();
                building.action2.on('pointerover', () => {
                    gameState.buttonInfo.setText('Train Samurai');
                });
                building.action2.on('pointerdown', () => {
                    if(gameState.money >= gameState.raitoSamuraiStats.cost){
                        gameState.money -= gameState.raitoSamuraiStats.cost;
gameState.createTroop(scene,gameState.raitoSamuraiStats,gameState.playerTeam,'Yellow',Math.ceil(Math.random()*building.body.width)+building.x,building.y+building.body.height/2);
                    }
                });
            }
        },
        ability2:{
            icon: 'raitoBowsmanIcon',
            make: function(scene, building){
                building.action1 = gameState.border.add.image(1200,585,`${gameState.raitoDojoStats.ability2.icon}`).setOrigin(0,0).setInteractive();
                building.action1.on('pointerover', () => {
                    gameState.buttonInfo.setText('Train Bowsman');
                });
                building.action1.on('pointerdown', () => {  
                    if(gameState.money >= gameState.raitoBowsmanStats.cost){
                        gameState.money -= gameState.raitoBowsmanStats.cost;
                        gameState.createTroop(scene,gameState.raitoBowsmanStats,gameState.playerTeam,'Yellow',Math.ceil(Math.random()*building.body.width)+building.x,building.y+building.body.height/2);
                    }
                });
            }
        },
        death: function(scene,building){
            building.destroy();
            if(building.buyBowsman){
                building.buyBowsman.destroy();
            }
            if(building.buySamurai){
                building.buyBowsman.destroy();
            }
        }
    },
    
    
    
    raitoMineStats:{
        name: 'Raito Mine',
        description: 'Produces Money',
        sprite: 'raitoMine',
        cost: 100,
        health: 250,
        armour: 0,
        passive1:{
            icon: 'raitoMineIcon',
            make: function(scene, building){
                building.passive1 = scene.time.addEvent({
                    delay: 8000,
                    callback: ()=>{
                        gameState.money += 16;
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            }
        },
        death: function(scene,building){
            building.destroy();
        }
    },
    
    
    
    raitoTowerStats:{
        name: 'Raito Tower',
        description: 'Raito defense building.',
        sprite: 'raitoTower',
        cost: 150,
        health: 200,
        attackRange: 250,
        fireRate: 1000,
        damage: 20,
        armour: 1,
        attack: function(scene,building){
            var arrow = gameState.bullets.create(building.x,building.y, `arrow`);
            arrow.setRotation(Phaser.Math.Angle.Between(building.x,building.y,building.target.x,building.target.y)); 
            scene.physics.moveTo(arrow, building.target.x, building.target.y,1300);
            scene.physics.add.overlap(arrow, building.target,(arrow, targ)=>{
                arrow.destroy();
                building.target.health -= (gameState.raitoTowerStats.damage-building.target.armour);
            });
        },
        death: function(scene,building){
            building.destroy();
        }
    },
    
 
    
    
    AiMovement: {
        attackers: [],
        move: function(scene,unit,x,y){
            unit.moving = true;
            unit.attacking = false;
            unit.target = 0;
            if(unit.movement){
                unit.movement.destroy();
            }
            if(unit.movement2){
                unit.movement2.destroy();
            }
            if(unit.x > scene.input.x){
                unit.flipX = true;
            } else {
                unit.flipX = false;
            }
            
            unit.movement2 = scene.time.addEvent({
                delay: (Phaser.Math.Distance.BetweenPoints(unit, scene.input)/unit.speed)*1000,
                callback: ()=>{
                    if(unit.body !== undefined){
                        unit.setVelocityX(0);
                        unit.setVelocityY(0);
                        unit.moving = false;
                        if(unit.movement){
                            unit.movement.destroy();
                        }
                    }
                },  
                startAt: 0,
                timeScale: 1
            }); 
            
            unit.movement = scene.time.addEvent({
                delay: (Phaser.Math.Distance.BetweenPoints(unit, scene.input)/unit.speed)*10,
                callback: ()=>{
                    if(unit.body !== undefined && unit.target == 0){
                        unit.anims.play(`${unit.stats.sprite}Move`+unit.color,true);
                        scene.physics.moveTo(unit, x, y,unit.speed);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: 90
            }); 
        },
        attack: function(scene,group,x,y){
            var enemyAttackers = [];
            for(var i = 0; i < group.length; i++){
                enemyAttackers[i] = group[i];
            }
            scene.time.addEvent({
                delay: 1500,
                callback: ()=>{
                    if(enemyAttackers.length > 0){
                        for(var i = 0; i < enemyAttackers.length; i++){
                            gameState.AiMovement.move(scene,enemyAttackers[i], 100,300);
                            enemyAttackers[i].attacking = true;
                        }
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    
    
    createHealthBar: function(scene, object,maxHP){
        var hbBG = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0xff0000).setScale(object.body.width/100).setDepth(window.innerHeight);  
        var hb = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0x2ecc71).setScale(object.body.width/100).setDepth(window.innerHeight);
        var checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                if(object.health > 0){
                    hbBG.x = object.x;
                    hbBG.y = (object.y-object.body.height/2)-10;
                    hb.x = object.x;
                    hb.y = (object.y-object.body.height/2)-10;
                    hb.width = object.health/maxHP*100;
                } else {
                    hbBG.destroy();
                    hb.destroy();
                    checkHealth.destroy();
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    },
    
    selectMenu:{
        group: [],
        selectTroop: function(scene, troop){
            if(gameState.playerTeam == troop.team){
                if(troop.selected == false){
                    troop.selected = true;
                    gameState.selectMenu.group.push(troop);
                    troop.selectedCircle = scene.add.image(troop.x,troop.y,'selectedCircle').setScale((troop.body.width-10)/30);
                    var checkSelect = scene.time.addEvent({
                        delay: 1,
                        callback: ()=>{
                            troop.selectedCircle.x = troop.x;
                            troop.selectedCircle.y = troop.y;
                            if(troop.selected == false){
                                gameState.selectMenu.group.splice(gameState.selectMenu.group.indexOf(troop),1);
                                troop.selectedCircle.destroy();
                                checkSelect.destroy();
                            }
                        },  
                        startAt: 0,
                        timeScale: 1,
                        repeat: -1
                    });
                } else {
                    /*troop.selected = false;
                    gameState.selectMenu.group.splice(gameState.selectMenu.group.indexOf(troop),1);*/
                }
            }
        },
        create: function(scene){
            var detectRC = scene.input.on('pointerdown', function (pointer) {
                if (pointer.rightButtonDown()){
                    if(gameState.selectMenu.group.length > 0){
                        for (var i = 0; i < gameState.selectMenu.group.length; i++){
                            gameState.selectMenu.group[i].moving = true;
                            gameState.selectMenu.move(scene,gameState.selectMenu.group[i]);
                        }
                    }
                }
            }, scene);
            
            var totalAttack = 0;
            scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(gameState.selectMenu.group.length == 0){
                        gameState.selectedInfo.setText(``);
                    }
                    else if(gameState.selectMenu.group.length == 1){
                        gameState.selectedInfo.setText(`${gameState.selectMenu.group[0].stats.name}  ${gameState.selectMenu.group[0].health}/${gameState.selectMenu.group[0].stats.health}`);
                    } else {
                        gameState.selectedInfo.setText(`Amount Selected ${gameState.selectMenu.group.length}`);
                    }
                    
                    if(gameState.keys.S.isDown){
                        if(gameState.selectMenu.group.length > 0){
                            for (var i = 0; i < gameState.selectMenu.group.length; i++){
                                gameState.selectMenu.group[i].moving = false;
                                gameState.selectMenu.group[i].attacking = false;
                                gameState.selectMenu.group[i].target = 0;
                                if(gameState.selectMenu.group[i].movement){
                                    gameState.selectMenu.group[i].movement.destroy();
                                }
                                if(gameState.selectMenu.group[i].movement2){
                                    gameState.selectMenu.group[i].movement2.destroy();
                                }
                            }
                        }
                    }
                    
                    if(gameState.keys.A.isDown && gameState.troops.getChildren().length !== gameState.selectMenu.group.length){
                        for (var i = 0; i < gameState.troops.getChildren().length; i++){
                            if(gameState.troops.getChildren()[i].team == gameState.playerTeam && gameState.troops.getChildren()[i].selected == false){
                                gameState.selectMenu.selectTroop(scene,gameState.troops.getChildren()[i]);
                            }
                        }
                    }
                    
                    if(gameState.keys.W.isDown){
                        for (var i = 0; i < gameState.selectMenu.group.length; i++){
                            gameState.selectMenu.group[i].attacking = true;
                        }
                    } 
                    
                    if(gameState.keys.ESC.isDown){
                        gameState.selectMenu.empty(scene);
                        if(gameState.print){
                            gameState.print.destroy();
                        }
                        if(gameState.bluePrint.check){
                            gameState.bluePrint.check.destroy();
                        }
                    }
                    for (var i = 0; i < gameState.selectMenu.group.length; i++){
                        if(gameState.selectMenu.group[i].body == undefined){
                            gameState.selectMenu.group.splice(gameState.selectMenu.group.indexOf(gameState.selectMenu.group[i]),1);
                        }
                    }
                },  
                startAt: 0,
                repeat: -1,
                timeScale: 1
            }); 
        },
        move: function(scene,unit){
            unit.moving = true;
            unit.attacking = false;
            unit.target = 0;
            if(unit.movement){
                unit.movement.destroy();
            }
            if(unit.movement2){
                unit.movement2.destroy();
            }
            if(unit.x > scene.input.x){
                unit.flipX = true;
            } else {
                unit.flipX = false;
            }
            var x = scene.input.x;
            var y = scene.input.y;
            
            unit.movement2 = scene.time.addEvent({
                delay: (Phaser.Math.Distance.BetweenPoints(unit, scene.input)/unit.speed)*1000,
                callback: ()=>{
                    if(unit.body !== undefined){
                        unit.setVelocityX(0);
                        unit.setVelocityY(0);
                        unit.moving = false;
                        if(unit.movement){
                            unit.movement.destroy();
                        }
                    }
                },  
                startAt: 0,
                timeScale: 1
            }); 
            
            unit.movement = scene.time.addEvent({
                delay: (Phaser.Math.Distance.BetweenPoints(unit, scene.input)/unit.speed)*10,
                callback: ()=>{
                    if(unit.body !== undefined && unit.target == 0){
                        unit.anims.play(`${unit.stats.sprite}Move`+unit.color,true);
                        scene.physics.moveTo(unit, x, y,unit.speed);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: 90
            }); 
        },
        empty: function(scene){
            for (var i = 0; i < gameState.selectMenu.group.length; i++){
                gameState.selectMenu.group[i].selected = false;
            }
        }
    },
    
    
    
    
    createTroop: function(scene,troopStats,team,unitColor, x, y){
        var troop = gameState.troops.create(x,y, `${troopStats.sprite}`+unitColor).setInteractive({ pixelPerfect: true });
        
        troop.moving = false;
        troop.attacking = false;
        
        
        
        troop.health = troopStats.health;
        troop.maxHealth = troopStats.health;
        troop.target;
        troop.team = team;
        troop.type = troopStats.type;
        troop.armour = troopStats.armour;
        troop.color = unitColor;
        troop.speed = troopStats.speed;
        troop.selected = false;
        troop.selectedCircle;
        troop.stats = troopStats;
        troop.movement;
        troop.movement2;
        
        if(troop.type == 'ground'){
            troop.depth = 1;
        } else if (troop.type == 'air'){
            troop.depth = 5;
        } else {
            troop.depth = 0;
        }
        
        troop.on('pointerdown', () => {
            if(!gameState.keys.A.isDown){
                gameState.selectMenu.selectTroop(scene,troop);
            }
		});
        
        for (var i = 0; i < gameState.troops.getChildren().length; i++){ 
            if(gameState.troops.getChildren()[i].type == troop.type && gameState.troops.getChildren()[i].team == troop.team){
                scene.physics.add.collider(troop, gameState.troops.getChildren()[i]);
            }
        }
        
        
        if(troopStats.width){
            troop.body.width = troopStats.width;
            troop.body.offset.y = troopStats.width/5;
        } if (troopStats.height){
            troop.body.height = troopStats.height;
            troop.body.offset.y = troopStats.height/5;
        }
        
        gameState.createHealthBar(scene,troop,troopStats.health);
        
        
        var attackLoop = scene.time.addEvent({
            delay: troopStats.fireRate,
            callback: ()=>{
                troopStats.attack(scene,troop);
                troop.anims.play(`${troopStats.sprite}Attack`+troop.color,true);
                if(troop.target.x > troop.x){
                    troop.flipX = false;
                }else {
                    troop.flipX = true;
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
        attackLoop.paused = true;
        
        var closest = 10000;
        troop.target = 0;
        var mainLoop = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                if(troop.health > 0){
                    troop.setDepth(troop.y);
                    if(troop.moving == false || troop.attacking == true){
                        if(troop.target == 0 || troop.target.health <= 0 || Phaser.Math.Distance.BetweenPoints(troop.target, troop)> troopStats.sightRange){
                        if(troop.moving == false){
                            troop.anims.play(`${troopStats.sprite}Idle`+troop.color,true);
                        }
                        troop.target = 0;
                        attackLoop.paused = true;
                        for (var i = 0; i < gameState.troops.getChildren().length; i++){ 
                            dist = Phaser.Math.Distance.BetweenPoints(gameState.troops.getChildren()[i], troop);
                            if(dist < troopStats.sightRange && gameState.troops.getChildren()[i].team != troop.team){
                                if(troop.target == 0){
                                    troop.target = gameState.troops.getChildren()[i];
                                } else {
                                    if(Phaser.Math.Distance.BetweenPoints(troop.target, troop) > Phaser.Math.Distance.BetweenPoints(gameState.troops.getChildren()[i], troop)){
                                        troop.target = gameState.troops.getChildren()[i];
                                    }
                                }
                            }
                        }
                        if(troop.target == 0){
                            if(troop.moving == false && troop.attacking == false){
                                troop.setVelocityX(0);
                                troop.setVelocityY(0);
                            }
                            for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                                dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], troop);
                                if(dist < troopStats.sightRange && gameState.buildings.getChildren()[i].team != troop.team){
                                    if(troop.target == 0){
                                        troop.target = gameState.buildings.getChildren()[i];
                                    } else {
                                        if(Phaser.Math.Distance.BetweenPoints(troop.target, troop) > Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], troop)){
                                            troop.target = gameState.buildings.getChildren()[i];
                                        }
                                    }
                                }
                            }
                        }
                        }else {
                            if(Phaser.Math.Distance.BetweenPoints(troop.target, troop) <= troopStats.attackRange){
                                attackLoop.paused = false;
                                troop.setVelocityX(0);
                                troop.setVelocityY(0);
                            }else {
                                troop.anims.play(`${troopStats.sprite}Move`+troop.color,true);
                                attackLoop.paused = true;
                                if(troop.target.x > troop.x){
                                    troop.flipX = false;
                                }else {
                                    troop.flipX = true;
                                }
                                scene.physics.moveTo(troop, troop.target.x, troop.target.y,troopStats.speed);
                            }
                        }
                    }
                } else {
                    attackLoop.destroy();
                    mainLoop.destroy();
                    if(troop.movement){
                        troop.movement.destroy();
                    } else if (troop.movement2){
                        troop.movement2.destroy();
                    }
                    if(troop.selectedCircle){
                        troop.selectedCircle.destroy();
                    }
                    troop.destroy();
                }
                
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
    },
    
    //BUILDING
    //BUIDLIFNDGSG
    //da
    //asddsa
    bluePrint: {
        make: function(scene,buildStats,color){
            if(gameState.print){
                gameState.print.destroy();
            }
            if(gameState.bluePrint.check){
                gameState.bluePrint.check.destroy();
            }
            gameState.overlap = 0;
            gameState.print = scene.physics.add.sprite(gameState.input.x, gameState.input.y,`${buildStats.sprite}${color}`).setInteractive();
            gameState.bluePrint.check = scene.time.addEvent({
                delay: 10,
                callback: ()=>{
                    gameState.print.x = gameState.input.x;
                    gameState.print.y = gameState.input.y;
                    gameState.overlap++;
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            gameState.arena.physics.add.overlap(gameState.buildings, gameState.print,(print, build)=>{
                gameState.overlap = 0; 
            });
            gameState.print.on('pointerdown', () => {
                 if(gameState.overlap > 0 && gameState.money >= buildStats.cost){
                     gameState.money -= buildStats.cost;
                     gameState.createBuilding(gameState.globalScene,buildStats,gameState.playerTeam,color, gameState.input.x, gameState.input.y);
                 }
            });
        }
    },
    
    
    createBuilding: function(scene,buildStats,team,unitColor, x, y, AI){
        var building = gameState.buildings.create(x,y, `${buildStats.sprite}`+unitColor).setImmovable().setInteractive({ pixelPerfect: true });
        
        building.health = buildStats.health;
        building.maxHealth = buildStats.health;
        building.stats = buildStats;
        building.selected = false;
        building.team = team;
        building.armour = buildStats.armour;
        building.setDepth(building.y);
        building.target = 0;
        
        var AIbehavior; 
        if(AI == true){
            AIbehavior = scene.time.addEvent({
                delay: Math.ceil(Math.random()*2000+39000),
                callback: ()=>{gameState.createTroop(scene,gameState.raitoSamuraiStats,team,`${unitColor}`,Math.ceil(Math.random()*building.body.width)+building.x,building.y+building.body.height/2);
                    gameState.AiMovement.attackers.push(gameState.troops.getChildren()[gameState.troops.getChildren().length-1]);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
        }
        if(buildStats.passive1){
            buildStats.passive1.make(scene,building,gameState.border);
        }
        
        buildStats.attackLoop;
        if(buildStats.attack){
            building.attackLoop = scene.time.addEvent({
                delay: buildStats.fireRate,
                callback: ()=>
                {
                    buildStats.attack(scene,building);
                    building.anims.play(`${buildStats.sprite}Attack`+unitColor,true);
                    if(building.target.x > building.x){
                        building.flipX = false;
                    }else {
                        building.flipX = true;
                    }
                },
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            building.attackLoop.paused = true;
        }
        
        
        building.on('pointerdown', () => {
            if(!gameState.keys.A.isDown && !gameState.keys.ESC.isDown){
                if(gameState.playerTeam == building.team && building.selected == false){
                    if(buildStats.ability1){
                        buildStats.ability1.make(scene,building,gameState.border);
                    }
                    if(buildStats.ability2){
                        buildStats.ability2.make(scene,building,gameState.border);
                    }
                    gameState.selectMenu.empty(scene);
                    building.selected = true;
                    gameState.selectMenu.group.push(building);
                    building.selectedCircle = scene.add.image(building.x,building.y,'selectedCircle').setScale((building.body.width-10)/30);
                    var checkSelect = scene.time.addEvent({
                        delay: 100,
                        callback: ()=>{
                            if(gameState.selectMenu.group.length > 1){
                                building.selected = false;
                            }
                            building.selectedCircle.x = building.x;
                            building.selectedCircle.y = building.y;
                            if(building.selected == false){
                                gameState.buttonInfo.setText('');
                                gameState.selectMenu.group.splice(gameState.selectMenu.group.indexOf(building),1);
                                building.selectedCircle.destroy();
                                checkSelect.destroy();
                                if(building.action1){
                                    building.action1.destroy();
                                }
                                if(building.action2){
                                    building.action2.destroy();
                                }
                            }
                        },  
                        startAt: 0,
                        timeScale: 1,
                        repeat: -1
                    });
                }
            }
		});
        
        
        
        gameState.createHealthBar(scene,building,buildStats.health);
        
        
        var mainLoop = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                if(building.health > 0){
                    if(buildStats.attack){
                        for (var i = 0; i < gameState.troops.getChildren().length; i++){ 
                            dist = Phaser.Math.Distance.BetweenPoints(gameState.troops.getChildren()[i], building);
                            if(dist <= buildStats.attackRange && gameState.troops.getChildren()[i].team != building.team){
                                building.attackLoop.paused = false;
                                if(building.target !== 0 && dist > Phaser.Math.Distance.BetweenPoints(building.target, building)){
                                   
                                }else {
                                    building.target = gameState.troops.getChildren()[i];
                                }
                            }
                        }
                        if(building.target.health <= 0||building.target !== 0 && Phaser.Math.Distance.BetweenPoints(building.target, building) > buildStats.attackRange){
                            building.target = 0;
                            building.attackLoop.paused = true;
                        }
                    }
                }else {
                    if(building.selectedCircle){
                        building.selectedCircle.destroy();
                    }
                    if(building.action1){
                        building.action1.destroy();
                    }
                    if(buildStats.attack){
                        building.attackLoop.destroy();
                    }
                    if(AIbehavior){
                        AIbehavior.destroy();
                    }
                    mainLoop.destroy();
                    if(building.passive1){
                        building.passive1.destroy();
                    }
                    building.destroy();
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
    },
    
    
    createBloodDeath: function(scene,x,y,scale){
        var blood = scene.physics.add.sprite(x,y,`bloodDeath`).setScale(scale).setDepth(0);
        blood.anims.play('bloodDeathMove',true);
        scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                blood.destroy();
            },  
            startAt: 0,
            timeScale: 1
        }); 
    },
    
    createExplosion: function(scene,x,y,scale){
        var explode = scene.physics.add.sprite(x,y,`buildingExplosion`).setScale(scale).setDepth(5);
        explode.anims.play('explode',true);
        scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                explode.destroy();
            },  
            startAt: 0,
            timeScale: 1
        }); 
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}