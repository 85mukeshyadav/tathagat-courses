import React, { useState, useEffect, useRef } from "react";

const QuestionInput = (props) => {

    
    const emailInputRef = useRef(null);
    const [getInAns, setInAns] = useState()
    

     

      useEffect(()=>{
        emailInputRef.current.focus();
      }, [props.getAns]);

    const isNumberKey = (e) =>
        {
            e.preventDefault();
            const re =  /^[\./\-0-9\b]+$/;

            console.log(e.target.value, re.test(e.target.value));
            if (e.target.value === '' || re.test(e.target.value)) {
                    props.setAns(e.target.value)
            }
        }

    const actionOn = (n)=> {
        if(props.getMode == 'review'){
            return;
        }
        let d = props.getAns;
        if(!d) d = '';
        d = d+n;
        props.setAns(d)
    }

    const otherAction = (n)=> {
        if(props.getMode == 'review'){
            return;
        }
        if(n == 'clearAll') {
            props.setAns('');
            // emailInputRef.current.focus();
        }
        if(n == 'leftMove') {
            let start = emailInputRef.current.selectionStart;
            let end = emailInputRef.current.selectionEnd;
            if(start != 0){
                emailInputRef.current.selectionStart = emailInputRef.current.selectionEnd = start - 1;
                
            }
            emailInputRef.current.focus();
            
        }

        if(n == 'rightMove') {
            let start = emailInputRef.current.selectionStart;
            let end = emailInputRef.current.selectionEnd;
            if(start < props.getAns.length){
                emailInputRef.current.selectionStart = emailInputRef.current.selectionEnd = start + 1;
                
            }
            emailInputRef.current.focus();
            
        }

        if( n == 'back') {
            let start = emailInputRef.current.selectionStart;
            let d = props.getAns;
            console.log(start)
            if(start != 0 && start != null){
                d = d.slice(0, start - 1) + d.slice(start, d.length)
                
            }
            props.setAns(d);
            // for(let i = props.getAns.length-1; i < start; i--) {
            //     emailInputRef.current.selectionStart = emailInputRef.current.selectionEnd = i - 1;
            // }
            // console.log(start)
            // emailInputRef.current.focus();
        }
    }

    return (
        <div style={{paddingLeft: '4%'}} id="numericKeyBoardDiv">
            <input type="text" id="answer" value={props.getAns} disabled={props.getMode == 'review'? true : ''} autoComplete="off" onChange={(e) => isNumberKey(e)} ref={emailInputRef} style={{border: '1px solid black', paddingLeft: '2px'}} className="keyboardInput answer" />
            <div id="vKeyboard" className="vKeyboard" style={{width: "145px"}}>
                <span className="vKeyboardSplKeys" onClick={()=>{otherAction('back')}} style={{borderRadius: "6px"}}>Backspace</span><br />
                <span className="vKeyboardKeys" onClick={()=>{actionOn('7')}} style={{borderRadius: "6px"}}>7</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('8')}} style={{borderRadius: "6px"}}>8</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('9')}} style={{borderRadius: "6px"}}>9</span><br />
                <span className="vKeyboardKeys" onClick={()=>{actionOn('4')}} style={{borderRadius: "6px"}}>4</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('5')}} style={{borderRadius: "6px"}}>5</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('6')}} style={{borderRadius: "6px"}}>6</span><br />
                <span className="vKeyboardKeys" onClick={()=>{actionOn('1')}} style={{borderRadius: "6px"}}>1</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('2')}} style={{borderRadius: "6px"}}>2</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('3')}} style={{borderRadius: "6px"}}>3</span><br />
                <span className="vKeyboardKeys" onClick={()=>{actionOn('0')}} style={{borderRadius: "6px"}}>0</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('.')}} style={{borderRadius: "6px"}}>.</span>
                <span className="vKeyboardKeys" onClick={()=>{actionOn('-')}} style={{borderRadius: "6px"}}>-</span><br />
                <span className="vKeyboardSplKeys" onClick={()=>{otherAction('leftMove')}} data="left" style={{fontWeight: 'normal', borderRadius: "6px"}}>←</span>
                <span className="vKeyboardSplKeys" onClick={()=>{otherAction('rightMove')}} data="right" style={{fontWeight: 'normal', borderRadius: "6px"}}>→</span><br />
                <span className="vKeyboardSplKeys" onClick={()=>{otherAction('clearAll')}} style={{borderRadius: "6px"}}>Clear All</span><br />
            </div>
        </div>

    )
};

export default QuestionInput;