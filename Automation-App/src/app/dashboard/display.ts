import { Title } from '@angular/platform-browser'

export class Display {
    title: string;
    range: string;
    current_val: number;
    constructor(title: string, range: string, current_val: number){
        this.title = title;
        this.range = range;
        this.current_val = current_val;
    }
}
