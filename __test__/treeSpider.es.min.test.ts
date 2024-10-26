"use strict";
/**
 * @jest-environment jsdom
 */ 

import {describe, expect, test} from '@jest/globals';
import TreeSpider from '../dist/es/treeSpider.bundle.min';

document.body.innerHTML = `
    <div id="bundle-min-init-1"></div>
    <div id="bundle-min-init-2"></div>
    <div id="bundle-min-init-3"></div>
    <div id="bundle-min-init-4"></div>
    <div id="bundle-min-init-5"></div>
`;

describe('Bundle minified Version: Initialization', () => {
    const init1 = new TreeSpider({
        targetContainer: '#bundle-min-init-1',
    })
    test('Bundle minified Version: Library got initialized', () => {
        expect(init1).toBeInstanceOf(TreeSpider)
    })
    test('Bundle minified Version: Multiple instances on the same page', () => {
        const init2 = new TreeSpider({
            targetContainer: '#bundle-min-init-2',
        })
        const init3 = new TreeSpider({
            targetContainer: '#bundle-min-init-3',
        })
        const init4 = new TreeSpider({
            targetContainer: '#bundle-min-init-4',
        })
        expect(init2).toBeInstanceOf(TreeSpider)
        expect(init3).toBeInstanceOf(TreeSpider)
        expect(init4).toBeInstanceOf(TreeSpider)
    })
})

describe('Options', () => {
    const init1 = new TreeSpider({
        targetContainer: '#bundle-min-init-5',
        tree_type: 'cellar',
        font_link: "https://fonts.googleapis.com/css2?family=Updock&display=swap",
        font_name: "Updock"
    });
    init1.setOptions({
        width: '1200px',
        height: '900px',
    });
    test('Bundle minified Version: Option set on intialization got set', () => {
        expect(init1.options.tree_type).toBe('cellar');
    });
    test('Bundle minified Version: Custom fonts provided were set', () => {
        expect(init1.options.font_link).toBe('https://fonts.googleapis.com/css2?family=Updock&display=swap');
        expect(init1.options.font_name).toBe('Updock');
        expect(document.querySelector('[href="https://fonts.googleapis.com/css2?family=Updock&display=swap"]')).not.toBe(null);
    }, 1500);
    test('Bundle minified Version: Options set with setOptions got set', () => {
        expect(init1.options.width).toBe('1200px');
        expect(init1.options.height).toBe('900px');
    });
})