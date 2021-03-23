module deep.games.prizewheel {

    export class LightAnimator {

        private light:Light[] = [];

        constructor () {}

        public addLight ( index:number, light:Light ) : void {
            this.light[index] = light;
        }

        public intro () : void {
            for (var i:number=0; i<this.light.length; i++) {
                this.light[i].intro( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")), i, this.light.length - (i) );
            }

        }

        public idle () : void {
            for (var i:number=0; i<this.light.length; i++) {
                this.light[i].idle( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")), i, this.light.length - (i) );
            }
        }

        public spin () : void {
            for (var i:number=0; i<this.light.length; i++) {
                this.light[i].spin( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

        public solid () : void {
            for (var i:number=0; i<this.light.length; i++) {
                this.light[i].solid( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

    }

}