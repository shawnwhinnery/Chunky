// chunky async iterators
var _chunk = 500
var _wait = 0
const Chunky = {
    map: async (array, fn, chunk = _chunk, wait = _wait) => {
        var index = 0,
            newArray = [],
            step = () => {
                var start = index,
                    end = Math.min(array.length, start + chunk)

                for (let i = start; i < end; i++) {
                    newArray.push(fn(array[i], i))
                }

                index = end

                if (end < array.length) {
                    setTimeout(step, wait)
                } else {
                    Promise.resolve(newArray)
                }
            }

        step()
    },
    forEach: async (array, fn, chunk = _chunk, wait = _wait) => {
        var index = 0,
            step = () => {
                var start = index,
                    end = Math.min(array.length, start + chunk)

                for (let i = start; i < end; i++) {
                    fn(array[i], i)
                }

                index = end

                if (end < array.length) {
                    setTimeout(step, wait)
                } else {
                    Promise.resolve()
                }
            }

        step()
    }
}