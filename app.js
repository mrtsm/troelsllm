import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

let generator = null;
let isGenerating = false;

// Initialize the model
async function initModel() {
    try {
        document.getElementById('model-status').textContent = 'Loading...';
        
        // Load the text generation pipeline with GPT-2
        generator = await pipeline('text-generation', 'Xenova/gpt2');
        
        document.getElementById('model-status').textContent = 'Ready';
        console.log('Model loaded successfully!');
    } catch (error) {
        console.error('Error loading model:', error);
        document.getElementById('model-status').textContent = 'Error';
        addMessage('system', 'Failed to load model. Please refresh the page.');
    }
}

// Add message to chat
function addMessage(type, content) {
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
        `;
    } else {
        contentDiv.textContent = content;
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Send message
async function sendMessage() {
    if (isGenerating) return;
    
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    if (!generator) {
        addMessage('system', 'Model is still loading. Please wait...');
        return;
    }
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    // Disable input while generating
    isGenerating = true;
    document.getElementById('send-button').disabled = true;
    input.disabled = true;
    
    // Show loading
    const loadingMessage = addMessage('assistant', 'loading');
    
    try {
        // Generate response
        const result = await generator(message, {
            max_new_tokens: 50,
            do_sample: true,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95
        });
        
        // Remove loading message
        loadingMessage.remove();
        
        // Extract generated text
        const generatedText = result[0].generated_text;
        
        // Remove the prompt from the generated text if it's included
        let response = generatedText;
        if (generatedText.startsWith(message)) {
            response = generatedText.slice(message.length).trim();
        }
        
        // If response is empty, use the full generated text
        if (!response) {
            response = generatedText;
        }
        
        // Add assistant message
        addMessage('assistant', response);
        
    } catch (error) {
        console.error('Generation error:', error);
        loadingMessage.remove();
        addMessage('system', 'Sorry, there was an error generating a response. Please try again.');
    } finally {
        isGenerating = false;
        document.getElementById('send-button').disabled = false;
        input.disabled = false;
        input.focus();
    }
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });
    
    // Initialize model
    initModel();
});

// Make sendMessage available globally
window.sendMessage = sendMessage;
