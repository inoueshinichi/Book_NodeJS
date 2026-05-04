// import { useState, useEffect } from 'react'
const { useState, useEffect } = require('react')
// import Link from 'next/link'
const Link = require('next/link')
// import Head from 'next/head'
const Head = require('next/head')
// import 'isomorphic-fetch'
const io = require('socket.io-client')


// 各ページに関する情報の定義
const pages = {
    index: {title: 'すべてのToDo'},
    active: {title: '未完了のToDo', completed: false },
    completed: {title: '完了したToDo', completed: true },
}

// CSRでページを切り替えるためのリンク
const pageLinks = Object.keys(pages).map((page, index) => 
    (
        <Link style={{ marginRight: 10 }} href={`/${page === 'index' ? '' : page}`} key={index}>
            {pages[page].title}
        </Link>
    )
)

// Reactコンポーネントを実装し、外部のモジュールで利用可能なようexport文で公開
function Todos(props) {
    const { title, completed } = pages[props.page]

    // コンポーネントの状態の初期化とpropsの値に応じた更新
    const [todos, setTodos] = useState([])
    // useEffect(() => {

    //     /*SSE送信以前のREST API実装*/
    //     // fetch(`/api/todos${fetchQuery}`)
    //     //     .then(async res => res.ok
    //     //         ? setTodos(await res.json())
    //     //         : alert(await res.text())
    //     //     )

    //     const NativeEventSource = window.EventSource || window.EventSourcePolyfill;
    //     if (!NativeEventSource) {
    //         console.error("EventSourceがサポートされていないブラウザです");
    //         return;
    //     } else {
    //         console.log("EventSourceがサポートされています");
    //     }
    //     const eventSource = new NativeEventSource('/api/todos/events');

    //     /* EventSourceを使ったSSE送信実装に置き換え */
    //     // const eventSource = new EventSource('/api/todos/events')
    //     // SSE受信時の処理
    //     eventSource.addEventListener('message', e => {
    //         const todos = JSON.parse(e.data)
    //         if (typeof completed === 'undefined') {
    //             console.log(todos)
    //         } else {
    //             console.log(todos.filter(todo => todo.completed === completed))
    //         }
    //         setTodos(
    //             typeof completed === 'undefined'
    //                 ? todos
    //                 : todos.filter(todo => todo.completed === completed)
    //         )
    //     })
    //     // エラーハンドリング
    //     eventSource.addEventListener('error', e => console.log('SSEエラー', e))
    //     // EventSourceのクリーンアップ
    //     return () => eventSource.close()

    // }, [props.page])

    // socketをstateとして保持
    const [socket, setSocket] = useState()

    useEffect(() => {
        // socketの生成
        const socket = io('/todos')
        socket.on('todos', todos => {
            setTodos(
                typeof completed === 'undefined'
                    ? todos
                    : todos.filter(todo => todo.completed === completed)
            )
        })
        setSocket(socket)

        // コンポーネントのクリーンアップ
        return () => socket.close()
    }, [props.page])

    // このコンポーネントが描画するUIをJSX構文で記述して返す
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            {/* 新しいTodoを入力 */}
            <input onKeyPress={e => {
                // Enterキーが押されたらToDoを登録する
                const title = e.target.value
                if (e.key !== 'Enter' || !title) {
                    return
                }
                e.target.value = ''
                socket.emit('createTodo', title)
            }}/>

            {/* ToDo一覧の表示 */}
            <ul>
                {todos.map(({id, title, completed}) => 
                    <li key={id}>
                        <label style={completed ? { textDecoration: 'line-through' } : {}}>
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={e => {
                                    socket.emit('updateCompleted', id, e.target.checked)
                                }}
                            />
                            {title}
                        </label>
                        <button onClick={() => socket.emit('deleteTodo', id)}>削除</button>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}

module.exports = Todos