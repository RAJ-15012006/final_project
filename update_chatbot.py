import re

with open("src/components/Chatbot.jsx", "r") as f:
    content = f.read()

pattern = re.compile(r'const handleSend = \(\) => \{.*?(?=  return \()', re.DOTALL)

new_func = """const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    const problemTitle = problemData?.title || "";
    fetch("http://localhost:8000/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputValue, problem_title: problemTitle })
    })
    .then(res => res.json())
    .then(data => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: data.response || "No response received." }]);
    })
    .catch(err => {
      setIsTyping(false);
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Error connecting to AI backend." }]);
    });
  };

"""

content = pattern.sub(new_func, content)

with open("src/components/Chatbot.jsx", "w") as f:
    f.write(content)
