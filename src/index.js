import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// fetch('https://pomb.us/build-your-own-react/',{
//     mode:'cors',
//     header:{
//       'Access-Control-Allow-Origin':'*'
//     }})
// .then((res)=>console.log(res.text()))
// .then((res)=>{
//     let el = document.createElement('html')
//     el.innerHTML = res
//     console.log(el.title)
// })

import './index.css'

function StudyQueue() {
    const articleQueue = getArticleQueue();
    //const stackQueue = getStackQueue();
    const [articleList,setArticleList] = useState(articleQueue)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        let form = document.querySelector('form');
        let newUrl = form.elements['url-input'].value;
        let newTitle = form.elements['title-input'].value;
        let newType = form.elements['type-input'].value;
        
        pushArticle(newUrl,newTitle,newType);

        for (let i = 0; i < form.elements.length; i++) {
            const element = form.elements[i];
            element.value = ''
        }

    }

    
    function getArticleQueue() {
        const articleQueue = JSON.parse(localStorage.getItem('articleQueue'))||[];
        return articleQueue;
    }

    function pushArticle(url,title,type) {
        let oldQueue = JSON.parse(localStorage.getItem('articleQueue'))||[];
        let newArticle = {
            url,
            title,
            type};
        oldQueue.push(newArticle)
        let newQueue = oldQueue;
        localStorage['articleQueue'] = JSON.stringify(newQueue);
        setArticleList(newQueue)
    }


    function popArticle() {
        let oldQueue = JSON.parse(localStorage.getItem('articleQueue'))||[];
        oldQueue.shift();
        let newQueue = oldQueue;
        localStorage['articleQueue'] = JSON.stringify(newQueue);
        setArticleList(newQueue)
    }
    return (
        <div>
            <ol className='article-list'>
                {articleList?articleList.map((article) => (
                    <li>
                        <a href={article.url}>{article.title}</a>
                        <span className='type'>Type:{article.type}</span>  
                    </li>
                    )
                ):''}
            </ol>
            <form onSubmit={handleSubmit}>

                <label htmlFor='url-input'>Enter URL</label>
                <input id='url-input' type='text'/> 
           
                <label htmlFor='title-input'>Enter Title</label>
                <input id='title-input' type='text'/>

                <label htmlFor='type-input'>Enter Type</label>
                <input id='type-input' type='text'/>

                <button type='submit'>PUSH</button>
                <button type='button' onClick={popArticle}>POP</button>
            </form>

        </div>
    )
}

let el = document.createElement('div');
el.id = 'root';
document.body.appendChild(el)

ReactDOM.render(<StudyQueue/>,document.getElementById('root'))