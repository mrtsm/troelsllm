# TroelsLLM: GPT Built from Scratch

**A production-ready GPT implementation (162M parameters) built from first principles to understand transformer architectures at a fundamental level.**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://mrtsm.github.io/troelsllm/) [![Backend API](https://img.shields.io/badge/API-Hugging%20Face-yellow)](https://troelssmit-troels-llm.hf.space) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**🚀 Try the Demo**](https://mrtsm.github.io/troelsllm/) | [**📊 Model Comparison**](https://mrtsm.github.io/troelsllm/comparison.html) | [**📖 Technical Deep-Dive**](https://mrtsm.github.io/troelsllm/architecture.html) | [**🔧 Backend API**](https://troelssmit-troels-llm.hf.space/docs)

---

## Model Variants

This project includes two trained models to demonstrate scaling impact:

### TroelsLLM-Scratch (Baseline)
- **Training Data:** "The Verdict" by Edith Wharton (5,145 tokens)
- **Training Time:** 10 minutes on CPU
- **Purpose:** Demonstrate architecture implementation from scratch
- **Loss:** Train 2.5, Val 3.5
- **Output:** Coherent but limited to story phrases

### TroelsLLM-Books ⭐ (Improved)
- **Training Data:** 3 classic books (360,000 tokens - 72x more!)
  - Pride and Prejudice
  - Alice's Adventures in Wonderland  
  - The Adventures of Sherlock Holmes
- **Training Time:** 5-6 hours on CPU
- **Purpose:** Demonstrate scaling laws and data diversity impact
- **Loss:** Train 4.4, Val 5.9 (higher due to complexity)
- **Output:** Rich vocabulary, multiple genres, significantly better quality

