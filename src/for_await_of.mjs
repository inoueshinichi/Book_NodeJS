'use strict'

/* for await ... of */

// asyncIterableからは要素が非同期的に取り出される
// for await (const element of asyncIterable) {
//     // ...
// }

// asyncイテラブル・・・[Symbol.asyncIterator]()メソッドの戻り値としてasyncイテレータを返すオブジェクト

const asyncIterable = {
    [Symbol.asyncIterator]() {
        console.log('asyncIterable')
        let i = 0

        // asyncいてれーた
        return {
            // value, doneプロパティを持つオブジェクトで解決されるPromiseを返す
            next() {
                if (i > 3) {
                    return Promise.resolve({ done: true })
                }
                return new Promise(resolve => setTimeout(
                    () => resolve({ value: i++, done: false }),
                    100
                ))
            }
        }
    }
}

for await (const element of asyncIterable) {
    console.log(element)
}


/* asyncイテラブルはasyncジェネレータ関数によって簡単に作成可能 */
async function* asyncGenerator() {
    console.log('asyncGenerator')
    let i = 0
    while (i <= 3) {
        await new Promise(resolve => setTimeout(resolve, 100))
        yield i++
    }
}

for await (const element of asyncGenerator()) {
    console.log(element)
}

const asyncIterable2 = {
    async *[Symbol.asyncIterator]() {
        console.log('asyncIterable2')
        let i = 0
        while (i <= 3) {
            await new Promise(resolve => setTimeout(resolve, 100))
            yield i++
        }
    }
}

for await (const element of asyncIterable2) {
    console.log(element)
}