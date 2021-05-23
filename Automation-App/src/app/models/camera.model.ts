import { Deserializable } from './deserializable';
export class Camera implements Deserializable {

    name: string;
    url: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
