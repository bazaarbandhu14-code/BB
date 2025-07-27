# DeepSeek-R1 Model Demo

This repository contains a demonstration of how to use the DeepSeek-R1 model from Hugging Face for text generation.

## About DeepSeek-R1

DeepSeek-R1 is a powerful language model developed by DeepSeek AI. It's designed for various natural language processing tasks and can generate human-like text responses to prompts.

## Setup Instructions

1. **Install Dependencies**

   ```bash
   pip install -r requirements_deepseek.txt
   ```

2. **Hardware Requirements**

   - The full model requires significant GPU memory (at least 16GB recommended)
   - For systems with limited GPU memory, the script uses automatic device mapping and float16 precision
   - CPU-only execution is possible but will be very slow

## Usage

1. **Run the Demo Script**

   ```bash
   python deepseek_demo.py
   ```

   This will run the example with predefined test messages.

2. **Use in Your Own Code**

   ```python
   from deepseek_demo import generate_response
   
   # Get a response to your message
   response = generate_response("Tell me about quantum computing")
   print(response)
   ```

## Customization

You can modify the generation parameters in the `generate_response` function:

- `max_new_tokens`: Controls the maximum length of the generated response
- `temperature`: Controls randomness (lower = more deterministic)
- `top_p`: Nucleus sampling parameter (controls diversity)
- `do_sample`: Whether to use sampling instead of greedy decoding

## Notes

- The first run will download the model from Hugging Face (several GB)
- Subsequent runs will use the cached model
- The model loading time depends on your internet connection and system performance

## Troubleshooting

If you encounter CUDA out-of-memory errors:

1. Try reducing the model size by using quantization (requires additional setup)
2. Use a smaller batch size or reduce max_new_tokens
3. Consider using a CPU-only setup if GPU memory is insufficient