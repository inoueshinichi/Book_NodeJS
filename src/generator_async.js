'use strict'

/* ジェネレータを利用した非同期プログラミング */

// 非同期的にJSONをパースする関数
function parseJSONAsync(json) {
    return new Promise((resolve, reject) => 
        setTimeout(() => {
            try {
                resolve(JSON.parse(json))
            } catch (err) {
                reject(err)
            }
        }, 1000)
    )
}

// yieldの仕組みを利用して非同期処理を実行する関数
function* asyncWithGeneratorFunc(json) {
    try {
        // 非同期処理の実行
        const result = yield parseJSONAsync(json) // resultに代入されるのはPromiseインスタンスを解決したものになる
        console.log("パース結果", result)
    } catch (err) {
        console.log("エラーをキャッチ", err)
    }
}

// 正常系
const asyncWithGenerator1 = asyncWithGeneratorFunc('{ "foo": 1 }')
const promise1 = asyncWithGenerator1.next().value // yield parseJSONAsync(json)で生成されるPromiseインスタンスを取得
promise1.then(result => asyncWithGenerator1.next(result)) // Promiseインスタンスが解決された値をnext()メソッドに渡す

// 異常系
const asyncWithGenerator2 = asyncWithGeneratorFunc('不正なJSON')
const promise2 = asyncWithGenerator2.next().value
promise2.catch(err => asyncWithGenerator2.throw(err))


/* Promise と Generator による非同期処理を同期処理の文脈で記述する汎用化ボイラーテンプレート */

function handleAsyncWithGenerator(generator, resolved) {
    // 前回yieldされたPromiseインスタンスの値を引数にnext()を実行
    // 初回はresolvedには値が入っていない(undefined)
    const { done, value } = generator.next(resolved)
    if (done) {
        // ジェネレータが完了した場合はvalueで解決されるPromiseインスタンスを返す
        return Promise.resolve(value)
    }
    return value.then(
        // 正常系では再帰呼び出し
        resolved => handleAsyncWithGenerator(generator, resolved),
        // 異常系ではthrow()メソッドを実行
        err => generator.throw(err)
    )
}

// 実行
handleAsyncWithGenerator(asyncWithGeneratorFunc('{ "bar": 2 }'))
handleAsyncWithGenerator(asyncWithGeneratorFunc("不正なJSON2"))


/* 非同期プログラミング以外のジェネレータの利用 */
// 目的: 値の生成を実際に必要になるまで遅延できること

// Arrayを生成する段階で、要素として含まれるすべての値(メモリ確保)が必要
const arr = [0,1,2,3]

