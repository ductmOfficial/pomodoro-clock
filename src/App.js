import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [alarmStyle, setAlarmStyle] = useState({ color: "white" });
  const audioRef = useRef(null);

  const warning = useCallback(() => {
    if (secondsLeft < 61) {
      setAlarmStyle({ color: "#a50d0d" });
    } else {
      setAlarmStyle({ color: "white" });
    }
  }, [secondsLeft]);

  const buzzer = useCallback(() => {
    if (secondsLeft === 0) {
      audioRef.current.play();
    }
  }, [secondsLeft, audioRef]);

  const setBrkLength = (e) => {
    lengthControl(
      setBreakLength,
      e.currentTarget.value,
      breakLength,
      "Session"
    );
  };

  const setSeshLength = (e) => {
    lengthControl(
      setSessionLength,
      e.currentTarget.value,
      sessionLength,
      "Break"
    );
  };

  const lengthControl = (stateToChange, sign, currentLength, tType) => {
    if (timerRunning) return;

    if (timerLabel === tType) {
      if (sign === "-" && currentLength !== 1) {
        stateToChange(currentLength - 1);
      } else if (sign === "+" && currentLength !== 60) {
        stateToChange(currentLength + 1);
      }
    } else if (sign === "-" && currentLength !== 1) {
      stateToChange(currentLength - 1);
      setSecondsLeft(currentLength * 60 - 60);
    } else if (sign === "+" && currentLength !== 60) {
      stateToChange(currentLength + 1);
      setSecondsLeft(currentLength * 60 + 60);
    }
  };

  const handleStart = () => {
    setTimerRunning(true);
  };

  const handleStop = () => {
    setTimerRunning(false);
  };

  const handleReset = () => {
    setSessionLength(25);
    setBreakLength(5);
    setSecondsLeft(25 * 60);
    setTimerLabel("Session");
    setTimerRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  let minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;

  useEffect(() => {
    const handleSwitch = () => {
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setSecondsLeft(breakLength * 60);
      } else if (timerLabel === "Break") {
        setTimerLabel("Session");
        setSecondsLeft(sessionLength * 60);
      }
    };

    let countdown = null;
    if (timerRunning && secondsLeft > 0) {
      countdown = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (timerRunning && secondsLeft === 0) {
      countdown = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      warning();
      buzzer();
      handleSwitch();
    } else {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [
    timerRunning,
    secondsLeft,
    timerLabel,
    breakLength,
    sessionLength,
    audioRef,
    warning,
    buzzer,
  ]);

  return (
    <div className="App">
      <div className="clock">
        <h1 className="clock-title">25 + 5 Clock</h1>
        <div className="clock-row">
          <div>
            <h3 id="break-label">Break Length</h3>
            <p className="break-length-control d-flex-row">
              <button id="break-decrement" value="-" onClick={setBrkLength}>
                Down
              </button>
              <span id="break-length">{breakLength}</span>
              <button id="break-increment" value="+" onClick={setBrkLength}>
                Up
              </button>
            </p>
          </div>
          <div>
            <h3 id="session-label">Session Length</h3>
            <p className="session-length-control d-flex-row">
              <button id="session-decrement" value="-" onClick={setSeshLength}>
                Down
              </button>
              <span id="session-length">{sessionLength}</span>
              <button id="session-increment" value="+" onClick={setSeshLength}>
                Up
              </button>
            </p>
          </div>
        </div>

        <div className="clock-display">
          <div className="clock-display-container" style={alarmStyle}>
            <h3 id="timer-label">{timerLabel}</h3>
            <p id="time-left" className="clock-timer">
              {minutes < 10 ? ("0" + minutes).slice(-2) : minutes}:
              {seconds < 10 ? ("0" + seconds).slice(-2) : seconds}
            </p>
          </div>
          <div className="d-flex-row">
            <button
              id="start_stop"
              onClick={timerRunning ? handleStop : handleStart}
            >
              Play/Pause
            </button>
            <button id="reset" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <audio
          id="beep"
          preload="auto"
          ref={audioRef}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
};

export default App;
