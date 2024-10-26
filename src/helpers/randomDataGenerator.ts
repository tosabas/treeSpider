import { IChartHead } from "../types/MainTypes";
import { faker } from '@faker-js/faker';

class RandomDataGenerator {
    private data_length = 50;
    public generated_data: Array<IChartHead> = [];

    private auto_proceed = true;
    private locale: string = "en_GB"; // locale implementation suspended

    imgAPIs = [
        'https://picsum.photos/500/500?random=', 
        'https://avatar.iran.liara.run/public/'
    ];

    constructor ({length, auto_proceed, locale}: {length?: number; auto_proceed?: boolean; locale?: string;}) {
        length !== undefined && (this.data_length = length);
        auto_proceed !== undefined && (this.auto_proceed = auto_proceed);
        locale !== undefined && (this.locale = locale.replace('-', '_'));

        if (this.auto_proceed) {
            this.generate()
        }
    }

    public generate () {
        return this.make_data() as unknown as Array<IChartHead>;
    }

    private make_data () {
        for (let i = 0; i < this.data_length; i++) {
            const _data = this.generate_data((i + 1).toString())
            if (i > 0) {
                _data.parentId = this.get_parent_id(i);
            }
            this.generated_data.push(_data);
        }
        return this.generated_data;
    }

    private get_parent_id(index: number) {
        let parentId = Math.floor(Math.random() * this.generated_data.length).toString();
        parentId = parseInt(parentId) == 0 ? "1" : parentId;
        if (parentId == (index + 1).toString()) {
            parentId = this.get_parent_id(index);
        }
        return parentId
    }

    private generate_data (id?: string): any {
        const should_add_image = Math.floor(Math.random() * 2);
        const img_endpoints = this.imgAPIs[Math.floor(Math.random() * this.imgAPIs.length)] + id

        return {
            id,
            name: faker.person.fullName(),
            role: faker.person.jobTitle(),
            location: faker.location.city() + ", " + faker.location.country(),
            image: should_add_image ? img_endpoints : ''
        }
    }

}

export default RandomDataGenerator;