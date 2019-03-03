import React from 'react';
import styles from "./App.module.scss";

const WordList = ({ vocab }) => (
    vocab.map((item, i) => (
        <div key={i} className={styles.Data}>
            <ul>
                <li>{item.jp_word}</li>
                <li>{item.en_word}</li>
            </ul>
        </div>
    ))
)

export default WordList;