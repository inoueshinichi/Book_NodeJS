'use strict'

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

/* async/await構文
   handleAsyncWithGenerator()ヘルパー関数 + function* + yield + Promiseインスタンスを返す関数

   function* asyncFunc(input) {
     try {
       const result1 = yield asyncFunc1(input)
       const result2 = yield asyncFunc2(result1)
       const result3 = yield asyncFunc3(result2)
       ....
     } catch (err) {
       // エラーハンドリング
     }
   }
   
   async/await : function* -> async function, yield -> await
   ※ 動作は function*とyieldを使ったパターンと同じ

   async function asyncFunc(input) {
     try {
       const result1 = await asyncFunc1(input)
       const result2 = await asyncFunc2(result1)
       const result3 = await asyncFunc3(result2)
       ....
     } catch (err) {
       // エラーハンドリング
     }
   }
 */

// async/await構文を利用した非同期処理
async function asyncFunc(json) {
    try {
        console.log('asyncFunc')
        const result = await parseJSONAsync(json)
        console.log("async/awaitパース結果", result)
    } catch (err) {
        console.log("async/awaitエラーをキャッチ", err)
    }
}

// 正常系
asyncFunc('{ "tiny": 3 }')
// 異常系
asyncFunc('不正なJSON3')


// 必ずPromiseを返す
async function asyncReturnTank() { return 'tank' }
asyncReturnTank()

async function asyncThrowError() { throw new Error('非同期エラー') }
// asyncThrowError()


async function pauseAndResume(pausePeriod) {
    console.log('pauseAndResume開始')
    await new Promise(resolve => setTimeout(resolve, pausePeriod))
    console.log('pauseAndResume再開')
}
pauseAndResume(1000)
console.log("async関数外の処理はawaitの影響を受けない")


/* async/await構文のメリット */
// 1) then()やcatch()に渡すコールバック関数によるスコープの発生とそれに伴うPromiseインスタンスのネストを防げる
// 2) 

/*
function doSomethingAsync() {
  // NG
  asyncFunc1(input)
    .then(result1 => asyncFunc2(result1))
    // チェーンする書き方ではここでresult1を参照できない
    .then(result2 => asyncFunc3(result1, result2))

  // OK
  asyncFunc1(input)
    .then(result1 => asyncFunc2(result1)
        // result1を参照するためにPromiseインスタンスをネストする必要がある
        .then(result2 => asyncFunc3(result1, result2))
    )
}


async/awaitなら参照スコープを広げる&CB関数のネストを防げる

async function doSomethingAsync(input) {
  const result1 = await asyncFunc1(input)
  const result2 = await asyncFunc2(result1)
  const result3 = await asyncFunc3(result1, result2)
}

*/


/* async/await構文と非同期処理の並行実行 */
// awaitでは同時に複数のPromiseインスタンスの解決を待機できないので、
// Promise.all()などPromise静的メソッドと併用する.

// async function doSomethingAsyncConcurrently() {
//     // 複数の非同期処理の並行実行
//     const result = await Promise.all([
//         asyncFunc1(),
//         asyncFunc2(),
//         asyncFunc3(),
//     ])
// }


