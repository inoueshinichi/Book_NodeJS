'use strict';

const events = require('events');
const process = require('process');


function createFizzBuzzEventEmitter(until) {
    const eventEmitter = new events.EventEmitter();

    // _emitFizzBuzz(eventEmitter, until);

    // イベントの発行を常に非同期にするために、process.nextTick()を利用
    process.nextTick(() => _emitFizzBuzz(eventEmitter, until));
    
    return eventEmitter;
}

// async/await構文が使えるように、イベントを発行する部分を別関数に切り離す
async function _emitFizzBuzz(eventEmitter, until) {
    eventEmitter.emit('start');
    let count = 1;
    while (count <= until) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (count % 15 === 0) {
            eventEmitter.emit('FizzBuzz', count);
        } else if (count % 3 === 0) {
            eventEmitter.emit('Fizz', count);
        } else if (count % 5 ===0) {
            eventEmitter.emit('Buzz', count);
        }
        count += 1;
    }
    eventEmitter.emit('end');
}

function startListener() {
    console.log("start");
}

function fizzListener(count) {
    console.log("Fizz", count);
}

function buzzListener(count) {
    console.log("Buzz", count);
}

function fizzBuzzListener(count) {
    console.log("FizzBuzz", count);
}

function endListener() {
    console.log("end");
    this // thisはEventEmitterインスタンス
        // 全てのイベントからリスナを削除する
        .off('start', startListener)
        .off('Fizz', fizzListener)
        .off('Buzz', buzzListener)
        .off('FizzBuzz', fizzBuzzListener)
        .off('end', endListener);
}

createFizzBuzzEventEmitter(40)
    .on('start', startListener)
    .on('Fizz', fizzListener)
    .once('Buzz', buzzListener)
    .on('FizzBuzz', fizzBuzzListener)
    .on('end', endListener);

