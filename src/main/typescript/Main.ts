
module deep.games.prizewheel {

    export var gPlayResult:sdk.messaging.PlayResultResponse;
    export var gPrizeId:string;

    export class Main extends sdk.games.AbstractCreateJSGame {

        private prizeWheel:PrizeWheel;
        private pauseManager:sdk.pause.PauseManager;

        constructor () {
            super();
        }

        protected start():void {
            this.startGame();
        }

        protected onPlayResult (response:sdk.messaging.PlayResultResponse) : void {
            gPlayResult = response;

            // Find the prize that is going to be the winner
            for (let key in response.PrizeList) {
                if (gPrizeId === undefined) {
                    gPrizeId = key;
                } else {
                    throw "Multiple Prizes Are Not Supported";
                }
            }

            if (!deep.Bridge.Demo && gPrizeId === undefined && response.Result !== sdk.gameplay.PlayResult.LOSE) {
                throw "Game must win but no prize is found";
            }
        }

        private startGame () : void {
            this.prizeWheel = new PrizeWheel();
            this.stage.addChild(this.prizeWheel);
            deep.Bridge.sendGameReady();
        }

    }

}