# TroelsLLM

A ChatGPT-style web interface demonstrating a GPT model built from scratch, following Sebastian Raschka's book "Build a Large Language Model (From Scratch)".

## 🚀 Live Demo

**URL:** https://mrtsm.github.io/troelsllm/

## 📖 About

This project is a learning journey to understand how Large Language Models work by building one from scratch. The website provides an interactive interface to chat with the model.

### Current Status

**Phase 1 (MVP):** ✅ Complete
- Clean ChatGPT-style interface
- Working text generation using Transformers.js
- Mobile-responsive design
- Deployed on GitHub Pages

**Phase 2 (In Progress):** 🚧
- Replace with custom GPT model built from book code
- Implement model architecture visualization
- Add training progress tracking

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Model:** Transformers.js (Xenova/gpt2)
- **Hosting:** GitHub Pages
- **Book Reference:** "Build a Large Language Model (From Scratch)" by Sebastian Raschka

## 📚 Learning Progress

Following the book chapters:
- ✅ Chapter 2: Working with Text Data (Tokenization, Embeddings)
- ✅ Chapter 3: Coding Attention Mechanisms
- ✅ Chapter 4: Implementing a GPT Model from Scratch
- 🚧 Chapter 5: Pretraining on Unlabeled Data (Next)

## 🏗️ Model Architecture

Current implementation uses GPT-2 (124M parameters) via Transformers.js.

**Custom model configuration (planned):**
```javascript
{
  vocab_size: 50257,
  context_length: 256,
  emb_dim: 256,
  n_heads: 4,
  n_layers: 4,
  drop_rate: 0.1
}
```

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com/mrtsm/troelsllm.git
cd troelsllm
```

2. Serve locally (Python):
```bash
python3 -m http.server 8000
```

3. Open http://localhost:8000 in your browser

## 📝 Features

- ✅ ChatGPT-style interface
- ✅ Real-time text generation
- ✅ Mobile-responsive design
- ✅ Loading states and animations
- ✅ Error handling
- 🚧 Conversation history (coming soon)
- 🚧 Model configuration display (coming soon)
- 🚧 Custom model integration (coming soon)

## 🎯 Future Improvements

1. **Custom Model Integration**
   - Convert PyTorch model to ONNX.js
   - Load custom-trained weights
   - Show architecture visualization

2. **Enhanced UI**
   - Token count display
   - Generation settings (temperature, max tokens)
   - Copy response button
   - Clear conversation

3. **Learning Features**
   - Show attention weights
   - Visualize token embeddings
   - Step-by-step generation view

## 📖 How It Works

### Data Flow
```
User Input → Tokenization → Model Forward Pass → Token Generation → Display
```

### Key Components

**1. Tokenization (Chapter 2)**
- Text is split into tokens using BPE (Byte Pair Encoding)
- Each token is mapped to an ID

**2. Embeddings (Chapter 2)**
- Token IDs are converted to dense vectors
- Positional encodings are added

**3. Attention Mechanism (Chapter 3)**
- Self-attention allows tokens to focus on relevant context
- Multi-head attention captures different relationships

**4. Transformer Blocks (Chapter 4)**
- Stacked layers of attention + feedforward networks
- Layer normalization and residual connections

**5. Text Generation**
- Autoregressive: generates one token at a time
- Each token is fed back to generate the next

## 🔧 Modifying the Model

### Change Generation Parameters

Edit `app.js`:
```javascript
const result = await generator(message, {
    max_new_tokens: 50,     // Number of tokens to generate
    temperature: 0.7,        // Randomness (0.1-2.0)
    top_k: 50,              // Consider top K tokens
    top_p: 0.95             // Nucleus sampling threshold
});
```

### Switch to Different Model

Replace model name in `app.js`:
```javascript
generator = await pipeline('text-generation', 'Xenova/gpt2');
// Try: 'Xenova/distilgpt2' (smaller, faster)
```

## 📚 Resources

- **Book:** [Build a Large Language Model (From Scratch)](https://www.manning.com/books/build-a-large-language-model-from-scratch) by Sebastian Raschka
- **Code Repository:** [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)
- **Transformers.js:** [xenova/transformers.js](https://github.com/xenova/transformers.js)

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this code for your own learning!

## 🙏 Acknowledgments

- Sebastian Raschka for the excellent book
- Xenova for Transformers.js
- The open-source ML community

---

**Built while learning** 📚 | **Deployed on GitHub Pages** 🚀 | **Continuously improving** 🔄
