module deep.games.prizewheel {

    export class Light extends createjs.Container {

        private sprite:createjs.Sprite;

        constructor ( private light:number ) {
            super();

            var spitesheetData:any = {
                images: [ new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("light")).image ],
                frames: [
                    [0,0,50,50,0,0,25],
                    [50,0,50,50,0,0,25],
                    [100,0,50,50,0,0,25],
                    [150,0,50,50,0,0,25],
                    [200,0,50,50,0,0,25],
                    [250,0,50,50,0,0,25],
                    [300,0,50,50,0,0,25],
                    [350,0,50,50,0,0,25],
                    [400,0,50,50,0,0,25]
                ]
            };

            var spritesheet:createjs.SpriteSheet = new createjs.SpriteSheet( spitesheetData );

            var base:createjs.Sprite = new createjs.Sprite(spritesheet);
            base.gotoAndStop(0);
            this.addChild(base);

            this.sprite = new createjs.Sprite(spritesheet);
            this.addChild(this.sprite);
        }

        public intro ( scheme:ColorScheme, delay1:number, delay2:number ) : void {
            this.reset();
            scheme.reset();

            var alt:boolean = this.light%2 === 0;

            this.sprite.gotoAndStop(Color.Off);

            if ( scheme.SchemeSetting === "Rainbow" ) {
                createjs.Tween.get(this.sprite, { useTicks:true, override:true })
                    // Offset delay, staggers this light from it's neighbors
                    .wait( delay1 )
                    // Fade color 1
                    .call ( () => {
                        this.sprite.alpha = 0;
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 2
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 3
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() )
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 4
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() )
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 5
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() )
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 6
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() )
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Reverese Delay...syncs all the lights up again
                    .wait( delay2 )
                    // Solid Color, start at 1
                    .call( () => {
                        var frame:number = (this.light % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 2
                    .call( () => {
                        var frame:number = (this.light % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 3
                    .call( () => {
                        var frame:number = (this.light % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 4
                    .call( () => {
                        var frame:number = (this.light % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 5
                    .call( () => {
                        var frame:number = (this.light % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 6
                    .call( () => {
                        var frame:number = (this.light % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 1
                    .call( () => {
                        var frame:number = (this.light % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 2
                    .call( () => {
                        var frame:number = (this.light % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 3
                    .call( () => {
                        var frame:number = (this.light % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 4
                    .call( () => {
                        var frame:number = (this.light % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 5
                    .call( () => {
                        var frame:number = (this.light % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 6
                    .call( () => {
                        var frame:number = (this.light % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
            } else {
                createjs.Tween.get(this.sprite, { useTicks:true, override:true })
                    // Offset delay, staggers this light from it's neighbors
                    .wait( delay1 )
                    // Fade color 1
                    .call ( () => {
                        this.sprite.alpha = 0;
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 2
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color 1
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() )
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Reverese Delay...syncs all the lights up again
                    .wait( delay2 )
                    // Solid Color 1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 30 )
                    // Solid Color 2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 30 )
                    // Solid Color 1
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
                    .wait( 30 )
                    // Solid Color 2
                    .call( () => { this.sprite.gotoAndStop( scheme.next() ) } )
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
                    // Flash 1/2
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.first() );
                    } );
            }
        }

        public idle ( scheme:ColorScheme, delay1:number, delay2:number ) : void {
            this.reset();
            scheme.reset();

            var alt:boolean = this.light%2 === 0;

            if ( scheme.SchemeSetting === "Rainbow" ) {

                // Solid Color, start at 1
                var frame:number = (this.light % 6) + 6;
                if (frame > 6) frame = frame % 6;
                this.sprite.gotoAndStop(frame)

                createjs.Tween.get(this.sprite, { useTicks:true, override:true })
                    .wait( 10 )
                    // Solid Color, start at 2
                    .call( () => {
                        var frame:number = (this.light % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 3
                    .call( () => {
                        var frame:number = (this.light % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 4
                    .call( () => {
                        var frame:number = (this.light % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 5
                    .call( () => {
                        var frame:number = (this.light % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 6
                    .call( () => {
                        var frame:number = (this.light % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 1
                    .call( () => {
                        var frame:number = (this.light % 6) + 6;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 2
                    .call( () => {
                        var frame:number = (this.light % 6) + 5;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 3
                    .call( () => {
                        var frame:number = (this.light % 6) + 4;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 4
                    .call( () => {
                        var frame:number = (this.light % 6) + 3;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 5
                    .call( () => {
                        var frame:number = (this.light % 6) + 2;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
                    .wait( 10 )
                    // Solid Color, start at 6
                    .call( () => {
                        var frame:number = (this.light % 6) + 1;
                        if (frame > 6) frame = frame % 6;
                        this.sprite.gotoAndStop(frame)
                    } )
            } else {
                createjs.Tween.get(this.sprite, { useTicks:true, override:true })
                    // Offset delay, staggers this light from it's neighbors
                    .wait( delay1 )
                    // Fade Color
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade color
                    .call ( () => {
                        this.sprite.alpha = 0;
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Fade Color
                    .to( { alpha: 0 }, 0 )
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.next() );
                    } )
                    .to( { alpha: 1 }, 30 )
                    // Reverese Delay...syncs all the lights up again
                    .wait( delay2 )
                    // Solid
                    .call( () => {
                        this.sprite.gotoAndStop( scheme.first() );
                    } )
            }
        }

        public spin ( scheme:ColorScheme ) : void {
            this.reset();

            if ( scheme.SchemeSetting === "Rainbow" ) {
                // Solid Color, start at 1
                var frame:number = (this.light % 6) + 1;
                if (frame > 6) frame = frame % 6;
                this.sprite.gotoAndStop(frame);
            } else {
                this.sprite.gotoAndStop(scheme.first());
            }
        }

        public solid ( scheme:ColorScheme ) : void {
            this.reset();
            for (var i:number=0; i<(this.light % scheme.SchemeColors) + 1; i++) {
                this.sprite.gotoAndStop(scheme.next());
            }
        }

        private reset () : void {
            createjs.Tween.removeTweens(this.sprite);
            this.sprite.alpha = 1;
        }

    }

}