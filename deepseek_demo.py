# DeepSeek-R1 Model Demo
# This script demonstrates how to use the DeepSeek-R1 model from Hugging Face

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def generate_response(user_message):
    # Load the tokenizer and model
    print("Loading DeepSeek-R1 model and tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        "deepseek-ai/DeepSeek-R1", 
        trust_remote_code=True,
        torch_dtype=torch.float16,  # Use float16 for efficiency
        device_map="auto"  # Automatically determine the best device mapping
    )
    
    # Create the messages list with the user's message
    messages = [
        {"role": "user", "content": user_message},
    ]
    
    # Apply the chat template to format the input for the model
    print("Generating response...")
    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
    ).to(model.device)
    
    # Generate the response
    outputs = model.generate(
        **inputs, 
        max_new_tokens=100,  # Generate up to 100 new tokens
        temperature=0.7,     # Control randomness (lower = more deterministic)
        top_p=0.9,           # Nucleus sampling parameter
        do_sample=True       # Use sampling instead of greedy decoding
    )
    
    # Decode and return the generated response
    response = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)
    return response

# Example usage
if __name__ == "__main__":
    # Test with a few example messages
    test_messages = [
        "Who are you?",
        "Explain the concept of machine learning in simple terms.",
        "Write a short poem about artificial intelligence."
    ]
    
    for message in test_messages:
        print(f"\nUser: {message}")
        response = generate_response(message)
        print(f"DeepSeek-R1: {response}")
        print("-" * 50)