'use strict'

/**
 * クラスに定義したメソッド、コンストラクタ、セッター、ゲッターはクラスのprototypeに追加される.
 * クラスからインスタンスを生成する時、prototypeは__proto__に格納される
 */
class Foo {
    #private_field
    static #static_private_field

    #privateMethod() { 
        console.log('This is #privateMethod()')
    }

    static #staticPrivateMethod() {
        console.log('This is #staticPrivateMethod()')
    }

    publicMethod() {
        console.log("This is method()")
    }
}
console.log("Foo.prototype", Foo.prototype)
console.log("Object.getOwnPropertyNames(Foo.prototype)", Object.getOwnPropertyNames(Foo.prototype))

const fooInstance = new Foo()
console.log("fooInstance.__proto__ === Foo.prototype", fooInstance.__proto__ === Foo.prototype)

console.log("fooInstance instanceof Foo", fooInstance instanceof Foo)
const plainObject = {}
console.log("plainObject instanceof Foo", plainObject instanceof Foo)

// __proto__にFoo.prototypeをセットするとinstanceofがtrue判定する
plainObject.__proto__ = Foo.prototype
console.log("plainObject.__proto__ === Foo.prototype", plainObject.__proto__ === Foo.prototype)
console.log("plainObject instanceof Foo", plainObject instanceof Foo)

class Bar extends Foo {

}
const barInstance = new Bar()
console.log("Ojbect.getOwnPropertyNames(Bar.prototype)", Object.getOwnPropertyNames(Bar.prototype))
console.log("Ojbect.getOwnPropertyNames(Foo.prototype)", Object.getOwnPropertyNames(Foo.prototype))
console.log("barInstance.__proto__ === Bar.prototype", barInstance.__proto__ === Bar.prototype)
console.log("barInstance.__proto__ === Foo.prototype", barInstance.__proto__ === Foo.prototype)
console.log("barInstance instanceof Foo", barInstance instanceof Foo)
console.log("barInstance.__proto__.__proto__", barInstance.__proto__.__proto__)
console.log("barInstance.__proto__.__proto__ === Foo.prototype", barInstance.__proto__.__proto__ === Foo.prototype)
console.log("fooInstance.__proto__.__proto__ === Object.prototype", fooInstance.__proto__.__proto__ === Object.prototype)
console.log("barInstance.__proto__.__proto__.__proto__ === Object.prototype", barInstance.__proto__.__proto__.__proto__ === Object.prototype)
console.log("fooInstance.__proto__", fooInstance.__proto__)
console.log("barInstance instanceof Object", barInstance instanceof Object)