# Chunky
Chunky is an asynchronous iteration tool kit. It creates a simple syntax for chunking, throttling, and sequencing iterations.


## Basic Usage
Async array iterators. Handy for throtling long or cpu intensive iteations.
```javascript
import Chunky from 'Chunky'

// Say you need to encrypt a large dataset with 100000 objects in it
const veryLongArray = [/*...*/]

// and your encryption step takes ~3ms per operation
function verySlowEncryption (object) { /* synchronous encryption operation */ }

// This .map will lock up the runtime for a couple of seconds (definitively whack)
const encryptedObjects = veryLongArray.map(verySlowEncryption)

// Chunky can help by breaking this long running loop into several smaller loops.
// In this example Chunky will encrypt 10 objects, take a 100ms break, repeat.
Chunky.map(
    veryLongAray,           // iterable
    verySlowEncryption,     // iterator
    ).then(encryptedObjects => {  })

```


## Async Iterators

Async iterator functions work exactly like synchronous iterators. 
> NOTE: Chunky awaits async iterators on every iteration.
```javascript
const veryLongArray = [/*...*/]

function verySlowEncryption (object) { /* synchronous encryption operation */ }

async function postToAPI (object) { /* asynchronous AJAX operation */ }

(async function () {
    // encrypt them all 
    const encryptedObjects = await Chunky.map(veryLongAray, verySlowEncryption)
    
    // send them all
    const apiResponses = await Chunky.map(encryptedObjects, postToAPI)

    // return the api responses
    return apiResponses
})()
```

## Methods
* Chunky.map
* Chunky.filter
* Chunky.some
* Chunky.every
* Chunky.reduce
* Chunky.forEach