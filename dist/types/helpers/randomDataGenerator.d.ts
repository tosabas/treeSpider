import { IChartHead } from "../types/MainTypes";
declare class RandomDataGenerator {
    private data_length;
    generated_data: Array<IChartHead>;
    private auto_proceed;
    private locale;
    imgAPIs: string[];
    constructor({ length, auto_proceed, locale }: {
        length?: number;
        auto_proceed?: boolean;
        locale?: string;
    });
    generate(): Array<IChartHead>;
    private make_data;
    private get_parent_id;
    private generate_data;
}
export default RandomDataGenerator;
