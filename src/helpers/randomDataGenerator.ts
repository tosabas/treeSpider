import { IChartHead } from "../types/MainTypes";
import { allFakers } from '../../deps/faker/index.js';

class RandomDataGenerator {
    private data_length = 50;
    public generated_data: Array<IChartHead> = [];

    private auto_proceed = true;
    private locale: string = "en_GB";

    imgAPIs = [
        'https://picsum.photos/500/500?random=', 
        'https://avatar.iran.liara.run/public/'
    ];

    constructor ({length, auto_proceed, locale}: {length?: number; auto_proceed?: boolean; locale?: string;}) {
        length !== undefined && (this.data_length = length);
        auto_proceed !== undefined && (this.auto_proceed = auto_proceed);
        locale !== undefined && (this.locale = locale.replace('-', '_'));

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

    private get_locale () {
        if (allFakers[this.locale as keyof typeof allFakers] != undefined) {
            return this.locale as keyof typeof allFakers
        }else if (allFakers[this.locale.split('_')[0] as keyof typeof allFakers] != undefined) {
            return this.locale.split('_')[0] as keyof typeof allFakers
        }else{
            return 'en' as keyof typeof allFakers
        }
    }

    private generate_data (id?: string): any {
        const should_add_image = Math.floor(Math.random() * 2);
        const img_endpoints = this.imgAPIs[Math.floor(Math.random() * this.imgAPIs.length)] + id
        return {
            id,
            name: allFakers[this.get_locale()].person.fullName(),
            role: allFakers[this.get_locale()].person.jobTitle(),
            location: allFakers[this.get_locale()].location.city() + ", " + allFakers[this.get_locale()].location.country(),
            image: should_add_image ? img_endpoints : ''
        }
    }

}

export default RandomDataGenerator;