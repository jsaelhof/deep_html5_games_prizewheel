module deep.games.prizewheel {

    export class Wheel extends createjs.Container {

        private WHEEL_ROTATION_OFFSET:number = -80;

        // The arrow offset positions the arrow where we want it to appear on the edge of the wheel.
        // Because the arrow can be moved around, it must be factored into determining where to stop the wheel (stop angle).
        private ARROW_ROTATION_OFFSET:number = -45;

        private RADIUS:number = 520;
        private ARROW_PIVOT_RADIUS:number = 580;
        private SECTION_DEGREES:number = 30;
        private HALF_SECTION_DEGREES:number = 15;
        private HUB_RADIUS:number = 125;
        private WHEEL_SECTIONS:number = 12;
        private NUM_SPINS:number = 5;

        private spokeAnimator:SpokeAnimator = new SpokeAnimator();
        private lightsAnimator:LightAnimator = new LightAnimator();
        private wheel:createjs.Container;
        private handles:createjs.Container;
        private arrow:createjs.Container;
        private sectionData:WheelSection[];
        private stopAngle:number;
        private lastWheelAngle:number;
        private allowArrowUpdating:boolean = true;
        private idleTimeoutId:number;
        private spin:createjs.Bitmap;
        private lastSection:number;
        private font:string = "Arial";
        private largeFontSize:number = 40;
        private medFontSize:number = 32;
        private fontSize:number = 28;
        private minFontSize:number = 20;
        private fontWeight:string = "bold";
        private maxTextHeight:number = 90;
        private maxTextWidth:number = 300;
        private maxLinesOfText:number = 4;
        private maxPrizes:number;

        constructor () {
            super();
        }

        public drawWheel () : void {

            this.maxPrizes = deep.Bridge.GameInfo.GameDescriptor.getMaxPrizes();

            // ---- WHEEL SECTION INFORMATION ----

            var winColor:string = deep.Bridge.GameInfo.GameDescriptor.getColor("win");
            var loseColor:string = deep.Bridge.GameInfo.GameDescriptor.getColor("lose");
            var winTextColor:string = deep.Bridge.GameInfo.GameDescriptor.getColor("winText");
            var loseTextColor:string = deep.Bridge.GameInfo.GameDescriptor.getColor("loseText");

            // Create an fill the section data.
            // This is done based on how many prizes in the descriptor have actually been assigned.
            // Each prize is added to the wheel along with a lose section.
            // If there's the maximum of 6 prizes assigned, it works out perfectly on the wheel.
            // If there's less, then we have to repeat some of the prizes on the wheel until it's full.
            // That's what the outer loop below does. It takes the max number of prizes and
            // divides it by the assigned number of prizes to figure out how many times it has to repeat.
            // If only one prize is assigned, it will loop 6 times.
            // If 6 prizes are assigned, it will loop only once.
            // If the section data ends up with too many sections (which it will in some cases),
            // just trim off the extras...they won't appear on the wheel.
            this.sectionData = [];

            var prizes:sdk.data.IPrizeConfElement[] = deep.Bridge.GameInfo.GameDescriptor.getPrizes();

            for (var i:number = 0; i<Math.ceil(this.maxPrizes/prizes.length); i++) {
                for (var j:number=0; j<prizes.length; j++) {
                    // Create the wheel section for this prize
                    var prize:sdk.data.IPrizeConfElement = prizes[j];
                    let winText:string = deep.Bridge.GameInfo.GameDescriptor.getText(prize.elements.data.text[0]);
                    var winSection:WheelSection = new WheelSection(this.sectionData.length, prize.prizeId, winText, winColor, winTextColor, prize.elements.files.skin[0]);
                    this.sectionData.push(winSection);

                    // Create the corresponding loss section. This has nothing really to do with this prize, we just want to create
                    // one lose section for every win section.
                    var loseText:string = (deep.Bridge.GameInfo.GameDescriptor.hasText("losetext")) ? deep.Bridge.GameInfo.GameDescriptor.getText("losetext") : undefined;
                    var loseSection:WheelSection = new WheelSection(this.sectionData.length, undefined, loseText, loseColor, loseTextColor, "losebackground");
                    this.sectionData.push(loseSection);
                }
            }

            // Trim if there are more sections than 12
            if (this.sectionData.length > this.WHEEL_SECTIONS) {
                this.sectionData = this.sectionData.slice(0,this.WHEEL_SECTIONS);
            }

            // ---- ARROW BACKGROUND ----

            var arrowBackground:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("arrowbackground"));
            arrowBackground.regX = -( this.ARROW_PIVOT_RADIUS - (arrowBackground.getBounds().width/2) ); // Puts the horizontal center of the arrow background image on the arrow pivot point.
            arrowBackground.regY = arrowBackground.getBounds().height/2;
            arrowBackground.rotation = this.ARROW_ROTATION_OFFSET;
            this.addChild(arrowBackground);


            // ---- MAIN WHEEL CONTAINER (Rotatable Parts) ----

            this.wheel = new createjs.Container();
            this.wheel.rotation = this.WHEEL_ROTATION_OFFSET;


            // ---- WHEEL SECTIONS ----

            for (var i=0; i<this.sectionData.length; i++) {
                var section:createjs.Container = this.drawSection(this.sectionData[i]);
                this.wheel.addChild(section);
            }


            // ---- SPOKES ----

            for (var i=0; i<this.WHEEL_SECTIONS; i++) {
                var spoke:Spoke = new Spoke(i);
                spoke.rotation = ((i * this.SECTION_DEGREES) - this.HALF_SECTION_DEGREES);
                this.wheel.addChild(spoke);
                this.spokeAnimator.addSpoke(i,spoke);
            }

            this.addChild(this.wheel);


            // ---- WHEEL CHROME ----

            var wheelChrome:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("wheel"));
            sdk.utils.CreateJSUtils.setReg(wheelChrome,sdk.layout.Registration.BottomLeft);
            wheelChrome.x = -(this.x * (1/this.scaleX));
            wheelChrome.y = ((deep.Bridge.DisplayInfo.StageHeight - this.y) * (1/this.scaleY));
            this.addChild(wheelChrome);


            // ---- HANDLES ----

            this.handles = new createjs.Container();
            this.handles.rotation = this.WHEEL_ROTATION_OFFSET;
            this.addChild(this.handles);

            for (var i=0; i<this.WHEEL_SECTIONS; i++) {
                var handle:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("handle"));
                sdk.utils.CreateJSUtils.centerRegY(handle);
                handle.regX = -(this.RADIUS - 11); // The Radius - 11 calculation just pulls the handle back to roughly the center of the edge of the wheel. This would be different with different size wheel edges.
                handle.rotation = (this.SECTION_DEGREES * i) + this.HALF_SECTION_DEGREES;
                this.handles.addChild(handle);
            }

            // ---- LIGHTS -----

            var lights:createjs.Container = new createjs.Container();
            this.addChild(lights);

            var lightAngle:number = -(90 + this.HALF_SECTION_DEGREES);
            for (var i=0; i<50; i++) {
                var light:Light = new Light(i);
                light.regX = -(this.RADIUS + 2);
                light.rotation = lightAngle;
                lightAngle += 3;
                lights.addChild(light);
                this.lightsAnimator.addLight(i, light);
            }

            // ---- ARROW -----

            var arrowPositioner:createjs.Container = new createjs.Container();

            this.arrow = new createjs.Container();

            var arrowImage:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("arrow"));
            arrowImage.shadow = new createjs.Shadow("rgba(0,0,0,0.4)",-2,9,10);
            this.arrow.addChild(arrowImage);

            this.arrow.regX = 91;
            this.arrow.regY = this.arrow.getBounds().height/2;
            this.arrow.cache(
                -(arrowImage.shadow.offsetX + arrowImage.shadow.blur),
                0,
                arrowImage.getBounds().width + arrowImage.shadow.offsetX + arrowImage.shadow.blur,
                arrowImage.getBounds().height + arrowImage.shadow.offsetY + arrowImage.shadow.blur
            );

            arrowPositioner.addChild(this.arrow);
            arrowPositioner.regX = -(this.ARROW_PIVOT_RADIUS);
            arrowPositioner.rotation = this.ARROW_ROTATION_OFFSET;
            this.addChild(arrowPositioner);


            this.spin = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("spin"));
            sdk.utils.CreateJSUtils.centerReg(this.spin);
            this.addChild(this.spin);

            // Animate filling the slices of the wheel
            /*var nextSection:number = this.wheelSections.length - 4;
            for (var i:number=0; i<this.wheelSections.length; i++) {
                var section:createjs.Container = this.wheelSections[nextSection];
                section.scaleX = section.scaleY = 0;

                createjs.Tween.get(section)
                    .wait((section["data"].section * 80))
                    .to( { scaleX:1, scaleY:1 }, 500 );

                nextSection = (nextSection + 1 < this.wheelSections.length) ? nextSection + 1 : 0;
            }*/


            if (deep.Bridge.Preview) {
                this.spokeAnimator.solid();
                this.lightsAnimator.solid();
                

                // IMPORTANT:
                // This code is for forcing the wheel to a certain position with specific text to be used when creating posters for this game. Uncomment only when screenshotting new posters.
                /*
                this.wheel.rotation += 30;
                for (var i=0; i<12; i++) {
                    if (i%2 === 0) {
                        (<any>this.wheel.children[i]).children[2].text = "Coupon " + ((i/2)+1);
                        (<any>this.wheel.children[i]).children[2].font = "bold 30px Arial";
                        (<any>this.wheel.children[i]).children[2].regY = 15;
                    } else {
                        (<any>this.wheel.children[i]).children[2].text = "Lose";
                        (<any>this.wheel.children[i]).children[2].font = "bold 30px Arial";
                        (<any>this.wheel.children[i]).children[2].regY = 15;
                    }
                }
                */
            } else {
                let intro = () => {
                    this.spokeAnimator.intro();
                    this.lightsAnimator.intro();

                    createjs.Tween.get(this.spin, { override:true })
                        .wait( 1000 )
                        .to( { rotation: 0 }, 0 )
                        .to( { rotation: 360 }, 1000, createjs.Ease.quadInOut )
                        .wait( 2000 )
                        .to( { rotation: 0 }, 0 )
                        .to( { rotation: 360 }, 1000, createjs.Ease.quadInOut )
                        .wait( 2000 )
                        .to( { rotation: 0 }, 0 )
                        .to( { rotation: 360 }, 1000, createjs.Ease.quadInOut );
                }

                intro();

                this.idleTimeoutId = sdk.utils.TickerTimeout.setInterval( () => {
                    intro();
                    // this.lightsAnimator.idle();
                    // this.spokeAnimator.idle();
                    // createjs.Tween.get(this.spin, { override:true })
                    //     .to( { rotation: 0 }, 0 )
                    //     .to( { rotation: 360 }, 1000, createjs.Ease.quadInOut );
                }, 9000 );


                this.addEventListener( "click", () => {
                    this.startWheel();
                } );
            }
        }

        private setStopAngle ( sectionNum:number ) : void {
            // BE CAREFUL:
            // If the random offset is too large AND it flips to negative, the arrow might be able to reach the handle when it stops and it will get caught
            // looking like it's pointing ot the neighboring space. Keep this small OR set a more specific range that leans more to the positive side than the negative side.
            var randomOffset = Math.floor(Math.random()*(this.SECTION_DEGREES/5)) + 1; // this will get a number between 1 and 1/3 the section degrees. NEVER set this to more than 1/2! That would result in cases where the wheel stops on the neighboring section;
            randomOffset *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // 50% of the time, invert the sign. This results in a final number between -1/3 the section degrees and +1/3 the section degrees.

            // Calculate the stop angle. This is the angle the wheel must be at, relative to 0, to position the correct wheel section under the arrow.
            // This equation figures it out based on:
            // - The number of sections (0-11)
            // - The degrees the arrow is offset from 0
            // Since the wheel rotates clockwise, starting from section 0, the second section to pass under the wheel is the last section (11) as opposed to section 2 (which would require counter-clockwise rotation).
            // Because of this, we have to solve for the degrees/degrees-per-section then subtract from the total number of sections.
            // This works for everything except section 0 which solves as 360 degress. To manage this, the result is modded by 360 which converts 360 to 0 while leaving all other rotational numbers as-is.
            // The random offset makes just provides some variance so that the wheel doesnt always stop dead center on the section that wins.
            this.stopAngle = (((360 - (sectionNum * this.SECTION_DEGREES)) % 360) + this.ARROW_ROTATION_OFFSET) - randomOffset;
        }

        private startWheel () : void {
            if (!gPlayResult) {
                deep.Bridge.showError("No playResultRequest set. Player likely not logged in!"); 
                return;
            }

            // Figure out if this is where we need to stop the wheel.
            // Since we're looping over the wheel sections, check if this wheel section's PrizeId matches the winning prize (win cases).
            // If it does, this section is the one to stop on...calculate the angle and mark it.
            // If it's a lose case, then we can stop on any lose spot. This will mark the first lose section it comes to
            // and ignore any others it sets up later.
            for (var i:number=0; i<this.sectionData.length; i++) {
                if (this.stopAngle === undefined) {
                    if (gPlayResult.Result !== sdk.gameplay.PlayResult.LOSE && this.sectionData[i].PrizeId === gPrizeId) {
                        this.setStopAngle(this.sectionData[i].Number);
                        break;
                    } else if (gPlayResult.Result === sdk.gameplay.PlayResult.LOSE && this.sectionData[i].PrizeId === undefined) {
                        this.setStopAngle(this.sectionData[i].Number);
                        break;
                    }
                }
            }

            // Validate Stop Angle
            if (this.stopAngle === undefined) {
                deep.Bridge.showError("No stop angle set. Could not figure out where to stop the wheel.");
            }


            this.removeAllEventListeners("click");
            this.spin.rotation = 0;
            createjs.Tween.get(this.spin, { override:true })
                .to({ alpha:0 },500 );
            sdk.utils.TickerTimeout.clearInterval(this.idleTimeoutId);
            this.lightsAnimator.spin();
            this.spokeAnimator.spin();
            this.wheel.cache(-this.RADIUS,-this.RADIUS,this.RADIUS*2,this.RADIUS*2);

            createjs.Tween.get(this.handles)
                .to({rotation: this.handles.rotation - this.SECTION_DEGREES}, 1000, createjs.Ease.quadInOut)
                .call( () => {
                    createjs.Tween.get(this.handles)
                        .to({rotation: this.handles.rotation + this.SECTION_DEGREES}, 400, createjs.Ease.quintIn)
                        .call(() => {
                            createjs.Tween.get(this.handles)
                                .to({ rotation:(360*this.NUM_SPINS) + this.stopAngle }, 10000, createjs.Ease.quartOut)
                                .call( () => {
                                    // This is a fallback to ensure the arrow does not get "stuck" on a handle pointing at the wrong section.
                                    // Mostly that scenario is handled but I did see a case where I had switched away to a different tab mid-spin and
                                    // when i came back the throttled framerate caused the wheel to "catch-up" very fast resulting in the final frame
                                    // calculating the wheel speed going too fast and forcing the pointer to stay rotated instead of falling back.
                                    // I think it's probably a good idea to keep this in at the end of the tween to make sure it always points
                                    // back to zero at the end.
                                    // The allowArrowUpdating flag is used to prevent extra calls to setArrowAngle. Because of the listener being added
                                    // at the end of the tween chain (which it has to be), it's handler fires one time AFTER this call occurs which
                                    // undoes the setting of the arrow to 0 degrees.
                                    this.allowArrowUpdating = false;
                                    this.arrow.rotation = 0;
                                } )
                                .addEventListener("change", () => {
                                    this.onSectionChange();
                                    this.setAngleOfArrow();
                                });
                        })
                        .addEventListener("change", () => {
                            this.onSectionChange();
                            this.setAngleOfArrow();
                        });
                } )
                .addEventListener("change", () => {
                    this.onSectionChange();
                    this.setAngleOfArrow( true );
                });

            createjs.Tween.get(this.wheel)
                .to({rotation: this.wheel.rotation - this.SECTION_DEGREES}, 1000, createjs.Ease.quadInOut)
                .to({rotation: this.wheel.rotation}, 400, createjs.Ease.quintIn)
                .call(() => {
                    createjs.Tween.get(this.wheel)
                        .to({ rotation:(360*this.NUM_SPINS) + this.stopAngle }, 10000, createjs.Ease.quartOut)
                        .call( () => {
                            this.wheel.uncache();

                            if ( gPlayResult.Result !== sdk.gameplay.PlayResult.LOSE ) {
                                var section:number = this.whatIsUnderTheArrow();
                                this.spokeAnimator.win(section,(section+1)%(this.sectionData.length));
                                deep.Bridge.Sound.play("sound/win");
                            } else {
                                deep.Bridge.Sound.play("sound/lose");
                            }

                            sdk.utils.TickerTimeout.setTimeout( () => {
                                deep.Bridge.exitGame();
                            }, 3000 );
                        } );
                });
        }

        private whatIsUnderTheArrow () : number {
            var numSections:number = this.WHEEL_SECTIONS;

            // This equation figures out which section number (0-11) is currently under the arrow based on:
            // The number of sections
            // The rotation of the wheel, accounting the degrees the arrow is offset from 0 and the half-section offset applied to each section to center it.
            // Since the wheel rotates clockwise, starting from section 0, the second section to pass under the wheel is the last section (11) as opposed to section 2 (which would require counter-clockwise rotation).
            // Because of this, we have to solve for the degrees/degrees-per-section then subtract from the total number of sections.
            // This works for everything except section 0 which solves as section 12. To manage this, the result is modded by the total number of sections which converts 12 to 0 while leaving all other section numbers as-is.
            return (numSections - Math.floor(((this.wheel.rotation%360) - this.ARROW_ROTATION_OFFSET + this.HALF_SECTION_DEGREES) / this.SECTION_DEGREES)) % numSections;
        }

        private drawSection ( wheelSection:WheelSection ) : createjs.Container {
            var container:createjs.Container = new createjs.Container();

            container["data"] = wheelSection;

            // Knowing the length of the line (hub radius), the first point (0,0 center of wheel), and the angle
            // calculate the coordinate of the second point on the line. This is the formula's used for each
            // of the x and y of the second point.
            // x = start_x + len * cos(angle);
            // y = start_y + len * sin(angle);
            // This is used to find the point on the second side of the pie slice on the edge of the hub.
            var point2:createjs.Point = this.pointOnCircumference(this.SECTION_DEGREES,this.RADIUS);


            // Set the text and background colors according to the configuration
            var bgColor:string = wheelSection.BGColor;
            var textColor:string = wheelSection.TextColor;

            // If the colorize setting is enabled, override the text and background colors.
            // This code uses the color from section 1 and creates variants of it for the other sections.
            // Text color and other section colors are ignored.
            // When colorized, the text color is made black or white based on the perceived luminance of the background color variant.
            // Background images are also disabled.
            if (deep.Bridge.GameInfo.GameDescriptor.getProperty("colorize")) {

                bgColor = deep.Bridge.GameInfo.GameDescriptor.getColor("colorize");

                // Find a text color that contrasts well with this background color.
                // Do this BEFORE adjusting the luminance.
                // Otherwise there may be a mix of light and dark text if the one or more of the
                // luminance-adjusted backgrounds end up crossing the boundary and switching the text color.
                textColor = this.contrastColor(bgColor);

                switch (wheelSection.Number) {
                    case 0:
                    case 4:
                    case 8:
                        break;
                    case 2:
                    case 6:
                    case 10:
                        bgColor = sdk.utils.ColorUtils.luminance(bgColor,0.5);
                        break;
                    case 1:
                    case 5:
                    case 9:
                        bgColor = sdk.utils.ColorUtils.luminance(bgColor,-0.5);
                        break;
                    case 3:
                    case 7:
                    case 11:
                        bgColor = sdk.utils.ColorUtils.luminance(bgColor,-0.3);
                        break;
                }
            }

            var shape:createjs.Shape = new createjs.Shape();
            shape.graphics
                .beginFill(bgColor)
                .moveTo(this.HUB_RADIUS,0) // Start at the edge of the hub on the 0y line
                .lineTo(this.RADIUS,0) // Draw to the outer edge of the wheel on 0y line
                .arc(0,0,this.RADIUS,this.degreesToRadians(0),this.degreesToRadians(this.SECTION_DEGREES),false) // Draw an arc using a 30 degrees angle along the outer edge of the wheel
                .lineTo(point2.x,point2.y) // From the previous point on the outer edge of the wheel, draw back towards the center of the wheel to the point where the line will intersect the hub
                .arc(0,0,this.HUB_RADIUS,this.degreesToRadians(this.SECTION_DEGREES),this.degreesToRadians(0),true) // Draw the inner arc, also 30 degrees, back to the original point we started at.
                .endFill();
            shape.regX = 0;
            shape.regY = 0;
            shape.rotation = -this.HALF_SECTION_DEGREES;
            container.addChild(shape);


            if (!deep.Bridge.GameInfo.GameDescriptor.getProperty("colorize") && deep.Bridge.GameAssets.hasAsset(wheelSection.ImageId)) {
                var image:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset(wheelSection.ImageId));
                sdk.utils.CreateJSUtils.centerRegY(image);
                image.mask = shape;
                container.addChild(image);
            }

            var sectionLight:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("sectionlight"));
            sdk.utils.CreateJSUtils.centerRegY(sectionLight);
            sectionLight.mask = shape;
            container.addChild(sectionLight);

            // ChordLength is the distance between the two points of the pie slice at the point they intersect the circumference of the wheel.
            var chordLength:number = 2 * (this.RADIUS * Math.sin(this.degreesToRadians(this.SECTION_DEGREES)/2));

            // Create the text.
            // Center align the text block, center reg in the Y, and then calculate how far to the left of the text move the Reg X so that the text is anchored
            // at the very center of the wheel. Then simply rotate it by 1/2 the number of degrees of the pie slice to align it in the middle vertically.
            if (wheelSection.Label !== undefined && wheelSection.Label.length > 0) {
                let fontSize:number = wheelSection.PrizeId !== undefined ? wheelSection.Label.length <= 10 ? this.largeFontSize : this.medFontSize : this.fontSize; 
                var text:createjs.Text = new createjs.Text(wheelSection.Label, "bold "+fontSize+"px " + this.font, textColor);
                text.lineWidth = this.maxTextWidth;
                text.textAlign = "center";
                sdk.utils.CreateJSUtils.centerRegY(text);
                text.regX = -(this.RADIUS * .61);
                this.autoSizeText(text, fontSize);

                text.mask = shape;

                if (!deep.Bridge.GameInfo.GameDescriptor.getProperty("colorize") && deep.Bridge.GameInfo.GameDescriptor.getProperty("textShadows")) {
                    var textShadow:createjs.Text = text.clone();
                    textShadow.color = "rgba(0,0,0,0.4)";
                    textShadow.x += 3;
                    textShadow.y += 3;
                    textShadow.mask = shape;
                    container.addChild(textShadow);
                }

                container.addChild(text);
            }

            container.rotation = wheelSection.Number * this.SECTION_DEGREES;

            return container;
        }

        private autoSizeText ( text:createjs.Text, fontSize:number ) : void {

            var bounds:createjs.Rectangle = text.getBounds();

            // If the text is too tall...
            if (bounds.height > this.maxTextHeight) {
                // ... shrink it by a couple points if we aren't at the smallest allowed font size.
                // If we ARE at the smallest font size and it's still too tall, we'll have to truncate it.
                if (fontSize - 2 >= this.minFontSize) {
                    text.font = this.fontWeight + " " + (fontSize - 2) + "px " + this.font;
                    this.autoSizeText(text, fontSize - 2);
                } else {
                    var metrics:any = text.getMetrics();

                    // If there are too many lines of text, add the max amount of lines together and add an ellipsis to the end.
                    // Note: If we get here it's because the text is too big. But i suppose it's possible it's too big with fewer than the max lines.
                    // This could be rerun to truncate another line but i'm relying on configuring the limits correctly for the font size so that doesn't happen.
                    // If it did, the text that is still to large would just be added to the wheel.
                    if (metrics.lines.length > this.maxLinesOfText) {
                        var truncatedText:string = "";
                        for (var i:number=0; i<this.maxLinesOfText; i++) {
                            // If this is the last line, shorten it by three letters to make room for the ellipsis.
                            // This isn't always needed but just adding the ellipsis might cause it to break to an extra line again.
                            // If it's not the last line, just add the whole line and a space.
                            if (i === this.maxLinesOfText - 1) {
                                truncatedText += metrics.lines[this.maxLinesOfText - 1].substring(0,metrics.lines[this.maxLinesOfText - 1].length-3);
                            } else {
                                truncatedText += metrics.lines[i] + " ";
                            }
                        }
                        truncatedText += "...";
                        text.text = truncatedText;
                    }
                }
            }

            // Re-center the regX now that the text is resized.
            sdk.utils.CreateJSUtils.centerRegY(text);
        }


        private degreesToRadians ( degrees:number ) : number {
            return degrees * (Math.PI/180);
        }

        private radiansToDegrees ( radians:number ) : number {
            return radians * (180/Math.PI);
        }

        // Knowing the length of the line (hub radius), the first point (0,0 center of wheel), and the angle
        // calculate the coordinate of the second point on the line. This is the formula's used for each
        // of the x and y of the second point.
        // x = start_x + len * cos(angle);
        // y = start_y + len * sin(angle);
        // NOTE: This assumes that the origin is 0,0 therefore start_x and start_y are omitted in the actual math.
        private pointOnCircumference ( degrees:number, radius:number ) : createjs.Point {
            var x:number = radius * Math.cos(this.degreesToRadians(degrees));
            var y:number = radius * Math.sin(this.degreesToRadians(degrees));
            return new createjs.Point(x,y);
        }

        private distanceBetweenPoints ( point1:createjs.Point, point2:createjs.Point ) : number {
            return Math.sqrt(Math.pow(point1.x-point2.x,2) + Math.pow(point1.y-point2.y,2));
        }

        private onSectionChange () : void {
            var section:number = this.whatIsUnderTheArrow();
            if (this.lastSection === undefined) {
                // If the lastSection is undefined, this is the first time this method is being called.
                // It *looks* like a change because undefined !== <current section> but we don't
                // want to actually play a sound here because it isn't changing from one section
                // to the next
                this.lastSection = section;
            } else if (section !== this.lastSection) {
                deep.Bridge.Sound.play("sound/tick");
                this.lastSection = section;
            }
        }

        private setAngleOfArrow ( reverse:boolean=false ) : void {

            if (!this.allowArrowUpdating) return;

            // Figure out the rotational angle of the wheel, factoring in how far from 0 the arrow is offset.
            // If this value comes out negative (which it will on the first part of the first spin)
            // it messes up the calculation of where the last handle is located. To fix this, if the angle is
            // less than 0, convert to the equivalent positive value in a circle (-10 is the same as 350).
            // This makes the calculation work properly.
            var wheelAngle:number = this.wheel.rotation - this.ARROW_ROTATION_OFFSET;
            if (wheelAngle < 0) wheelAngle = 360 + wheelAngle;

            var wheelSpeed:number = 0;
            if (this.lastWheelAngle !== undefined) { // This makes sure that we don't get any weirdly erratic values on the first tick
                wheelSpeed = wheelAngle - this.lastWheelAngle;
            }

            this.lastWheelAngle = wheelAngle;

            // Figure out how many degrees the wheel has rotated past the last handle
            var degreesFromLastHandle:number = Math.abs(((wheelAngle) + this.HALF_SECTION_DEGREES) % this.SECTION_DEGREES);

            // Figure out how many degress to the next handle
            var degreesToNextHandle:number = this.SECTION_DEGREES - degreesFromLastHandle;

            // Find the point of the last handle using its angle and the radius of the wheel
            var lastHandleCoord:createjs.Point = this.pointOnCircumference( (reverse) ? degreesToNextHandle : degreesFromLastHandle,this.RADIUS);

            // Mark the point of the arrow pivot.
            // Use this and the lastHandleCoord to determine the distance from the pivot to the handle
            var arrowPivot:createjs.Point = this.pointOnCircumference(0,this.ARROW_PIVOT_RADIUS);

            // The following figures out the angle the arrow needs to be at to point at the last handle and then figures out,
            // if placed at that angle, will the tip reach the handle.
            // This is done by solving the angle using a side-side-side triangle (google it).
            // With an SSS triangle we can solve for all three interior angles but we only care aobut one.
            // To find it, we need to measure the three sides of the triangle created by
            // 1. The pivot of the arrow
            // 2. The point of the last handle
            // 3. The point on the circumference of the wheel where the arrow points when at 0 degrees (it's "natural" resting position)

            // This is the first side of our triangle.
            // It's the distance between the pivot point of the arrow and edge of the wheel at 0 degrees.
            // The value never changes as both points are always the same.
            var distanceFromPivotToEdge:number = this.distanceBetweenPoints(arrowPivot, this.pointOnCircumference(0,this.RADIUS));

            // Calculate how far it is between the arrow pivot and the handle. Use this to see if the arrow can reach the handle.
            // If it can't, animate it down to resting position
            // If it can, figure out how far to rotate it so it rests on this handle.
            // This is the second side of our triangle used to find the angle of the arrow.
            var distanceFromPivotToHandle:number = this.distanceBetweenPoints(lastHandleCoord,arrowPivot);

            // Calculate the distance between the handle and the point on the wheel's circumference that lines up with the arrow's pivot.
            // This is the third side of our triangle that we'll use to calculate the arrow angle.
            var distanceFromEdgeToHandle:number = this.distanceBetweenPoints(lastHandleCoord,this.pointOnCircumference(0,this.RADIUS));

            // Solve for the angle between two sides of triangle (side 1: pivot to edge, side 2: pivot to handle). This tells us the angle the arrow should be at to point at the handle.
            // This requires all three sides to be known (side 3: edge to handle).
            // The formula is: acos( (side1 squared + side2 squared - side3 squared) / ( 2 * side1 * side2 ) )
            var arrowAngle:number = this.radiansToDegrees(Math.acos((Math.pow(distanceFromPivotToEdge,2) + Math.pow(distanceFromPivotToHandle,2) - Math.pow(distanceFromEdgeToHandle,2)) / (2 * distanceFromPivotToEdge * distanceFromPivotToHandle)));

            // Figure out if the image of the arrow can reach the handle.
            var canArrowReachHandle:boolean = 91 > distanceFromPivotToHandle;


            // Additional Fudge Factor
            // The code above points the tip of the arrow directly at the handle.
            // This works but doesn't account for the distance from the center of the arrow and the edge at the point that it touches the handle.
            // This code works to try and add the extra rotation needed to move the arrow away fro mthe handle a bit.
            // There's probably a way to figure it out with trig but instead i'm just adding a bit of extra rotation based on the angle.
            // The less the angle, the more extra rotation it needs to move from the center to the edge of the arrow.
            if (arrowAngle < 10) {
                arrowAngle += 15;
            } else if (arrowAngle < 20) {
                arrowAngle += 12;
            } else if (arrowAngle < 30) {
                arrowAngle += 8
            } else {
                arrowAngle += 5;
            }

            // If the wheel is going to fast, there may not be a frame where the arrow can reach the handle (it skips from one side to the other)
            // This could checks if it can reach OR if it's going fast enough that we want to force it to point at the handle even if it can't reach
            // (which can't be seen due to how fast it's going).
            // If netiher applies, create a tween to drop the handle back to it's resting postition.
            if (wheelSpeed >= 7 || canArrowReachHandle) {
                createjs.Tween.removeTweens(this.arrow);
                this.arrow.rotation = (reverse) ? arrowAngle : -arrowAngle;
            } else {
                createjs.Tween.get(this.arrow, { override:true })
                    .to({ rotation:0 }, 100, createjs.Ease.backOut);
            }
        }


        public contrastColor (inputColor:string) : string {
            var rgb:number[] = sdk.utils.ColorUtils.hexToRGBComponents( inputColor );

            // Counting the perceptive luminance - human eye favors green color...
            var a:number = 1 - ( 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2])/255;

            return  a < 0.5 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)";
        }

        // This method occasionaly returns a 5-char hex code which blows up. It's not my code and is probably some issue with padding
        //private randomColor () : string {
        //    return '#'+Math.floor(Math.random()*16777215).toString(16);
        //}

    }

}