module deep.games.prizewheel {

    export class SpokeAnimator {

        private spokes:Spoke[] = [];

        constructor () {}

        public addSpoke ( index:number, spoke:Spoke ) : void {
            this.spokes[index] = spoke;
        }

        public intro () : void {
            for (var i:number=0; i<this.spokes.length; i++) {
                this.spokes[i].intro( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

        public idle () : void {
            for (var i:number=0; i<this.spokes.length; i++) {
                this.spokes[i].idle( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

        public spin () : void {
            for (var i:number=0; i<this.spokes.length; i++) {
                this.spokes[i].spin( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

        public win ( spoke1:number, spoke2:number ) : void {
            this.spokes[spoke1].win( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            this.spokes[spoke2].win( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
        }

        public solid () : void {
            for (var i:number=0; i<this.spokes.length; i++) {
                this.spokes[i].solid( new ColorScheme(deep.Bridge.GameInfo.GameDescriptor.getProperty("lightEffects")) );
            }
        }

    }

}