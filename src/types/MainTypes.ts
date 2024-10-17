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
    /**
     * An array of colors which will be used as color range, set more than 
     * one color for better output
     */
    color_range?: string[];
    /**
     * The type of chart, it is set to 'default' by default
     */
    tree_type?: 'default' | 'cellar' | 'goldenRod' | 'hSpider' | 'hSpiderWalk' | 'radialSpiderLeg' | 'vSpiderWalk';
    /**
     * The type of chart head
     */
    chart_head_type?: TChartHeadType;
    /**
     * Set this to `false` to not display the tool UI
     */
    show_tools?: boolean;
    /**
     * Set this parameter to `false` to not show border around the chart head, 
     * note setting this to `false` will also remove the charthead background for the radialSpiderLeg tree type
     */
    show_chart_head_border?: boolean;
    /**
     * Use this to set the animation rotation speed
     */
    animation_rotation_speed?: number;
    /**
     * The degree increment of the rotation, default is 1
     */
    animation_rotation_interval?: number;
    /**
     * The background pattern of your choice
     */
    backgroundPattern?: 'none' | 'default' | 'flux' | 'quad' | 'blurry' | 'chaos' | 
        'flurry' | 'spiral' | 'circling' | 'replicate' | 'scribble' | 'squiggly' | 
        'gyrrate' | 'leaves' | 'spot';
    /**
     * The size of the background svg pattern
     */
    backgroundSize?: string
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

export type TTreeType = 'default' | 'cellar' | 'goldenRod' | 'hSpider' | 'hSpiderWalk' | 'radialSpiderLeg' | 'spiderlingsPack' | 'vSpiderWalk';

export type TChartHeadType = 'default' | 'landscape' | 'rounded';