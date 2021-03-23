module deep.games.prizewheel {
    
        export class Preview extends sdk.games.AbstractCreateJSPreview {
    
            constructor () {
                super();
            }
    
            protected start () : void {
                var prizeWheel:PrizeWheel = new PrizeWheel();
                prizeWheel.cache(0,0,deep.Bridge.DisplayInfo.StageWidth,deep.Bridge.DisplayInfo.StageHeight);
                this.stage.addChild(prizeWheel);
            }
        }
    }
    