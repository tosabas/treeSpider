import { IChartHead } from "src/types/MainTypes";
import { faker, allFakers } from '../../deps/faker/index.mjs';

class RandomDataGenerator {
    private data_length = 50;
    public generated_data: Array<IChartHead> = [];

    private auto_proceed = true;
    private locale: string = "en_GB";

    constructor ({length, auto_proceed, locale}: {length?: number; auto_proceed?: boolean; locale?: string;}) {
        length !== undefined && (this.data_length = length);
        auto_proceed !== undefined && (this.auto_proceed = auto_proceed);
        locale !== undefined && (this.locale = locale);

        if (this.auto_proceed) {
            this.generate();
        }
    }

    public generate () {
        return this.make_data() as unknown as Array<IChartHead>;
    }

    private make_data () {
        for (let i = 0; i < this.data_length; i++) {
            const _data = this.generate_data((i + 1).toString())
            if (i > 0) {
                const parentId = Math.floor(Math.random() * this.generated_data.length);
                _data.parentId = parentId == 0 ? "1" : parentId.toString();
            }
            this.generated_data.push(_data);
        }
        return this.generated_data;
    }

    private generate_data (id?: string): any {
        return {
            id,
            name: allFakers[this.locale].person.fullName(),
            role: allFakers[this.locale].person.jobTitle(),
            location: allFakers[this.locale].location.city() + ", " + allFakers[this.locale].location.country()
        }
    }

}

export default RandomDataGenerator;