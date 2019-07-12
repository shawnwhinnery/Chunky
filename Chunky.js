// chunky async iterators
var _chunk = 500,
    _wait = 0

function walk({ array, chunk = _chunk, wait = _wait, onStep }) {
    return new Promise((resolve, reject) => {
        var index = 0,
            step = () => {
                var start = index,
                    end = Math.min(array.length, start + chunk),
                    complete = () => { end = array.length }

                for (let i = start; i < end; i++) {
                    onStep(i, complete)
                }

                index = end

                if (end < array.length) {
                    return setTimeout(step, wait)
                }

                resolve()

            }
        step()
    })
}

const Chunky = {
    map: async (array, fn, chunk = _chunk, wait = _wait) => {
        var newArray = []
        await walk({
            array,
            chunk,
            wait,
            onStep: (i) => {
                newArray.push(fn(array[i], i))
            }
        })
        return newArray
    },
    forEach: async (array, fn, chunk = _chunk, wait = _wait) => {
        return await walk({
            array,
            chunk,
            wait,
            onStep: i => fn(array[i], i)
        })
    },
    some: async (array, fn, chunk = _chunk, wait = _wait) => {
        var one = false
        await walk({
            array,
            chunk,
            wait,
            onStep: (i, end) => {
                if (fn(array[i], i)) {
                    one = true
                    end()
                }

            }
        })
        return one
    },
    filter: async (array, fn, chunk = _chunk, wait = _wait) => {
        var newArray = []
        await walk({
            array,
            chunk,
            wait,
            onStep: (i) => {
                if (fn(array[i], i)) newArray.push(array[i])
            }
        })
        return newArray
    }
}


module.exports = Chunky