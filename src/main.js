'use strict'

const math = require("./cjs-math")
console.log("math.add(2,3)", math.add(2,3))

/**
 * require()が一度ロードしたモジュールはキャッシュされる
 * require.cacheで取得できる
 */
console.log("require.cache[require.resolve('./cjs-math')]", require.cache[require.resolve('./cjs-math')])

// delete演算子を使って, requre.cacheオブジェクトのキャッシュをクリア
delete require.cache[require.resolve('./cjs-math')]
console.log("After deleting cache")
console.log("require.cache[require.resolve('./cjs-math')]", require.cache[require.resolve('./cjs-math')])


/**
 * require()はディレクトリに対しても適用できる。
 * その際, ディレクトリのindex.jsが自動的に読み込まれる.
 * ライブラリを作る際は, index.jsをエントリーポイントにする
 */
const math2 = require("./cjs-math2")
console.log("require('./cjs-math2')", require('./cjs-math2'))
const x = 4
const square_x = math2.square(x)
const sqrt_x = math2.sqrt(x)
console.log("x", x)
console.log("square_x", square_x)
console.log("sqrt_x", sqrt_x)