import React, { useState, useCallback, useEffect } from 'react';
import { Answer } from './index'

const AnswersList = (props) => {
    const answersList = props.answers.map((e, i) => {
        return <Answer key={i.toString()} select={props.select} content={e.content} nextId={e.nextId} />
    });
    return (
        <div className="c-grid__answer">
            {answersList}
        </div>
    );
}
export default AnswersList;