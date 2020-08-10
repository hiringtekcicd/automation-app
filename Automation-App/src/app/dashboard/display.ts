export class Display {

    current_val: string = "0";

    constructor(public title: string, public range: string, public monitoring_only: boolean, public target_val: number, public day_and_night: boolean, public day_target_value: number, public night_target_value: number){}
}
