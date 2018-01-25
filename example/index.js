const items = require('./items.json');
const layout = require('../lib');

let result = layout(items, {
    containerWidth: 960,
    containerPadding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    columnCount: 3,
    columnGap: 10,
    columnStepHeightThreshold: 0,

    gridMargin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

console.log('Height of container: %d', Math.ceil(result.containerHeight));
console.log('%s \t %s \t %s', 'No.', 'Coord', 'Size');
result.grids.forEach(function ({top, left, width, height}, i) {
    console.log('%d \t %s \t %s', i,
        `(${Math.floor(left)}, ${Math.floor(top)})`,
        `${Math.floor(width)}x${Math.floor(height)}`);
});
