import React, { useState } from "react";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isWaitingForCommand, setIsWaitingForCommand] = useState(true);

  // Function to speak text
  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      if (callback) callback(); // Call the callback when speech ends
    };
  };



  // Function to handle recognized commands
  const handleCommand = (command) => {
    if (command.includes("open youtube")) {
      const message = "Opening YouTube...";
      setResponse(message);
      speak(message);
      window.open("https://www.youtube.com", "_blank");
    } else if (command.includes("open google")) {
      const message = "Opening Google...";
      setResponse(message);
      speak(message);
      window.open("https://www.google.com", "_blank");
    } else if (command.includes("open facebook")) {
      const message = "Opening Facebook...";
      setResponse(message);
      speak(message);
      window.open("https://www.facebook.com", "_blank");
    } else if (command.includes("open instagram")) {
      const message = "Opening Instagram...";
      setResponse(message);
      speak(message);
      window.open("https://www.instagram.com", "_blank");
    } else if (command.includes("open whatsapp")) {
      const message = "Opening WhatsApp...";
      setResponse(message);
      speak(message);
      window.open("https://www.whatsapp.com", "_blank");
    } else {
      const message = `Searching Google for "${command}"`;
      setResponse(message);
      speak(message);
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(command)}`,
        "_blank"
      );
    }
  };


  // Function to start listening
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const message = "Speech Recognition is not supported in this browser.";
      setResponse(message);
      speak(message);
      alert(message);
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    // Event when recognition starts
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setTranscript(command);
      handleCommand(command);

      setTimeout(() => {
        setIsWaitingForCommand(true);
      }, 1000); // Slight delay to reset button
    };

    // Event when recognition ends
    recognition.onend = () => {
      setIsListening(false);
    };

    // Event when an error occurs
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setResponse(`Error: ${event.error}`);
      setIsListening(false);
      speak("Network Error please use diffrent browseer")
    };

    // Start recognition
    recognition.start();
  };

  // Function to handle button click
  const handleButtonClick = () => {
    setIsWaitingForCommand(false);
    speak("Listening... Please give me a command.", () => {
      startListening(); // Start listening after speech ends
    });
  };

  return (
    <div className="relative bg flex flex-col items-center justify-center min-h-screen">
      <div className="relative z-10 text-center">
        <h1 className="text-4xl lg:text-5xl  text-green-700 font-extrabold mb-4">React Voice Assistant</h1>
        <p className="mb-4 text-white">
          {isWaitingForCommand
            ? "Please give me a command"
            : "Processing your command..."}
        </p>
        <button
          onClick={handleButtonClick}
          className={`px-6 py-3 font-semibold rounded-md transition ${isListening || !isWaitingForCommand
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          disabled={isListening || !isWaitingForCommand}
        >
          {isListening ? "Listening... 👂" : "Start Listening"}
        </button>

        <div className="mt-6 w-full max-w-xl h-auto bg-white shadow-md rounded-xl p-4">
          <p className="text-gray-700 text-xl">
            <span className="text-green-700">Recognized Speech</span>: {transcript || "N/A"}
          </p>
          <p className="text-gray-800 mt-2 text-lg"><span className="text-orange-600">Response</span>: {response || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
