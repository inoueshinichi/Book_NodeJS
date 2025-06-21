'use strict'

const obj1 = { propA: 1, propB: 2 }
console.log("obj1.propA", obj1.propA)
console.log("obj1['propA']", obj1['propA'])

obj1.propC = 3
console.log("obj1.propC = 3")
console.log("obj1", obj1)

delete obj1.propC
console.log("delete obj1.propC")

// コピー
const obj2 = { ...obj1, propC: 3}
console.log("obj2", obj2)
console.log("obj1", obj1)

// レスト構文
const { propA, ...obj3 } = obj2
console.log("obj3", obj3)

/**
 * プロパティの追加、削除をイミュータブルに行うには、スプレッド構文とレスト構文を使う
 * ただし、配列のレスト構文はレスト要素が配列の最後でなければならない制約がある => slice() : (部分配列を返す)を使う
 */
const arr2 = ['foo', 'bar', 'baz']
const arr3 = ['a', ...arr2, 'b', 'c']
console.log("arr2", arr2)
console.log("arr3", arr3)

// 配列のレスト構文
const [head1, head2, ...arr4] = arr2
console.log('---')
console.log("arr2", arr2)
console.log("head1", head1)
console.log("head2", head2)
console.log("arr4", arr4)

// 下記はNG
// const [...arr5, last] = arr2
// 下記はOK
const arr5 = arr2.slice(0, 2)
console.log("arr5", arr5)

// 配列.slice()はコピーを作る
const clone_arr5 = arr5.slice()
console.log("clone_arr5", clone_arr5)
console.log("arr5", arr5)

