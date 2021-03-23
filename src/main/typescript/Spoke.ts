module deep.games.prizewheel {

    export class Spoke extends createjs.Container {

        private sprite:createjs.Sprite;

        constructor ( private spokeNum:number ) {
            super();

            var base:createjs.Shape = new createjs.Shape();
            base.graphics
                .f("#333")
                .dr(0,0,520,4)
                .ef();
            base.regY = 2;
            this.addChild(base);

            var spitesheetData:any = {
                images: [ new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("spokelight")).image ],
                frames: [
                    [0,0,520,14,0,0,7],
                    [0,14,520,14,0,0,7],
                    [0,28,520,14,0,0,7],
                    [0,42,520,14,0,0,7],
                    [0,56,520,14,0,0,7],
                    [0,70,520,14,0,0,7],
                    [0,84,520,14,0,0,7],
                    [0,98,520,14,0,0,7],
                    [0,112,520,14,0,0,7]
                ]
            };

            var spritesheet:createjs.SpriteSheet = new createjs.SpriteSheet( spitesheetData );

            this.sprite = new createjs.Sprite(spritesheet);
            this.addChild(this.sprite);

            this.sprite.gotoAndStop( Color.Off );
        }

        public intro ( scheme:ColorScheme ) : void {
            this.reset();
            scheme.reset();

            var alt:boolean = this.spokeNum%2 === 0;

            // This line does not work if i put it inside a call that occurs as the first operation in the tween.
            // I think that something in TweenJS is bugged if the call is in the same frame tick as the tween is created.
            // Putting wait(0) or .to( { alpha:1 }, 0 ) in front doesnt help either as the 0-duration makes the call
            // occur within the same frame.
            this.sprite.scaleX = 0;
            this.sprite.gotoAndStop( scheme.next() );

            if ( scheme.SchemeSetting === "Rainbow" ) {
                createjs.Tween.get(this.sprite, { useTicks:true })
                    // Shoot Color 1
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 2
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 3
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait(15)
                    // Shoot Color 4
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 5
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait(15)
                    // Shoot Color 6
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Delay
                    .wait( 50 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        this.sprite.gotoAndStop(Color.Off);
                    } )
            } else {
                createjs.Tween.get(this.sprite, { useTicks:true })
                    // Shoot Color 1
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 2
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 1
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait(15)
                    // Delay
                    .wait( 50 )
                    // Solid Color 2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ); } )
                    .wait( 30 )
                    // Solid Color 1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ); } )
                    .wait( 30 )
                    // Solid Color 2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ); } )
                    .wait( 30 )
                    // Solid Color 1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ); } )
                    .wait( 30 )
                    // Flash 1/2
                    .call( () => { this.sprite.gotoAndStop( (alt) ? scheme.current() : scheme.next() ) } )
                    .wait( 12 )
                    // Flash 2/1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 1/2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 2/1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 1/2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 2/1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 1/2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Flash 2/1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 12 )
                    // Off
                    .call( () => { this.sprite.gotoAndStop( Color.Off ) } )
            }
        }

        public idle ( scheme:ColorScheme ) : void {
            this.reset();
            scheme.reset();

            if (scheme.SchemeSetting === "Rainbow") {

                var frame:number = (this.spokeNum % 6) + 1;
                if (frame > 6) frame = frame % 6;
                this.sprite.gotoAndStop(frame);

                createjs.Tween.get(this.sprite, { useTicks:true })
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        var frame:number = (this.spokeNum % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame);
                    } )
                    .wait( 10 )
                    //
                    .call( () => {
                        this.sprite.gotoAndStop(Color.Off);
                    } )
            } else {
                this.sprite.gotoAndStop( scheme.next() );

                createjs.Tween.get(this.sprite, { useTicks:true, override:true })
                    // Shoot Color 2
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 1
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 2
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Shoot Color 1
                    .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                    .to( { scaleX: 0 }, 0 )
                    .to( { scaleX: 1 }, 15 )
                    .wait( 15 )
                    // Off
                    .call( () => { this.sprite.gotoAndStop(Color.Off) } );
            }
        }

        public spin ( scheme:ColorScheme ) : void {
            this.reset();
            this.sprite.gotoAndStop(Color.Off);
        }

        public win ( scheme:ColorScheme ) : void {
            this.reset();

            this.sprite.gotoAndStop(scheme.next());

            createjs.Tween.get(this.sprite, { useTicks:true, override:false, loop:-1 })
                .wait( 20 )
                .call( () => { this.sprite.gotoAndStop(Color.Off) } )
                .wait( 10 )
                .call( () => { this.sprite.gotoAndStop(scheme.next()) } )
                .wait( 1 );
        }

        public solid ( scheme:ColorScheme ) : void {
            this.reset();
            for (var i:number=0; i<(this.spokeNum % scheme.SchemeColors) + 1; i++) {
                this.sprite.gotoAndStop(scheme.next());
            }
        }

        private reset () : void {
            createjs.Tween.removeTweens(this.sprite);
            this.sprite.alpha = 1;
            this.sprite.scaleX = 1;
        }

    }

}