'use strict'

/***
 * 引数を渡したnext()の実行およびthrow()
 * 標準的なイテレータプロトコルに定義されていない、ジェネレータ特有の機能
 * 1. next()に引数を渡せる. 引数は, ジェネレータ関数内で直前に実行されたyieldの戻り値として取得できる
 * 2. throw()メソッドを実行すると, ジェネレータ関数内で直前に実行されたyieldの部分でエラーが発生する.
 */

// リセット可能なカウンタを実装するジェネレータ関数
function* resetableGeneratorFunc() {
    let count = 0
    while (true) {
        console.log('count', count)
        // next()を真に評価される引数(trueなど)で実行すると、
        // ここでカウンタがリセットされる。
        if (yield count++) {
            count = 0
        }
    }
}

const resetableGenerator = resetableGeneratorFunc()
resetableGenerator.next()
resetableGenerator.next()
resetableGenerator.next()
resetableGenerator.next()
resetableGenerator.next(true)
resetableGenerator.next()
resetableGenerator.next()
resetableGenerator.next()


function* tryCatchGeneratorFunc() {
    try {
        yield 1
    } catch (err) {
        console.log('エラーをキャッチ', err)
        yield 2
    }
}

const tryCatchGenerator = tryCatchGeneratorFunc()
console.log(tryCatchGenerator.next())
tryCatchGenerator.throw(new Error("ジェネレータ関数内でエラーを発生させた"))
tryCatchGenerator.next() // undefined


// エラーがジェネレータ関数内部でキャッチされなかった場合、ジェネレータ自体を終了する
try {
    // try...catch文のないresetableGeneratorに対してthrow()を実行
    resetableGenerator.throw(new Error('resetableGenerator Error'))
} catch (err) {
    console.log('ジェネレータ外部でエラーをキャッチ', err)
}

