// TroelsLLM - Connected to custom backend API
const API_URL = 'https://troelssmit-troels-llm.hf.space';

let isGenerating = false;

// Check API status on page load
async function checkAPIStatus() {
    try {
        document.getElementById('model-status').textContent = 'Connecting...';
        
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('model-status').textContent = 'Ready';
            console.log('Connected to TroelsLLM API:', data);
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('Error connecting to API:', error);
        document.getElementById('model-status').textContent = 'Offline';
        addMessage('system', 'Backend API is offline. It may be starting up (first request takes ~10 seconds).');
    }
}

// Add message to chat
function addMessage(type, text) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Generate text using backend API
async function generateText() {
    if (isGenerating) return;
    
    const input = document.getElementById('prompt-input');
    const prompt = input.value.trim();
    
    if (!prompt) {
        return;
    }
    
    // Add user message
    addMessage('user', prompt);
    input.value = '';
    
    // Show generating indicator
    isGenerating = true;
    const generateBtn = document.getElementById('generate-btn');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    try {
        // Call backend API
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.7,
                top_k: 50
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add AI response
        addMessage('ai', data.response);
        
    } catch (error) {
        console.error('Generation error:', error);
        addMessage('system', `Error: ${error.message}. The backend may be waking up from sleep. Please try again in 10 seconds.`);
    } finally {
        isGenerating = false;
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

// Handle Enter key
document.getElementById('prompt-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateText();
    }
});

// Handle generate button
document.getElementById('generate-btn').addEventListener('click', generateText);

// Check API status on load
checkAPIStatus();

// Add welcome message
addMessage('system', 'Connected to TroelsLLM - A GPT model trained from scratch! This model was trained on "The Verdict" by Edith Wharton.');
