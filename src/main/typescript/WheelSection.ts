module deep.games.prizewheel {

    export class WheelSection {

        constructor (
            private num:number,
            private prizeId:string,
            private label:string,
            private bgColor:string,
            private textColor:string,
            private imageId:string )
        {}

        public get ImageId () : string { return this.imageId }
        public get PrizeId () : string { return this.prizeId }
        public get Label () : string { return this.label }
        public get BGColor () : string { return this.bgColor }
        public get TextColor () : string { return this.textColor }
        public set Number ( num:number ) { this.num = num; }
        public get Number () : number { return this.num }


    }

}