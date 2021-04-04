import { Deserializable } from "./deserializable";

export class GrowlightsSettings implements Deserializable {

    lights_on: string;
    lights_off: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    getDisplayName(): string {
        return 'Grow Lights'
    }
}
