import React, { useState, useCallback, useEffect } from 'react';
import './assets/styles/style.css'
import { AnswersList, Chats } from './components/index'
import { FormDialog } from "./components/Forms/index";
import { db } from './firebase/index'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      answers: [],          // 回答コンポーネントに表示するデータ
      chats: [],            // チャットコンポーネントに表示するデータ
      currentId: "init",    // 現在の質問ID
      dataset: {},          // 質問と回答のデータセット
      open: false           // 問い合わせフォーム用モーダルの開閉を管理
    }
  }
  displayNextQuestion = (nextQuestionId) => {

    const chat = {
      text: this.state.dataset[nextQuestionId].question,
      type: 'question'
    }

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: [...this.state.chats, chat],
      currentId: nextQuestionId
    });
  }
  // 問い合わせフォーム用モーダルを開く関数
  handleOpen = () => {
    this.setState({ open: true })
  };
  // 問い合わせフォーム用モーダルを閉じる関数
  handleClose = () => {
    this.setState({ open: false })
  };
  initDataset = (dataset) => {
    this.setState({dataset: dataset});
}
  selectAnswer = (selectedAnswer, nextQuestionId) => {
    console.log(selectedAnswer)
    console.log(nextQuestionId)
    switch (true) {
      // コンポーネントの初期化時
      case (nextQuestionId === 'init'):
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500);
        break;

        handleOpen = () => {

        }
      // お問い合わせが選択された場合
      case (nextQuestionId === 'contact'):
        this.handleOpen();
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
        console.log(selectedAnswer)
        const chat = {
          text: selectedAnswer,
          type: 'answer'
        }
        this.setState({
          chats: [...this.state.chats, chat]
        });

        setTimeout(() => this.displayNextQuestion(nextQuestionId), 750)
        break;
    }

  }

  // 最初の質問をチャットエリアに表示する
  componentDidMount() {
    (async () => {
      const dataset = this.state.dataset;

      // Fetch questions dataset from Firestore
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          dataset[doc.id] = doc.data()
        })
      });

      this.initDataset(dataset)
      const initAnswer = "";
      this.selectAnswer(initAnswer, this.state.currentId)
    })();
  }
  render() {
    // console.log(this.state.chats);
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList select={this.selectAnswer} answers={this.state.answers} />
          <FormDialog open={this.state.open} handleOpen={this.handleOpen} handleClose={this.handleClose} />
        </div>
      </section>
    );
  }
}


