#!/usr/bin/env python
# DeepSeek Server Script
# This script is called by the Node.js server to generate responses using DeepSeek-R1

import argparse
import json
import sys
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(__file__), 'deepseek_server.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Global variables for model and tokenizer
tokenizer = None
model = None

def load_model():
    """Load the DeepSeek-R1 model and tokenizer"""
    global tokenizer, model
    
    try:
        logger.info("Loading DeepSeek-R1 model and tokenizer...")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)
        
        # Determine device
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        # Model loading parameters
        model_kwargs = {
            "trust_remote_code": True,
            "device_map": "auto"
        }
        
        # Use half precision for CUDA
        if device == "cuda":
            model_kwargs["torch_dtype"] = torch.float16
        
        # Load model
        model = AutoModelForCausalLM.from_pretrained(
            "deepseek-ai/DeepSeek-R1",
            **model_kwargs
        )
        
        logger.info("Model loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def generate_response(message, language="english"):
    """Generate a response using the DeepSeek-R1 model"""
    global tokenizer, model
    
    try:
        # Load model if not already loaded
        if tokenizer is None or model is None:
            success = load_model()
            if not success:
                return get_error_message(language)
        
        # Prepare system prompt based on language
        system_prompt = get_system_prompt(language)
        
        # Create messages list
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ]
        
        logger.info(f"Generating response for message in {language}")
        
        # Apply chat template
        inputs = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(model.device)
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=500,  # Adjust based on your needs
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )
        
        # Decode response
        response = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        )
        
        logger.info("Response generated successfully")
        return response
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return get_error_message(language)

def get_system_prompt(language):
    """Get system prompt based on language"""
    prompts = {
        "english": "You are a helpful assistant for BazaarBandhu, a platform that connects local artisans with customers. Provide concise, accurate, and helpful responses.",
        "hindi": "आप बाज़ारबंधु के लिए एक सहायक हैं, जो स्थानीय कारीगरों को ग्राहकों से जोड़ने वाला एक प्लेटफॉर्म है। संक्षिप्त, सटीक और सहायक प्रतिक्रियाएँ प्रदान करें।",
        "marathi": "तुम्ही बाजारबंधु साठी एक मदतगार आहात, जो स्थानिक कारागिरांना ग्राहकांशी जोडणारे व्यासपीठ आहे. संक्षिप्त, अचूक आणि मदतगार प्रतिसाद द्या.",
        "gujarati": "તમે બજારબંધુ માટે એક મદદગાર સહાયક છો, જે સ્થાનિક કારીગરોને ગ્રાહકો સાથે જોડતું એક પ્લેટફોર્મ છે. સંક્ષિપ્ત, ચોક્કસ અને મદદરૂપ પ્રતિભાવો આપો."
    }
    return prompts.get(language.lower(), prompts["english"])

def get_error_message(language):
    """Get error message based on language"""
    messages = {
        "english": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        "hindi": "माफ़ कीजिए, मुझे अभी आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।",
        "marathi": "क्षमस्व, मला सध्या आपल्या विनंतीवर प्रक्रिया करण्यात अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
        "gujarati": "માફ કરશો, મને હાલમાં તમારી વિનંતી પર પ્રક્રિયા કરવામાં મુશ્કેલી પડી રહી છે. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો."
    }
    return messages.get(language.lower(), messages["english"])

def main():
    """Main function to parse arguments and generate response"""
    parser = argparse.ArgumentParser(description="DeepSeek-R1 Server Script")
    parser.add_argument("--message", type=str, required=True, help="User message")
    parser.add_argument("--language", type=str, default="english", 
                        help="Response language (english, hindi, marathi, gujarati)")
    args = parser.parse_args()
    
    # Generate response
    response = generate_response(args.message, args.language)
    
    # Output JSON response
    result = {"response": response}
    print(json.dumps(result))

if __name__ == "__main__":
    main()