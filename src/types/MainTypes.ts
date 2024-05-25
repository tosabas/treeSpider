export interface ISpiderTreeMain {
    /**
     * The target container in which SpiderTree will be spawned in
     */
    targetContainer: string;
    /**
     * How SpiderTree container should be placed in the target root container,
     * provide a CSS selector to beforeEl if SpiderTree container should be placed
     * before a container in the provided target container
     */
    placeEl?: 'override' | 'start' | 'end' | {beforeEl: string};

    /**
     * An array of data containing employee details and relationship
     */
    tree_data: Array<IChartHead>;
}

export interface IChartHead {
    /**
     * required: id of the head
     */
    id: string;
    name: string;
    role: string;
    location: string;
    parentId?: undefined;
    stat?: number;
    image?: string;
}

export interface ID3DataFormat extends IChartHead {
    children: IChartHead[];
}