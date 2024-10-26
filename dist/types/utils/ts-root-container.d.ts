import * as d3 from 'd3';
declare class TSRootContainer extends HTMLDivElement {
    main_svg: any;
    tree_data: any;
    static observeAttributes: string[];
    private backgroundPattern;
    private backgroundSize;
    private customBackground;
    private backgroundPosition;
    constructor();
    connectedCallback(): void;
    setCanvasBg(): void;
    defaultDotsPatternBg(): d3.Selection<SVGSVGElement, undefined, null, undefined>;
    fluxPatternBg(): string;
    quadPatternBg(): string;
    blurryBg(): string;
    chaosPatternBg(): string;
    spiralPatternBg(): string;
    flurryPatternBg(): string;
    whirlingPatternBg(): string;
    replicatePatternBg(): string;
    scribblePatternBg(): string;
    squigglyPatternBg(): string;
    gyrratePatternBg(): string;
    leavesPatternBg(): string;
    reflectionPatternBg(): string;
    spotPatternBg(): string;
}
export default TSRootContainer;
