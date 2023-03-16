
import React, {useEffect, useState, useRef} from "react";
import randomWords from 'random-words';
import "./App.css";

const maxWords= 200;
const second =60;

function App() {

  const [words, setWords]= useState([]);
  const [countDown, setCountDown]=useState(60);
  const [currInput, setCurrInput]= useState("");
  const [currWordIndex, setCurrWordIndex]= useState(0);
  const [correct, setCorrect]= useState(0);
  const [wrong, setWrong]= useState(0);
  const [status, setStatus]=useState("waiting");
  const [currCharIndex, setCurrCharIndex]= useState(-1);
  const [currChar, setCurrChar]=useState("");
 

  const textInput= useRef(null);

  useEffect(()=>{
    setWords(generateWords())
  },[]);

  useEffect(()=>{
    if(status==="started"){
      textInput.current.focus();
    }
  },[status])

  const generateWords =()=>{
    return new Array(maxWords).fill(null).map(()=>randomWords())
  }

  const startCountDown=()=>{
    if(status==="finished"){
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setWrong(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if(status!=="started"){
      setStatus("started");
      let interval = setInterval(()=>{
        setCountDown((prevCountDown)=>{
          if(prevCountDown===0){
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return second;
          }
          else{
            return prevCountDown-1;
          }
        });
      }, 1000)
    }
  }


  const handleKeyDown=({keyCode, key})=>{
    //hitting spcae bar
    if(keyCode===32 || keyCode===13){
      checkMatch();
      //update index everytime spacebar is hitted
      setCurrInput("");
      setCurrWordIndex(currWordIndex+1);
      setCurrCharIndex(-1);
    }
    else if(keyCode===8){
      setCurrCharIndex(currCharIndex-1);
      setCurrChar("");
    }
    else{
      setCurrCharIndex(currCharIndex+1);
      setCurrChar(key)
    }
  }

  const checkMatch=()=>{
    const wordToCompare = words[currWordIndex];
    const doesItMatch= wordToCompare ===currInput.trim()
    // console.log({doesItMatch});
    if(doesItMatch){
      setCorrect(correct+1);
    }
    else{
      setWrong(wrong+1);
    }
  }

  const getCharClass=(wordIndex, charIndex, char)=>{
    if(wordIndex===currWordIndex && charIndex === currCharIndex && currChar && status!=="finished"){
      if(char===currChar){
        return "has-green-bg";
      }
      else if(wordIndex===currWordIndex && currCharIndex>=words[currWordIndex].length){
        return "has-red-bg";
      }
      else{
        return "has-red-bg";
      }
    }
    return "";
  }



  return (
    <div className="App">

      <div className="counter">
        <label>Timer : </label>
        <h2>{countDown}</h2>
      </div>

      <div className="control">
        <input disabled={status!=="started"} ref={textInput} type="text" className="input" value={currInput} onKeyDown={handleKeyDown} placeholder="Start typine here..." onChange={(e)=>setCurrInput(e.target.value)}/>
      </div>

      <div className="section">
        <button className="btn" onClick={startCountDown}>
          start
        </button>
      </div>

      { 
        (status==="started" || status==="finished")&& (
          <div className="section">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    {words.map((word,index)=>(
                      <span key={index}>
                        <span >
                          {word.split("").map((char, indx)=>(
                            <span className={getCharClass(index, indx, char)} key={indx}>{char}</span>
                          ))}
                        </span>
                        <span> </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        )
      }

      {
        status==="finished" && (
          <div className="res-section">
            <div className="columns">
              <div className="column">
                <p>Words typed: </p>
                <p className="result">{correct+wrong}</p>
              </div>
              <div className="column">
                <p>Correct Words: </p>
                <p className="result">{correct}</p>
              </div>

              <div className="column">
                <p>Accuracy: </p>
                  {
                      Math.floor((correct/ (correct+wrong))*100) ? (
                        <p className="result"> {Math.floor((correct/ (correct+wrong))*100)} %</p>
                      ) :(
                        <p className="result">0 %</p>
                      )
                  } 
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
