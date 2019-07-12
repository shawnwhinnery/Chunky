var Chunky = require('./Chunky.js'),
    testData = [],
    arraysMatch = (a, b) => {
        return !a.some((n, i) => { return n !== b[i] })
    }

while (testData.length < 10000) {
    testData.push(Math.round(Math.random() * 1000))
}

async function test() {

    try {

        var filter = (number, i) => {
                return number > 500
            },
            chunk = 500,
            chunkyFilter = await Chunky.filter(testData, filter, chunk),
            nativeFilter = testData.filter(filter),
            filtersMatch = arraysMatch(chunkyFilter, nativeFilter),
            map = (number, i) => {
                return number * -1
            },
            chunkyMap = await Chunky.map(testData, map, chunk),
            nativeMap = testData.map(map),
            mapsMatch = arraysMatch(chunkyMap, nativeMap),
            some = (number, i) => {
                return (
                    i === 420 && number === testData[420]
                )
            },
            chunkySome = await Chunky.some(testData, some, chunk),
            nativeSome = testData.some(some),
            somesMatch = chunkySome === nativeSome

        return (
            filtersMatch && mapsMatch && somesMatch && chunkySome === true
        )

    } catch (error) {

        Promise.reject(error)

    }

}
var start = Date.now()
test().then(success => {
    console.log('pass: ' + success + ' (' + (Date.now() - start) + 'ms)')
}).catch(error => {
    console.log('error: ' + error + ' (' + (Date.now() - start) + 'ms)')
})