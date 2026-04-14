import React, { useEffect, useState, useMemo, useRef } from "react";
import "../styles/loveInvite.css";

const LoveInvite = () => {
  const dateLink = "https://meet.google.com/yrc-jqsk-fka";

  // 💡 Stable countdown target
  const targetDate = useMemo(() => {
    return new Date("2026-04-14T23:14:00").getTime();
  }, []);

  const [timeLeft, setTimeLeft] = useState({});
  const [phase, setPhase] = useState("countdown");
  const [text, setText] = useState("");

  // 🎵 AUDIO FIX
  const audioRef = useRef(null);

  const message =
    "I planned something special for us... I can't wait to spend this moment with you ❤️";

  const surpriseMessage =
  "6 months with you, and my heart is still choosing you every day ❤️ Thank you for being my happiness. I love you endlessly 💕";

  // ⏳ Countdown + Suspense Flow
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);

        setPhase("wait");

        setTimeout(() => setPhase("tease"), 2500);
        setTimeout(() => setPhase("reveal"), 5000);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // ✍️ Typing Effect
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(message.slice(0, i));
      i++;
      if (i > message.length) clearInterval(typing);
    }, 40);

    return () => clearInterval(typing);
  }, []);

  return (
    <div
      className={`invite-container ${
        phase !== "countdown" ? "suspense-mode" : ""
      }`}
    >
      {/* 💖 Floating Hearts */}
      <div className="hearts">
        {[...Array(20)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="invite-card">

        {/* 🎵 AUDIO (controlled, hidden) */}
        <audio ref={audioRef} loop>
          <source src="/ekuro.mp3" type="audio/mpeg" />
        </audio>

        {/* ⏳ COUNTDOWN */}
        {phase === "countdown" && (
          <>
            <h1 className="title">Hey Jummy ❤️</h1>

            <p className="subtitle">
              You're invited to our virtual date
            </p>

            <div className="countdown">
              <span>{timeLeft.days}d</span>
              <span>{timeLeft.hours}h</span>
              <span>{timeLeft.minutes}m</span>
              <span>{timeLeft.seconds}s</span>
            </div>

            <p className="message">{text}</p>

            {/* 🎵 MUSIC BUTTON (FIXED) */}
            <button
              className="music-btn"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.volume = 0.6;
                  audioRef.current.play();
                }
              }}
            >
              🎵 Play Our Song
            </button>
          </>
        )}

        {/* 😶 WAIT */}
        {phase === "wait" && (
          <div className="suspense">
            <h1 className="suspense-text">Wait…</h1>
          </div>
        )}

        {/* 💓 TEASE */}
        {phase === "tease" && (
          <div className="suspense">
            <h1 className="suspense-text">
              I have something to tell you…
            </h1>
            <div className="heartbeat"></div>
          </div>
        )}

        {/* ❤️ REVEAL */}
        {phase === "reveal" && (
          <div className="surprise">
            <h1 className="surprise-title">❤️ For You ❤️</h1>

            <p className="surprise-text">{surpriseMessage}</p>

            <a href={dateLink} target="_blank" rel="noopener noreferrer">
              <button className="join-btn">
                Join Our Date 💕
              </button>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoveInvite;
