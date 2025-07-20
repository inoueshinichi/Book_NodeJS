'use strict'

console.log("child-a 1")
await new Promise(resolve => setTimeout(resolve, 1000))
console.log("child-a 2")
