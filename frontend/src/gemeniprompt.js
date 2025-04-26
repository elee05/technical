import { useState } from "react";

function GeminiPrompt() {
  const [prompt, setPrompt] = useState("Boston");
  const [response, setResponse] = useState("");

  const sendPrompt = async () => {

      
    const res = await fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput: prompt })
    });


    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    setResponse(data.response || data.message || JSON.stringify(data));
  };

  return (
    <div className="p-4 space-y-4">
      <p></p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        className="w-full border rounded p-2"
        placeholder="Enter your prompt here"
      />
      <button
        onClick={sendPrompt}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get More Info!
      </button>
      <div className="mt-4 whitespace-pre-wrap">{response}</div>
    </div>
  );
}

export default GeminiPrompt;
