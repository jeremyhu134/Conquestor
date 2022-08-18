class BuyTroopScene extends Phaser.Scene {
    constructor() {
		super({ key: 'BuyTroopScene' })
	}
    preload(){
        
    }
    create() {
        this.scene.bringToTop();
        
        gameState.border = this;
        
        gameState.showMoney = this.add.text( 10, 10, `${gameState.money}`, {
            fill: '#OOOOOO', 
            fontSize: '25px',
            fontFamily: 'Qahiri',
            strokeThickness: 5,
        });
        
        gameState.selectedInfo = this.add.text( 750, 590, `Select Troop`, {
            fill: '#OOOOOO', 
            fontSize: '25px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        });
        
        gameState.buttonInfo = this.add.text( 500, 590, ``, {
            fill: '#OOOOOO', 
            fontSize: '25px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        });
       gameState.builds = [];
        
	}
    update(){
        gameState.showMoney.setText(`${gameState.money}`);
        if(gameState.selectMenu.group.length <= 0){
            if(gameState.race == 'Raito'){
                if(!gameState.builds[0]){
                    gameState.builds[0] = gameState.border.add.image(800,585,`raitoHqIcon`).setOrigin(0,0).setInteractive();
                    gameState.builds[0].on('pointerover', () => {
                        gameState.buttonInfo.setText('Raito Hq '+`$${gameState.raitoHqStats.cost}`);
                    });
                    gameState.builds[0].on('pointerdown', () => {    
                        gameState.bluePrint.make(gameState.border,gameState.raitoHqStats,gameState.color);
                    });
                }
                if(!gameState.builds[1]){
                    gameState.builds[1] = gameState.border.add.image(860,585,`raitoDojoIcon`).setOrigin(0,0).setInteractive();
                    gameState.builds[1].on('pointerover', () => {
                        gameState.buttonInfo.setText('Raito Dojo '+`$${gameState.raitoDojoStats.cost}`);
                    });
                    gameState.builds[1].on('pointerdown', () => {    
                        gameState.bluePrint.make(gameState.border,gameState.raitoDojoStats,gameState.color);
                    });
                }
                if(!gameState.builds[2]){
                    gameState.builds[2] = gameState.border.add.image(920,585,`raitoMineIcon`).setOrigin(0,0).setInteractive();
                    gameState.builds[2].on('pointerover', () => {
                        gameState.buttonInfo.setText('Raito Mine '+`$${gameState.raitoMineStats.cost}`);
                    });
                    gameState.builds[2].on('pointerdown', () => {    
                        gameState.bluePrint.make(gameState.border,gameState.raitoMineStats,gameState.color);
                    });
                }
                if(!gameState.builds[3]){
                    gameState.builds[3] = gameState.border.add.image(980,585,`raitoTowerIcon`).setOrigin(0,0).setInteractive();
                    gameState.builds[3].on('pointerover', () => {
                        gameState.buttonInfo.setText('Raito Tower '+`$${gameState.raitoTowerStats.cost}`);
                    });
                    gameState.builds[3].on('pointerdown', () => {    
                        gameState.bluePrint.make(gameState.border,gameState.raitoTowerStats,gameState.color);
                    });
                }
            }
        } else {
            if(gameState.builds.length > 0){
                for(var i = 0; i < gameState.builds.length; i++){
                    gameState.builds[i].destroy();
                    gameState.builds.splice(gameState.builds.indexOf(gameState.builds[i]),1);
                }
            }
        }
    }
}