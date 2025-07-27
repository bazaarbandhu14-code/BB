# DeepSeek-R1 Web Application
# A simple Flask web application that uses DeepSeek-R1 for text generation

from flask import Flask, request, jsonify, render_template_string
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import threading
import time
import argparse

app = Flask(__name__)

# Global variables to store model and tokenizer
tokenizer = None
model = None
model_loaded = False
model_loading = False

# HTML template for the web interface
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>DeepSeek-R1 Chat Interface</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .chat-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 15px;
            padding: 10px 15px;
            border-radius: 18px;
            max-width: 70%;
            word-wrap: break-word;
        }
        .user-message {
            background-color: #e3f2fd;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }
        .bot-message {
            background-color: #f1f1f1;
            margin-right: auto;
            border-bottom-left-radius: 5px;
        }
        .input-container {
            display: flex;
            margin-top: 20px;
        }
        #user-input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 20px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .status {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
        }
        .loading {
            display: none;
            text-align: center;
            margin-top: 10px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <h1>DeepSeek-R1 Chat Interface</h1>
    <div class="status" id="model-status">{{ status_message }}</div>
    
    <div class="chat-container" id="chat-container">
        <!-- Messages will be added here -->
    </div>
    
    <div class="input-container">
        <input type="text" id="user-input" placeholder="Type your message here..." {{ 'disabled' if not model_ready }}>
        <button id="send-button" {{ 'disabled' if not model_ready }}>Send</button>
    </div>
    
    <div class="loading" id="loading">
        <div class="spinner"></div> Generating response...
    </div>
    
    <script>
        const chatContainer = document.getElementById('chat-container');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const loadingIndicator = document.getElementById('loading');
        const modelStatus = document.getElementById('model-status');
        
        // Check model status periodically
        function checkModelStatus() {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    modelStatus.textContent = data.message;
                    if (data.ready) {
                        userInput.disabled = false;
                        sendButton.disabled = false;
                    } else {
                        setTimeout(checkModelStatus, 2000);
                    }
                })
                .catch(error => {
                    console.error('Error checking status:', error);
                    setTimeout(checkModelStatus, 5000);
                });
        }
        
        // If model is not ready, start checking status
        if (modelStatus.textContent.includes('Loading')) {
            checkModelStatus();
        }
        
        // Add a message to the chat
        function addMessage(text, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            messageDiv.textContent = text;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Send message function
        function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;
            
            // Add user message to chat
            addMessage(message, true);
            userInput.value = '';
            
            // Disable input and show loading
            userInput.disabled = true;
            sendButton.disabled = true;
            loadingIndicator.style.display = 'block';
            
            // Send request to server
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            })
            .then(response => response.json())
            .then(data => {
                // Add bot response to chat
                addMessage(data.response, false);
                
                // Re-enable input and hide loading
                userInput.disabled = false;
                sendButton.disabled = false;
                loadingIndicator.style.display = 'none';
                userInput.focus();
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Error: Could not get response from the server.', false);
                userInput.disabled = false;
                sendButton.disabled = false;
                loadingIndicator.style.display = 'none';
            });
        }
        
        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
'''


def load_model_in_background():
    """Load the model in a background thread"""
    global tokenizer, model, model_loaded, model_loading
    
    model_loading = True
    try:
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)
        
        # Determine if CUDA is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading model on {device}...")
        
        # Load model with appropriate settings
        model_kwargs = {
            "trust_remote_code": True,
            "device_map": "auto"
        }
        
        # Use half precision for CUDA
        if device == "cuda":
            model_kwargs["torch_dtype"] = torch.float16
        
        # Load the model
        model = AutoModelForCausalLM.from_pretrained(
            "deepseek-ai/DeepSeek-R1",
            **model_kwargs
        )
        
        model_loaded = True
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
    finally:
        model_loading = False


@app.route('/')
def home():
    """Render the home page"""
    status_message = "Model is ready!" if model_loaded else "Loading model... This may take a few minutes."
    return render_template_string(HTML_TEMPLATE, status_message=status_message, model_ready=model_loaded)


@app.route('/api/status')
def status():
    """Return the current status of the model"""
    if model_loaded:
        return jsonify({"ready": True, "message": "Model is ready!"})
    elif model_loading:
        return jsonify({"ready": False, "message": "Loading model... This may take a few minutes."})
    else:
        return jsonify({"ready": False, "message": "Model failed to load. Please check server logs."})


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    if not model_loaded:
        return jsonify({"response": "Model is still loading. Please wait."})
    
    # Get message from request
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"response": "Please provide a message."})
    
    try:
        # Create messages list
        messages = [
            {"role": "user", "content": user_message},
        ]
        
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
                max_new_tokens=100,
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )
        
        # Decode response
        response = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        )
        
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error generating response: {e}")
        return jsonify({"response": f"Error generating response: {str(e)}"})


def main():
    parser = argparse.ArgumentParser(description="DeepSeek-R1 Web App")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the server on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host to run the server on")
    parser.add_argument("--debug", action="store_true", help="Run in debug mode")
    parser.add_argument("--load-model-on-startup", action="store_true", 
                        help="Load model on startup instead of on first request")
    args = parser.parse_args()
    
    # Start model loading in background if requested
    if args.load_model_on_startup:
        threading.Thread(target=load_model_in_background).start()
    
    # Run the Flask app
    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == "__main__":
    main()