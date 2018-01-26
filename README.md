# Waterfall Layout

Calculate width &amp; position for items of waterfall

```js
import layout from 'waterfall-layout'

layout(items, options = {}) // => { grids, containerHeight }
```

`items` is an array of ratio value of width and height or object which contains width and height value.

```js
[
    16 / 9,
    {width: 960, height: 540}
]
```

Options for layouting are listed in [example](example/index.js#L5-L22). 

![Diagram-of-options](assets/Diagram-of-options.jpg)
