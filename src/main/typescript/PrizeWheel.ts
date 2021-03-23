module deep.games.prizewheel {

    export class PrizeWheel extends createjs.Container {

        private wheel:Wheel;

        constructor () {
            super();

            var background:createjs.Shape = new createjs.Shape();
            background.graphics
                .f(deep.Bridge.GameInfo.GameDescriptor.getColor("background"))
                .dr(0,0,deep.Bridge.DisplayInfo.StageWidth,deep.Bridge.DisplayInfo.StageHeight)
                .ef();
            this.addChild(background);

            if (deep.Bridge.GameAssets.hasAsset("background")) {
                var backgroundImage:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("background"));
                sdk.utils.CreateJSUtils.centerReg(backgroundImage);
                sdk.utils.CreateJSUtils.centerStage(backgroundImage);
                this.addChild(backgroundImage);
            }

            if (deep.Bridge.GameAssets.hasAsset("logo")) {
                var logo:createjs.Container = sdk.utils.CreateJSUtils.makeResizedWrapper(
                    new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("logo")),
                    deep.Bridge.DisplayInfo.StageWidth - 20,
                    180
                );

                sdk.utils.CreateJSUtils.centerRegX(logo);
                sdk.utils.CreateJSUtils.centerStageX(logo);
                this.addChild(logo);
            }


            this.wheel = new Wheel();
            this.wheel.scaleX = this.wheel.scaleY = .9;
            this.wheel.x = 80;
            this.wheel.y = 700;
            this.addChild(this.wheel);
            this.wheel.drawWheel();

            

            //wheel.scaleX = wheel.scaleY = 0;
            //wheel.x -= 300;
            //wheel.y += 150;
            //createjs.Tween.get(wheel)
            //    .to( { scaleX:0.9, scaleY:0.9, x:wheel.x+300, y:wheel.y-150 }, 500 );
        }

    }

}