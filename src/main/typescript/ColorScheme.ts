module deep.games.prizewheel {

    export class ColorScheme {

        private scheme:Color[];
        private pointer:number;

        constructor ( private schemeSetting:string ) {
            switch ( this.schemeSetting ) {
                case "Rainbow":
                    this.scheme = [Color.Red,Color.Orange,Color.Yellow,Color.Green,Color.Blue,Color.Magenta];
                    break;
                default:
                    this.scheme = [];
                    var colors:string[] = this.schemeSetting.split("_");
                    for (var a of colors) {
                        this.scheme.push( Color[a] );
                    }
                    break;
            }
        }

        public get SchemeSetting () : string {
            return this.schemeSetting;
        }

        public current () : Color {
            return this.scheme[this.pointer];
        }

        public first () : Color {
            return this.scheme[0];
        }

        public next () : Color {
            if (this.pointer === undefined) {
                this.pointer = 0;
            } else {
                this.pointer = this.pointer === this.scheme.length - 1 ? 0 : this.pointer + 1;
            }
            return this.scheme[this.pointer];
        }

        public previous () : Color {
            if (this.pointer === undefined) {
                this.pointer = 0;
            } else {
                this.pointer = this.pointer === 0 ? this.scheme.length - 1 : this.pointer - 1;
            }
            return this.scheme[this.pointer];
        }

        public reset () : void {
            this.pointer = undefined;
        }

        public get SchemeColors () : number {
            return this.scheme.length;
        }

    }

}