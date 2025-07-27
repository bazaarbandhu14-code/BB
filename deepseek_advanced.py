# Advanced DeepSeek-R1 Implementation
# This script demonstrates advanced usage of DeepSeek-R1 with memory optimization

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import List, Dict, Any, Optional
import argparse
import gc

class DeepSeekModel:
    def __init__(self, 
                 model_name: str = "deepseek-ai/DeepSeek-R1",
                 use_4bit: bool = False,
                 use_8bit: bool = False,
                 device: Optional[str] = None,
                 cpu_only: bool = False):
        """
        Initialize the DeepSeek model with various optimization options.
        
        Args:
            model_name: HuggingFace model identifier
            use_4bit: Whether to use 4-bit quantization (requires bitsandbytes)
            use_8bit: Whether to use 8-bit quantization (requires bitsandbytes)
            device: Specific device to use (e.g., 'cuda:0', 'cpu')
            cpu_only: Force CPU usage regardless of GPU availability
        """
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.use_4bit = use_4bit
        self.use_8bit = use_8bit
        self.cpu_only = cpu_only
        
        # Determine device
        if cpu_only:
            self.device = "cpu"
        elif device:
            self.device = device
        else:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
        print(f"Using device: {self.device}")
        
    def load_model(self):
        """Load the model and tokenizer with the specified optimizations"""
        print(f"Loading {self.model_name}...")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name, 
            trust_remote_code=True
        )
        
        # Prepare model loading kwargs
        model_kwargs = {
            "trust_remote_code": True,
        }
        
        # Add quantization if requested
        if self.use_4bit:
            print("Using 4-bit quantization")
            model_kwargs.update({
                "load_in_4bit": True,
                "bnb_4bit_compute_dtype": torch.float16,
                "bnb_4bit_quant_type": "nf4",
            })
        elif self.use_8bit:
            print("Using 8-bit quantization")
            model_kwargs.update({"load_in_8bit": True})
        elif self.device == "cuda":
            # Use half precision for CUDA without quantization
            model_kwargs.update({"torch_dtype": torch.float16})
        
        # Set device map
        if self.device == "cpu":
            model_kwargs["device_map"] = {"":"cpu"}
        else:
            model_kwargs["device_map"] = "auto"
        
        # Load the model
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            **model_kwargs
        )
        
        print("Model loaded successfully")
        return self
    
    def generate_response(self, 
                         messages: List[Dict[str, str]],
                         max_new_tokens: int = 100,
                         temperature: float = 0.7,
                         top_p: float = 0.9,
                         top_k: int = 50,
                         do_sample: bool = True) -> str:
        """
        Generate a response based on the provided messages.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            max_new_tokens: Maximum number of tokens to generate
            temperature: Controls randomness (lower = more deterministic)
            top_p: Nucleus sampling parameter
            top_k: Top-k sampling parameter
            do_sample: Whether to use sampling instead of greedy decoding
            
        Returns:
            Generated response as a string
        """
        if self.model is None or self.tokenizer is None:
            raise ValueError("Model and tokenizer must be loaded before generating responses")
        
        # Apply chat template
        inputs = self.tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(self.model.device)
        
        # Generate response
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
                do_sample=do_sample,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode response
        response = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        )
        
        return response
    
    def unload_model(self):
        """Unload the model and free up GPU memory"""
        if self.model is not None:
            del self.model
            self.model = None
        if self.tokenizer is not None:
            del self.tokenizer
            self.tokenizer = None
        
        # Force garbage collection
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()
        
        print("Model unloaded and memory freed")


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="DeepSeek-R1 Advanced Demo")
    parser.add_argument("--message", type=str, default="Who are you?", 
                        help="Message to send to the model")
    parser.add_argument("--4bit", dest="use_4bit", action="store_true", 
                        help="Use 4-bit quantization")
    parser.add_argument("--8bit", dest="use_8bit", action="store_true", 
                        help="Use 8-bit quantization")
    parser.add_argument("--cpu", action="store_true", 
                        help="Force CPU usage")
    parser.add_argument("--max-tokens", type=int, default=100, 
                        help="Maximum new tokens to generate")
    args = parser.parse_args()
    
    # Initialize and load model
    model = DeepSeekModel(
        use_4bit=args.use_4bit,
        use_8bit=args.use_8bit,
        cpu_only=args.cpu
    ).load_model()
    
    # Create messages
    messages = [
        {"role": "user", "content": args.message},
    ]
    
    # Generate and print response
    print(f"\nUser: {args.message}")
    response = model.generate_response(
        messages=messages,
        max_new_tokens=args.max_tokens
    )
    print(f"DeepSeek-R1: {response}")
    
    # Unload model to free memory
    model.unload_model()


if __name__ == "__main__":
    main()