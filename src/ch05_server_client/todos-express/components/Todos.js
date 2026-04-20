// import { useState, useEffect } from 'react'
const { useState, useEffect } = require('react')
// import Link from 'next/link'
const Link = require('next/link')
// import Head from 'next/head'
const Head = require('next/head')
// import 'isomorphic-fetch'


// 各ページに関する情報の定義
const pages = {
    index: {title: 'すべてのToDo', fetchQuery: ''},
    active: {title: '未完了のToDo', fetchQuery: '?completed=false'},
    completed: {title: '完了したToDo', fetchQuery: '?completed=true'},
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
    const { title, fetchQuery } = pages[props.page]

    // コンポーネントの状態の初期化とpropsの値に応じた更新
    const [todos, setTodos] = useState([])
    useEffect(() => {
        fetch(`/api/todos${fetchQuery}`)
            .then(async res => res.ok
                ? setTodos(await res.json())
                : alert(await res.text())
            )
    }, [props.page])

    // このコンポーネントが描画するUIをJSX構文で記述して返す
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            {/* ToDo一覧の表示 */}
            <ul>
                {todos.map(({id, title, completed}) => 
                    <li key={id}>
                        <span style={completed ? { textDecoration: 'line-through' } : {}}>
                            {title}
                        </span>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}

module.exports = Todos