# Simple DeepSeek-R1 Implementation
# A minimal implementation for using DeepSeek-R1 model

from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model and tokenizer
print("Loading model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)

# User message
user_message = "Who are you?"
print(f"\nUser: {user_message}")

# Create messages list
messages = [
    {"role": "user", "content": user_message},
]

# Apply chat template and generate response
inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    tokenize=True,
    return_dict=True,
    return_tensors="pt",
).to(model.device)

# Generate response
outputs = model.generate(**inputs, max_new_tokens=40)

# Decode and print response
response = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)
print(f"DeepSeek-R1: {response}")