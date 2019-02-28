import React, { useState, useEffect } from "react";
import { processResponse } from './utils';
import styles from "./App.module.scss";

const getDataUrl = (page = 1) => `http://localhost:8080/api.json?page=${page}`;
const ADD_URL = 'http://localhost:8080/add';
const initialForm = {
  jp: '',
  en: '',
};

const App = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [vocab, setVocab] = useState([]);
  const [form, setFormValues] = useState(initialForm);
  const [mousePosition, setMousePosition] = useState({
    x: '',
    y: '',
  })

  useEffect(() => {
    fetch(getDataUrl())
      .then(res => res.json())
      .then((res) => processResponse(res, setCount, setVocab))
      .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [])

  const onChange = (e) => {
    setFormValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const onNextPage = () => {
    fetch(getDataUrl(page + 1))
      .then(res => res.json())
      .then(res => setVocab(res))
      .catch(err => console.log(err));
    setPage(page + 1);
  }

  const onPrevPage = () => {
    fetch(getDataUrl(page - 1))
      .then(res => res.json())
      .then(res => setVocab(res))
      .catch(err => console.log(err));
    setPage(page - 1);
  }

  const onMouseMove = (e) => {
    setMousePosition({
      x: e.pageX,
      y: e.pageY,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    fetch(ADD_URL, {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        page,
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(res => {
      processResponse(res, setCount, setVocab);
      setFormValues(initialForm);
    })
    .catch(err => console.log(err));
  }
  let nextClassName; 
  let prevButtion;
  let nextButtion;

  if (page === 1) {
    nextClassName = styles.Next;
  } else {
    prevButtion = (<span><button onClick={onPrevPage}>{`${(page - 1) * 5 - 4} - ${page * 5 - 5}`}</button></span>);
  }

  if (page < Math.ceil(count / 5)) {
    nextButtion = (<span className={nextClassName}><button onClick={onNextPage}>{`${page * 5 + 1} - ${Math.min((page + 1) * 5, count)}`}</button></span>);
  }

  return (
    <div className={styles.Main}>
      <h1>和英語彙</h1>
      <div className={styles.Container}>
      <div className={styles.Mouse}>Mouse Position: ({mousePosition.x}, {mousePosition.y})</div>
      <form onSubmit={onSubmit} className={styles.Form}>
        <span>JP: <input name="jp" onChange={onChange} value={form.jp} required /><br /></span>
        <span>EN: <input name="en" onChange={onChange} value={form.en} required /><br /></span>
        <button type="submit">追加</button>
      </form>
      </div>
      <div className={styles.Container}>
        { vocab.map((item, i) => (
          <div key={i} className={styles.Data}>
            <ul>
              <li>{item.jp_word}</li>
              <li>{item.en_word}</li>
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.Nav}>
        { prevButtion }
        { nextButtion }
      </div>
    </div>
  );
}

export default App;
