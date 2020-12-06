import React, { useState, useCallback, useEffect } from 'react';
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'
import { FormDialog } from "./components/Forms/index";
import { db } from './firebase/index'

const App = (props) => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);
  // 問い合わせフォーム用モーダルを開く関数
  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen]);

  // 問い合わせフォーム用モーダルを閉じるCallback関数
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen]);


  // 新しいチャットを追加するCallback関数
  const addChats = useCallback((chat) => {
    setChats(prevChats => {
      return [...prevChats, chat]
    })
  }, [setChats]);

  const displayNextQuestion = (nextQuestionId, nextDataset) => {

    addChats({
      text: nextDataset.question,
      type: 'question'
    });
    setAnswers(nextDataset.answers);
    setCurrentId(nextQuestionId)
  }



  const selectAnswer = useCallback((selectedAnswer, nextQuestionId) => {

    switch (true) {

      // お問い合わせが選択された場合
      case (nextQuestionId === 'contact'):
        handleOpen();
        break;

      // リンクが選択された時
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
        break;

      // 選択された回答をchatsに追加
      default:
        addChats({
          text: selectedAnswer,
          type: 'answer'
        });

        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 750)
        break;
    }

  }, [answers]);

  // 最初の質問をチャットエリアに表示する
  useEffect(() => {
    (async () => {
      const initDataset = {};

      // Fetch questions dataset from Firestore
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          initDataset[doc.id] = doc.data()
        })
      });

      // Firestoreから取得したデータセットを反映
      setDataset(initDataset);

      // 最初の質問を表示
      displayNextQuestion(currentId, initDataset[currentId])
    })();
  }, []);
  // 最新のチャットが見えるように、スクロール位置の頂点をスクロール領域の最下部に設定する
  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });


  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList select={selectAnswer} answers={answers} />
        <FormDialog open={open} handleOpen={handleOpen} handleClose={handleClose} />
      </div>
    </section>
  );

}

export default App;
