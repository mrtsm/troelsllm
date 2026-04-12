// TroelsLLM - Custom trained GPT model
const API_URL = 'https://troelssmit-troels-llm.hf.space';

let isGenerating = false;
let apiReady = false;

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
            apiReady = true;
            console.log('Connected to TroelsLLM API:', data);
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('Error connecting to API:', error);
        document.getElementById('model-status').textContent = 'Waking up...';
        apiReady = false;
        // Show helpful message
        addMessage('system', '🔄 Backend is waking up (first load takes ~10 seconds). Please try sending a message!');
    }
}

// Add message to chat
function addMessage(type, content, metadata = {}) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (type === 'assistant' && content === 'loading') {
        contentDiv.innerHTML = `
            <div class="loading">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <div style="margin-top: 8px; font-size: 0.9em; color: #666;">
                Generating response... (takes 2-10 seconds)
            </div>
        `;
    } else {
        contentDiv.textContent = content;
        
        // Add copy button for assistant messages
        if (type === 'assistant' && content !== 'loading') {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-button';
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.onclick = () => copyToClipboard(content, copyBtn);
            
            actionsDiv.appendChild(copyBtn);
            messageDiv.appendChild(actionsDiv);
            
            // Add timing info if available
            if (metadata.duration) {
                const timingDiv = document.createElement('div');
                timingDiv.className = 'message-timing';
                timingDiv.textContent = `Generated in ${metadata.duration}s`;
                messageDiv.appendChild(timingDiv);
            }
        }
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Send message
async function sendMessage() {
    if (isGenerating) {
        console.log('Already generating, please wait...');
        return;
    }
    
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) {
        console.log('Empty message, ignoring');
        return;
    }
    
    console.log('Sending message:', message);
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    // Disable input while generating
    isGenerating = true;
    const sendButton = document.getElementById('send-button');
    const originalButtonText = sendButton.innerHTML;
    
    sendButton.innerHTML = '⏳ Generating...';
    sendButton.disabled = true;
    input.disabled = true;
    
    // Show loading message with timing info
    const loadingMessage = addMessage('assistant', 'loading');
    
    try {
        console.log('Calling API:', API_URL + '/generate');
        
        const startTime = performance.now();
        
        // Call backend API
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 50,
                temperature: 0.7,
                top_k: 50
            })
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        // Remove loading message
        loadingMessage.remove();
        
        // Calculate duration
        const duration = ((performance.now() - startTime) / 1000).toFixed(1);
        
        // Add AI response with timing
        addMessage('assistant', data.response, { duration });
        
        // Update status if it was waking up
        if (!apiReady) {
            document.getElementById('model-status').textContent = 'Ready';
            apiReady = true;
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        
        // Remove loading message
        loadingMessage.remove();
        
        // Show helpful error message
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addMessage('system', '🔄 Backend is starting up (first request can take 10-15 seconds). Please try again!');
        } else {
            addMessage('system', `⚠️ Error: ${error.message}. Please try again in a moment.`);
        }
    } finally {
        // Re-enable input
        isGenerating = false;
        sendButton.innerHTML = originalButtonText;
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
        
        console.log('Generation complete, input re-enabled');
    }
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    
    console.log('DOM loaded, setting up event listeners');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('Enter key pressed, sending message');
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });
    
    // Check API status
    checkAPIStatus();
});

// Use example prompt
function useExample(text) {
    const input = document.getElementById('user-input');
    input.value = text;
    input.focus();
    // Auto-send
    setTimeout(() => sendMessage(), 100);
}

// Copy to clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✓ Copied!';
        button.style.color = '#4caf50';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        button.innerHTML = '✗ Failed';
    });
}

// Clear chat
function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `
        <div class="message system-message">
            <div class="message-content">
                <p>👋 Welcome to TroelsLLM!</p>
                <p>A working GPT model (162M parameters) built and trained from scratch.</p>
                <p><strong>Try these prompts from the training data:</strong></p>
                <div class="example-prompts">
                    <button class="example-prompt" onclick="useExample('I HAD always thought')">"I HAD always thought"</button>
                    <button class="example-prompt" onclick="useExample('Jack Gisburn was')">"Jack Gisburn was"</button>
                    <button class="example-prompt" onclick="useExample('The painting')">"The painting"</button>
                </div>
            </div>
        </div>
    `;
}

// Toggle About section
function toggleAbout() {
    const content = document.getElementById('about-content');
    const arrow = document.getElementById('about-arrow');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▶';
    }
}

// Make functions available globally
window.sendMessage = sendMessage;
window.useExample = useExample;
window.clearChat = clearChat;
window.toggleAbout = toggleAbout;

console.log('TroelsLLM app.js loaded successfully');
