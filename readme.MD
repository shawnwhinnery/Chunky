# Chunky
Async counterparts to your favorite array methods as well as a couple helper utils.
```javascript
const Chunky = require('chunky')
var veryLongArray = [0,0,0,0,0,...]
var verySlowIterator = (number, i) => { 
    while(number < 1000){
        number = Math.ceil(Math.random() * 1000)
    }
    return number
}

// Chunky.map chunky-async / chunky-blocking
Chunky.map(
    veryLongAray,       // iterable
    verySlowIterator    // ietrator
)
.then(newArray => {

})
```

## Options.chunk = 500
Chunk size.  fe

## Options.wait = 0
Pause for a fixed duration between chunks.

* Chunky.map
* Chunky.filter
* Chunky.some
* Chunky.every
* Chunky.reduce
* Chunky.forEach

