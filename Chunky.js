// chunky async iterators
var _chunk = 500,
    _wait = 0
function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}
async function walk({ array, chunk = _chunk, wait = _wait, onStep }) {

    var index = 0,
        step = async () => {
            var start = index,
                end = Math.min(array.length, start + chunk),
                stop = false,
                _continue = () => {
                    console.log('CONTINUE')
                    stop = true
                }

            for (let i = start; (i < end && !stop); i++) {
                await onStep(i, _continue)
            }

            index = end

            if (end < array.length && !stop) {

                if (wait) await sleep(wait)

                await step()
            }

            return true
        }

    await step()

    return
}

const Chunky = {
    map: async (array, fn, chunk = _chunk, wait = _wait) => {
        var newArray = []
        await walk({
            array,
            chunk,
            wait,
            onStep: async (i) => {
                var output = await fn(array[i], i)
                newArray.push(output)
            }
        })
        return newArray
    },
    forEach: async (array, fn, chunk = _chunk, wait = _wait) => {
        return await walk({
            array,
            chunk,
            wait,
            onStep: async i => await fn(array[i], i)
        })
    },
    some: async (array, fn, chunk = _chunk, wait = _wait) => {
        var one = false
        await walk({
            array,
            chunk,
            wait,
            onStep: async (i, _continue) => {
                var isMatch = await fn(array[i], i)
                if (isMatch) {
                    one = true
                    _continue()
                }
            }
        })
        return one
    },
    every: async (array, fn, chunk = _chunk, wait = _wait) => {
        var every = true
        await walk({
            array,
            chunk,
            wait,
            onStep: async (i, _continue) => {
                var passes = await fn(array[i], i)
                if (!passes) {
                    every = false
                    _continue()
                }
            }
        })
        return every
    },
    filter: async (array, fn, chunk = _chunk, wait = _wait) => {
        var newArray = []
        await walk({
            array,
            chunk,
            wait,
            onStep: async (i) => {
                if (await fn(array[i], i)) newArray.push(array[i])
            }
        })
        return newArray
    },
    find: async (array, fn, chunk = _chunk, wait = _wait) => {
        var obj
        await walk({
            array,
            chunk,
            wait,
            onStep: async (i, _continue) => {
                if (await fn(array[i], i)) {
                    obj = array[i]
                    _continue()
                }
            }
        })
        return obj
    },
    reduce: async (array, fn, accumulator, chunk = _chunk, wait = _wait) => {

        await walk({
            array,
            chunk,
            wait,
            onStep: async (i, _continue) => {
                accumulator = await fn(accumulator, array[i])
            }
        })

        return accumulator

    },
}


module.exports = Chunky