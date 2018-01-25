const {merge} = require('lodash');

const defaultContainerPadding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

const defaultGridMargin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

const defaultOptions = {
    containerWidth: 960,
    containerPadding: defaultContainerPadding,

    columnCount: 3,
    columnGap: 10,
    columnStepHeightThreshold: 0,

    gridMargin: defaultGridMargin
};

class Waterfall {
    constructor(items, options = {}) {
        this.items = items.map(function(item) {
            if (typeof item === 'number') {
                return item;
            } else {
                let {width, height} = item;
                return width / height;
            }
        });

        if (this.items.some(item => isNaN(item))) {
            throw new Error('Illegal inputs');
        }

        merge(this, defaultOptions, options);
    }

    getGrids() {
        let paddingGridWidth = this.containerWidth - this.containerPadding.left - this.containerPadding.right;
        let columnWidth = (paddingGridWidth - (this.columnCount - 1) * this.columnGap) / this.columnCount;
        let columnPostions = Array.from(new Array(this.columnCount)).map((item, index) => {
            return {
                top: this.containerPadding.top,
                left: this.containerPadding.left + (this.columnGap + columnWidth) * index
            };
        });

        let itemWidth = columnWidth - this.gridMargin.left - this.gridMargin.right;

        let currentColumnIndex = 0;
        let grids = this.items.map((aspectRatio, index) => {
            let pos = columnPostions[currentColumnIndex];

            if (index > 0) {
                for (let i = 0; i < this.columnCount; i++) {
                    // find next proper column to place the item
                    let nextColumnIndex = (currentColumnIndex + i + 1) % this.columnCount;
                    let nextPos = columnPostions[nextColumnIndex];
                    if (nextPos.top - pos.top < this.columnStepHeightThreshold) {
                        pos = nextPos;
                        currentColumnIndex = nextColumnIndex;
                        break;
                    }
                }
            }

            let top = pos.top + this.gridMargin.top;
            let left = pos.left + this.gridMargin.left;
            let height = itemWidth / aspectRatio;

            pos.top = top + height + this.gridMargin.bottom;

            return {top, left, height, width: itemWidth};
        });

        this.grids = grids;

        return grids;
    }

    getContainerHeight() {
        if (!this.grids) {
            this.getGrids();
        }

        let grids = this.grids;
        let lastItemPerColumn = grids.slice(Math.max(0, grids.length - this.columnCount), grids.length);

        return (
            Math.max.apply(Math, lastItemPerColumn.map(item => item.top + item.height))
                + this.gridMargin.bottom
                + this.containerPadding.bottom
        );
    }
}

module.exports = function(items, options) {
    let wf = new Waterfall(items, options);
    return {
        grids: wf.getGrids(),
        containerHeight: wf.getContainerHeight()
    };
}