**Key Insight:** 72x more data = dramatically improved quality. Higher loss values with diverse data are normal - the model is learning more complex patterns. [See detailed comparison →](https://mrtsm.github.io/troelsllm/comparison.html)

---

## Overview

This project implements a complete GPT-2 language model (162M parameters) from scratch—no `transformers` library, just PyTorch primitives and mathematical fundamentals. Built as a deep-dive learning exercise following Sebastian Raschka's ["Build a Large Language Model (From Scratch)"](https://github.com/rasbt/LLMs-from-scratch), this demonstrates end-to-end understanding of:

- **Transformer architecture** (attention mechanisms, positional encodings, layer norms)
- **Training dynamics** (loss curves, optimization, regularization)
- **Production deployment** (FastAPI backend, GitHub Pages frontend, Hugging Face hosting)

**Key Achievement:** Trained a working language model in ~10 minutes on CPU that generates coherent text.

---

## What Makes This Different

### 🎯 Built from First Principles
- **No high-level libraries** - Direct implementation of attention, embeddings, and transformer blocks
- **Full training pipeline** - Data loading, batching, optimization, validation splits
- **Production deployment** - Not just a Jupyter notebook - real API serving requests

### 📊 Complete System Understanding
- **Frontend → Backend → Model** - Full stack from UI to matrix multiplication
- **Real training curves** - Watched loss decrease from 11.0 → 2.5 over 10 epochs
- **Deployment tradeoffs** - CPU vs GPU, client-side vs server-side, cold starts vs always-on

### 🚀 Live & Usable
- **Public API** on Hugging Face Spaces (free tier)
- **Polished UI** on GitHub Pages with loading states, error handling
- **Anyone can try it** - No setup required, just visit the URL

---

## Architecture

### Model Specifications

| Component | Value | Rationale |
|-----------|-------|-----------|
| **Parameters** | 162,419,712 | GPT-2 124M variant |
| **Layers** | 12 | Deep enough for complex patterns |
| **Attention Heads** | 12 | Multiple relationship types |
| **Embedding Dim** | 768 | Standard GPT-2 size |
| **Context Length** | 256 tokens | Shortened for faster training |
| **Vocabulary** | 50,257 | GPT-2 BPE tokenizer |
| **Dropout** | 0.1 | Regularization |

### Architecture Flow

```
Input Text
    ↓
Tokenization (BPE)
    ↓
Token Embeddings (768-dim) + Positional Encodings
    ↓
┌─────────────────────────────────────┐
│  Transformer Block 1-12 (stacked)  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Layer Norm                   │ │
│  │         ↓                     │ │
│  │  Multi-Head Self-Attention    │ │
│  │    (12 heads, causal mask)    │ │
│  │         ↓                     │ │
│  │  Residual Connection          │ │
│  │         ↓                     │ │
│  │  Layer Norm                   │ │
│  │         ↓                     │ │
│  │  Feed-Forward Network         │ │
│  │    (768 → 3072 → 768)         │ │
│  │         ↓                     │ │
│  │  Residual Connection          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
    ↓
Final Layer Norm
    ↓
Output Projection (768 → 50257)
    ↓
Softmax → Next Token Probabilities
    ↓
Sampling (top-k, temperature)
    ↓
Generated Token (feed back for next iteration)
```

---

## Key Technical Decisions

### Why These Hyperparameters?

#### **Context Length: 256 tokens** (vs GPT-2's 1024)
- **Tradeoff:** Shorter context = faster training & inference
- **Cost:** Less long-range coherence
- **Rationale:** For learning & demo purposes, 256 is sufficient; production would use 1024+

#### **12 Layers, 12 Heads** (GPT-2 standard)
- **Depth vs Width:** 12 layers allows hierarchical feature learning
- **Multi-head attention:** Each head learns different token relationships (syntax, semantics, etc.)
- **Memory:** 162M params fit comfortably in CPU RAM for inference

#### **Training: 10 epochs on "The Verdict"** (5,145 tokens)
- **Small dataset:** Intentional for fast iteration & learning
- **Loss reduction:** 11.0 → 2.5 (validation: ~3.5) proves the model learns
- **Limitation:** Won't generalize broadly (trained on single story)
- **Scaling:** Could train on Project Gutenberg (millions of tokens) but 100x longer

#### **Optimizer: AdamW** (lr=0.0004, weight_decay=0.1)
- **AdamW:** Handles sparse gradients well, decouples weight decay
- **Learning rate:** 0.0004 is GPT-2 default; stable for this scale
- **Weight decay:** 0.1 prevents overfitting on small dataset

---

## Training Results

### Loss Curves

**Training Loss:**
```
Epoch  1: 10.93 → 8.12
Epoch  5: 4.56
Epoch 10: 2.45
```

**Validation Loss:**
```
Epoch  1: 10.94
Epoch  5: 5.23
Epoch 10: 3.52
```

**Analysis:**
- ✅ Both losses decreasing = model is learning
- ✅ Validation slightly higher = expected (unseen data)
- ✅ Gap <50% = not severely overfitting
- ⚠️ Small dataset limits generalization

### Generation Quality

**Before Training (random weights):**
```
Prompt: "Hello, I am"
Output: "stuck when INV largestidays517ismanEG marketed..."
```

**After Training (10 epochs):**
```
Prompt: "Hello, I am"
Output: "Jack Gisburn rather a cheap genius--though a good fellow..."
```

**Analysis:**
- ✅ Grammatically correct
- ✅ Contextually appropriate (references training story)
- ✅ Coherent sentence structure
- ⚠️ Limited by 5K token training set

---

## Production Deployment

### System Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Pages (Frontend)                        │
│  - HTML/CSS/JavaScript                          │
│  - Chat interface                               │
│  - Mobile responsive                            │
│  https://mrtsm.github.io/troelsllm/            │
└────────────────┬────────────────────────────────┘
                 │ HTTP POST /generate
                 ↓
┌─────────────────────────────────────────────────┐
│  Hugging Face Spaces (Backend)                  │
│  - FastAPI server                               │
│  - PyTorch model (CPU inference)                │
│  - 623MB model.pth via Git LFS                  │
│  https://troelssmit-troels-llm.hf.space        │
└─────────────────────────────────────────────────┘
```

### Infrastructure Choices

#### **Frontend: GitHub Pages**
- ✅ **Free, CDN-backed** - Fast global delivery
- ✅ **Simple deployment** - Git push = deploy
- ✅ **Static hosting** - Perfect for pure JS frontend
- ❌ **No server-side code** - Can't run Python/PyTorch

#### **Backend: Hugging Face Spaces**
- ✅ **Free CPU tier** - Sufficient for demo workload
- ✅ **Git-based deployment** - Push to deploy
- ✅ **Docker support** - Full control over environment
- ✅ **Built for ML models** - Git LFS for large files (623MB)
- ⚠️ **Cold starts** - Free tier sleeps after 48h idle (~10s wake-up)

#### **Alternative Considered:**
- **Client-side (Transformers.js):** 500MB browser download, slow inference
- **Railway/Render:** Limited free tiers, no ML focus
- **AWS/GCP:** Costs money, overkill for demo

### API Design

**Endpoint:** `POST /generate`

**Request:**
```json
{
  "prompt": "The painting was",
  "max_tokens": 50,
  "temperature": 0.7,
  "top_k": 50
}
```

**Response:**
```json
{
  "response": "you know, was one of the axioms he laid down...",
  "prompt": "The painting was",
  "tokens_generated": 50,
  "model_info": {
    "layers": 12,
    "heads": 12,
    "embedding_dim": 768
  }
}
```

**Interactive Docs:** https://troelssmit-troels-llm.hf.space/docs

---

## Key Learnings

### 1. Attention is Non-Intuitive
**Before:** "Attention lets tokens look at each other"  
**After:** Attention is *learned, weighted averaging* where Query/Key determine weights and Value is what gets averaged. Each head learns different linguistic relationships (syntax, coreference, semantic similarity).

### 2. Training Dynamics Are Fragile
- **Learning rate too high:** Loss diverges (NaN)
- **No weight decay:** Overfits immediately on small data
- **Wrong initialization:** Dead neurons or vanishing gradients
- **Batch size matters:** Too small = noisy gradients; too large = memory issues

### 3. Scale Changes Everything
- **5K tokens:** Model memorizes specific phrases
- **5M tokens:** Model learns grammar and style
- **5B tokens:** Model develops reasoning capabilities

This project trained on 5K tokens - enough to prove the architecture works, not enough for general language understanding.

### 4. Deployment != Training
- **Training:** PyTorch, GPU-friendly, batch processing
- **Inference:** One request at a time, CPU ok for demo, latency matters
- **Production:** Need monitoring, error handling, rate limiting, caching

### 5. Product Tradeoffs Are Real
- **Accuracy vs Speed:** Bigger model = better text, slower generation
- **Cost vs Quality:** GPT-4 API ($) vs self-hosted GPT-2 (time)
- **User Experience:** Cold start warning vs always-on paid tier

---

## Getting Started

### Try the Live Demo
**👉 https://mrtsm.github.io/troelsllm/**

Best prompts (from training data):
- "I HAD always thought"
- "Jack Gisburn was"
- "The painting"

### Run Locally

#### Frontend:
```bash
git clone https://github.com/mrtsm/troelsllm.git
cd troelsllm
python3 -m http.server 8000
# Visit http://localhost:8000
```

#### Backend (requires PyTorch):
```bash
# Clone backend repo
git clone https://huggingface.co/spaces/troelssmit/troels-llm
cd troels-llm

# Install dependencies
pip install torch tiktoken fastapi uvicorn

# Run server
python app.py
# API runs on http://localhost:7860
```

### Train Your Own Model

```bash
# Clone learning repository
git clone https://github.com/rasbt/LLMs-from-scratch.git
cd LLMs-from-scratch/ch05/01_main-chapter-code

# Train (10 epochs, ~10 minutes on CPU)
python gpt_train.py

# Model saved as model.pth (623MB)
```

---

## Tech Stack

### Core Implementation
- **Python 3.12** - Language
- **PyTorch 2.0** - Deep learning framework
- **tiktoken** - GPT-2 tokenizer (OpenAI's BPE)
- **NumPy** - Numerical operations

### Web Backend
- **FastAPI** - API framework (async, automatic docs)
- **Uvicorn** - ASGI server
- **Pydantic** - Request/response validation

### Web Frontend
- **Vanilla JavaScript** - No framework overhead
- **HTML5 + CSS3** - Semantic, responsive
- **No dependencies** - Just browser APIs

### Infrastructure
- **GitHub Pages** - Frontend hosting
- **Hugging Face Spaces** - Backend hosting (Docker)
- **Git LFS** - Large file storage (model.pth)

---

## Project Structure

```
troelsllm/
├── index.html              # Main UI
├── app.js                  # Frontend logic
├── styles.css              # Styling
└── README.md               # This file

Backend (separate repo on HF Spaces):
troels-llm/
├── app.py                  # FastAPI server
├── gpt.py                  # Model implementation
├── model.pth               # Trained weights (623MB)
├── requirements.txt        # Python dependencies
├── Dockerfile              # HF Spaces deployment
└── README.md               # API documentation
```

---

## Scaling Considerations

### What Would Change for Production?

#### **Model Scale**
- **Current:** 162M params, 256 context, 5K training tokens
- **Production:** 7B+ params, 4K+ context, 100B+ training tokens
- **Impact:** 40x more compute, 15x more context, dramatically better quality

#### **Infrastructure**
- **Current:** Free CPU tier, cold starts ok
- **Production:** Always-on GPU instances, load balancing, auto-scaling
- **Cost:** ~$100-1000/month depending on traffic

#### **Training**
- **Current:** Single CPU, 10 minutes, one dataset
- **Production:** Multi-GPU cluster, days/weeks, curated multi-domain data
- **Cost:** $10K-1M+ depending on scale

#### **Monitoring**
- **Current:** Manual testing
- **Production:** Logging, metrics, A/B testing, user feedback loops, red-teaming

---

## Future Enhancements

### Technical
- [ ] Train on larger dataset (Project Gutenberg)
- [ ] Implement KV-caching for faster generation
- [ ] Add beam search / nucleus sampling options
- [ ] Fine-tune for specific tasks (Chapter 6-7 of book)
- [ ] Experiment with different architectures (MoE, Mamba)

### Product
- [ ] Conversation history & context
- [ ] Share generated text (Twitter, etc.)
- [ ] Compare with other models (GPT-2, GPT-3.5)
- [ ] Show attention visualization
- [ ] User feedback collection

### Infrastructure
- [ ] GPU inference for faster responses
- [ ] Model quantization (4-bit) for smaller size
- [ ] Response caching for common prompts
- [ ] Rate limiting & authentication

---

## Resources & References

### Primary Source
- **Book:** ["Build a Large Language Model (From Scratch)"](https://github.com/rasbt/LLMs-from-scratch) by Sebastian Raschka
- **Code Repository:** [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)

### Key Papers
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original Transformer paper (Vaswani et al., 2017)
- [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) - GPT-2 (OpenAI, 2019)
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) - GPT-3 (Brown et al., 2020)

### Tools & Libraries
- [PyTorch](https://pytorch.org/) - Deep learning framework
- [Hugging Face](https://huggingface.co/) - Model hosting & community
- [Transformers.js](https://github.com/xenova/transformers.js) - Client-side ML (explored but not used)

---

## About the Author

**Troels Smit** - Product Manager at Meta Reality Labs  
Building AI-powered experiences for Ray-Ban smart glasses, including image restyling and multimodal AI features.

**Connect:**
- [GitHub](https://github.com/mrtsm)
- [LinkedIn](#) <!-- Add your LinkedIn -->

---

## License

MIT License - Feel free to use this code for learning and experimentation!

---

## Acknowledgments

- **Sebastian Raschka** for the excellent book and learning structure
- **Meta Reality Labs** for fostering AI product innovation
- **The open-source ML community** for making knowledge accessible

---

<div align="center">

**[🚀 Try the Live Demo](https://mrtsm.github.io/troelsllm/)** | **[📖 View API Docs](https://troelssmit-troels-llm.hf.space/docs)** | **[⭐ Star on GitHub](https://github.com/mrtsm/troelsllm)**

*Built with curiosity, deployed with confidence* 🧠✨

</div>
