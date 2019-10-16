// chunky async iterators
const defaults = { chunk: 10, wait: 0 }

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}

async function walk(array, iterator, options = {}) {

    const {
        chunk,
        wait,
    } = { ...defaults, ...options }

    var index = 0,
        step = async () => {

            var start = index,
                end = Math.min(array.length, start + chunk),
                continued = false,
                _continue = () => {
                    continued = true
                }

            for (let i = start; i < end; i++) {
                iterator(i, _continue)
                if (continued) continue
            }

            index = end

            if (wait) await sleep(wait)

            if (end < array.length && !continued) {
                await step()
            }

            return true
        }

    await step()

    return

}

const Chunky = {
    map: async (array, fn, options) => {
        var newArray = []
        await walk(
            array,
            (i) => {
                var output = fn(array[i], i)
                newArray.push(output)
            },
            options)
        return newArray
    },
    forEach: async (array, fn, options) => {
        return await walk(array, i => fn(array[i], i), options)
    },
    some: async (array, fn, options) => {
        var one = false
        await walk(
            array,
            (i, _continue) => {
                var isMatch = fn(array[i], i)
                if (isMatch) {
                    one = true
                    _continue()
                }
            }, options)
        return one
    },
    every: async (array, fn, options) => {
        var every = true
        await walk(
            array,
            (i, _continue) => {
                var passes = fn(array[i], i)
                if (!passes) {
                    every = false
                    _continue()
                }
            }, options)
        return every
    },
    filter: async (array, fn, options) => {
        var newArray = []
        await walk(
            array,
            (i) => {
                if (fn(array[i], i)) newArray.push(array[i])
            },
            options)
        return newArray
    },
    find: async (array, fn, options) => {
        var obj
        await walk(
            array,
            (i, _continue) => {
                if (fn(array[i], i) && !obj) {
                    obj = array[i]
                    _continue()
                }
            },
            options)
        return obj
    },
    reduce: async (array, fn, accumulator, options) => {

        await walk(
            array,
            (i, _continue) => {
                accumulator = fn(accumulator, array[i])
            })

        return accumulator

    },
    quest: async (array = [], fn, options) => {
        var i = 0,
            step = async () => {
                await fn(array[i], i)
                i++
                if (i < array.length) {
                    if(options.wait) await sleep(options.wait)
                    await step()
                } else {
                    Promise.resolve()
                }
            }
        step()
    },
}


module.exports = Chunky