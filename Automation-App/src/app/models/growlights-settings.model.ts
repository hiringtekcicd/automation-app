import { Deserializable } from "./deserializable";

export class GrowlightsSettings implements Deserializable {

    

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
