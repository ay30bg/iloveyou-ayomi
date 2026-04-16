import React, { useEffect, useState, useMemo, useRef } from "react";
import "../styles/loveInvite.css";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

const LoveInvite = () => {
  const dateLink = "https://meet.google.com/yrc-jqsk-fka";

  const targetDate = useMemo(() => {
    return new Date("2026-04-16T14:00:00").getTime();
  }, []);

  const [timeLeft, setTimeLeft] = useState({});
  const [phase, setPhase] = useState("countdown");
  const [text, setText] = useState("");
  const [opened, setOpened] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sparkle, setSparkle] = useState(false);

  // 🖋️ NEW: typed letter state
  const [typedLetter, setTypedLetter] = useState("");

  const audioRef = useRef(null);
  const letterRef = useRef(null);

  const videos = [
    "/videos/memories1.mp4",
    "/videos/memories2.mp4",
    "/videos/memories3.mp4",
    "/videos/memories4.mp4",
  ];

  const message =
    "I planned something special for us... I can't wait to spend this moment with you ❤️";

  const surpriseMessage =
    "6 - months with you, and my heart is still choosing you every day ❤️ Thank you for being my happiness. I love you endlessly Ayomi💕";

  // ⏳ countdown
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

  // ✍️ intro typing
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(message.slice(0, i));
      i++;
      if (i > message.length) clearInterval(typing);
    }, 40);

    return () => clearInterval(typing);
  }, []);

  // 🎇 confetti
  useEffect(() => {
    if (phase === "reveal") {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [phase]);

  // 🎵 audio
  const fadeInAudio = () => {
    let vol = 0;
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0;
    audio.play();

    const fade = setInterval(() => {
      if (vol < 0.6) {
        vol += 0.05;
        audio.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 200);
  };

  // 📸 download letter
  const downloadLetter = async () => {
    setSparkle(true);

    setTimeout(async () => {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = "love-letter.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      setSparkle(false);
    }, 800);
  };

  // 🖋️ WORD-BY-WORD LETTER WRITING
  useEffect(() => {
    if (phase !== "reveal" || !opened) return;

    const words = surpriseMessage.split(" ");
    let i = 0;

    setTypedLetter("");

    const interval = setInterval(() => {
      setTypedLetter((prev) => {
        return prev + (i === 0 ? "" : " ") + words[i];
      });

      i++;
      if (i >= words.length) clearInterval(interval);
    }, 250);

    return () => clearInterval(interval);
  }, [phase, opened]);

  return (
    <div className={`invite-container ${phase !== "countdown" ? "suspense-mode" : ""}`}>

      {sparkle && <div className="sparkle-overlay">✨ Writing memory... 💖</div>}

      <div className="hearts">
        {[...Array(20)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="invite-card">

        <audio ref={audioRef} loop>
          <source src="/ekuro.mp3" type="audio/mpeg" />
        </audio>

        {/* COUNTDOWN */}
        {phase === "countdown" && (
          <>
            <h1 className="title">Hey Jummy ❤️</h1>
            <p className="subtitle">You're invited to our virtual date</p>

            <div className="countdown">
              <span>{timeLeft.days}d</span>
              <span>{timeLeft.hours}h</span>
              <span>{timeLeft.minutes}m</span>
              <span>{timeLeft.seconds}s</span>
            </div>

            <p className="message">{text}</p>

            <button className="music-btn" onClick={fadeInAudio}>
              🎵 Play Our Song
            </button>
          </>
        )}

        {/* WAIT */}
        {phase === "wait" && (
          <div className="suspense">
            <h1 className="suspense-text">Wait…</h1>
          </div>
        )}

        {/* TEASE */}
        {phase === "tease" && (
          <div className="suspense">
            <h1 className="suspense-text">I have something to tell you…</h1>
            <div className="heartbeat"></div>
          </div>
        )}

        {/* LETTER */}
        {phase === "reveal" && (
          <div className="surprise">

            {!opened ? (
              <button className="open-letter" onClick={() => setOpened(true)}>
                💌 Open My Letter
              </button>
            ) : (
              <div className="letter-view">

                <div ref={letterRef} className="letter-card">
                  <h1 className="surprise-title">❤️ For You ❤️</h1>

                  <p className="surprise-text ink-writing">
                    {typedLetter}
                  </p>

                  <p className="date-stamp">
                    {new Date().toDateString()}
                  </p>
                </div>

                <div className="letter-actions">

                  <button className="next-btn" onClick={() => setPhase("gallery")}>
                    See Our Memories 🎬
                  </button>

                  <button className="share-btn" onClick={downloadLetter}>
                    📸 Download Letter
                  </button>

                </div>

              </div>
            )}
          </div>
        )}

        {/* GALLERY */}
        {phase === "gallery" && (
          <div className="gallery-screen">

            <h1 className="gallery-main-title">Our Memories 🎬</h1>

            <div className="video-gallery">
              {videos.map((vid, i) => (
                <div key={i} className="video-card" onClick={() => setSelectedVideo(vid)}>
                  <video src={vid} muted />
                </div>
              ))}
            </div>

            <a href={dateLink} target="_blank" rel="noopener noreferrer">
              <button className="join-btn big">Join Our Date 💕</button>
            </a>

          </div>
        )}

      </div>

      {selectedVideo && (
  <div className="video-modal">
    
    <div className="video-modal-content">

      <video src={selectedVideo} controls autoPlay />

      <button
        className="close-video-btn"
        onClick={() => setSelectedVideo(null)}
      >
        ✖ Back to Gallery
      </button>

    </div>

  </div>
)}

    </div>
  );
};

export default LoveInvite;
