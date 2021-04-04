import { Deserializable } from "./deserializable";

export class PowerOutlet implements Deserializable {

    id: string;
    name: string;
    logo: string;
    currentValue: Boolean = false;

    constructor() {}

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
