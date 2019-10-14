require("colors")

var Chunky = require('./Chunky.js'),
    testData = [],
    arraysMatch = (a, b) => {
        return (
            !a.some((n, i) => { return n !== b[i] })
            && !b.some((n, i) => { return n !== a[i] })
        )
    }

while (testData.length < 500) {
    testData.push(testData.length * testData.length)
}

const SPECS = [
    {
        title: "Chunky.filter",
        assertion: "The output of Chunky.filter is identical to Array.filter",
        test: async () => {
            var iterator = (number, i) => {
                return number > 32
            },
                chunkyFilter = await Chunky.filter(testData, iterator),
                nativeFilter = testData.filter(iterator),
                filtersMatch = arraysMatch(chunkyFilter, nativeFilter)
            return {
                pass: filtersMatch,
                chunkyFilter,
                nativeFilter
            }
        }
    },
    {
        title: "Chunky.map",
        assertion: "The output of Chunky.map is the same length as the test data and is identical to Array.map",
        test: async () => {
            var iterator = (number, i) => {
                return number * -1
            },
                chunkyMap = await Chunky.map(testData, iterator),
                nativeMap = testData.map(iterator),
                mapsMatch = arraysMatch(chunkyMap, nativeMap)

            return {
                pass: (mapsMatch && (chunkyMap.length === testData.length)),
                chunkyMap,
                nativeMap
            }
        }
    },
    {
        title: "Chunky.some",
        assertion: "The output of Chunky.some is identical to Array.some",
        test: async () => {
            var iterator = (number) => {
                return (
                    number > 10
                )
            }
            var chunkySome = true || await Chunky.some(testData, iterator),
                nativeSome = false || testData.some(iterator),
                somesMatch = chunkySome === nativeSome
            return {
                pass: somesMatch,
                chunkySome,
                nativeSome
            }
        }
    },
    {
        title: "Chunky.find",
        assertion: "The output of Chunky.find is identical to Array.find",
        test: async () => {
            var iterator = (number, i) => {
                return number > 4
            },
                chunkyFind = await Chunky.find(testData, iterator),
                nativeFind = testData.find(iterator),
                findsMatch = chunkyFind === nativeFind
            return {
                pass: findsMatch,
                chunkyFind,
                nativeFind
            }
        }
    },
    {
        title: "Chunky.every",
        assertion: "The output of Chunky.every is identical to Array.every",
        test: async () => {
            var iterator = (number) => {
                return number > 4
            },
                chunkyEvery = await Chunky.every(testData, iterator),
                nativeEvery = testData.every(iterator),
                everysMatch = chunkyEvery === nativeEvery
            return {
                pass: everysMatch,
                chunkyEvery,
                nativeEvery
            }
        }
    },
    {
        title: "Chunky.reduce",
        assertion: "The output of Chunky.reduce is identical to Array.reduce",
        test: async () => {
            var iterator = (acumulator, number) => {
                return acumulator += "-"+number.toString()
            },
                chunkyAcumulator = '',
                nativeAcumulator = '',
                chunkyReduce = await Chunky.reduce(testData, iterator, chunkyAcumulator),
                nativeReduce = testData.reduce(iterator, nativeAcumulator),
                reducesMatch = chunkyReduce === nativeReduce
            return {
                pass: reducesMatch,
                chunkyReduce,
                nativeReduce
            }
        }
    },
]


async function executeTest(spec) {
    return spec.test()
}


var start = Date.now()
Promise.all(SPECS.map(executeTest))
    .then(results => {

        var failed = []

        results.forEach((result, i) => {
            var spec = SPECS[i]
            if (!result.pass) failed.push(spec)
            console.log()
            console.log(`${result.pass ? "PASS".green : "FAIL".red}: ${spec.title.yellow}`)
            console.log(spec.assertion.grey)
            if (!result.pass) {
                console.log(result)
            }
        })

        if (failed.length) {
            throw new Error(`FAILED ${failed.length}/${results.length} TESTS`.red)
        }

    }).catch(error => {
        throw new Error(error)
    })