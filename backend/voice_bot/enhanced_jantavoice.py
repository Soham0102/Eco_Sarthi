
# enhanced_jantavoice.py
import os
import sys
import json
import requests
import threading
import time

# Add parent path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Comment out problematic imports for now
# from voice_bot.voice_bot_hindi import speak_hindi, listen_hindi
# from voice_bot.enhanced_gemini_ai import ask_gemini_followup_or_result, is_structured_json, determine_department
# from utils.telegram_utils import send_telegram_message

class VoiceComplaintHandler:
    def __init__(self, update_callback=None):
        self.update_callback = update_callback
        self.conversation_log = ""
        self.is_active = True
        
    def send_update(self, message_type, message, **kwargs):
        """Send update to frontend if callback is provided"""
        if self.update_callback:
            self.update_callback(message_type, message, **kwargs)
    
    def send_to_backend(self, json_data):
        """Send complaint data to backend API"""
        url = "http://localhost:5000/api/complaint"
        try:
            # Map Hindi fields to English for backend - match exact field names expected by complaint endpoint
            mapped_data = {
                "name": json_data.get("शिकायतकर्ता का नाम", ""),
                "description": json_data.get("शिकायत", ""),
                "location": json_data.get("स्थान", ""),
                "urgency": "normal",  # Default urgency
                "department": json_data.get("विभाग", ""),
                "type": "voice"
            }
            
            # Ensure required fields are present
            if not mapped_data["name"]:
                mapped_data["name"] = "Anonymous"
            if not mapped_data["description"]:
                mapped_data["description"] = "Voice complaint recorded"
            if not mapped_data["location"]:
                mapped_data["location"] = "Unknown"
            if not mapped_data["department"]:
                mapped_data["department"] = "General"
            
            print(f"📤 Sending to backend: {mapped_data}")
            
            res = requests.post(url, json=mapped_data)
            response_data = res.json()
            
            if response_data.get("success"):
                print("✅ Backend response:", response_data)
                return response_data.get("complaintId")
            else:
                print("❌ Backend error:", response_data.get("message"))
                return None
                
        except Exception as e:
            print("❌ Backend connection error:", e)
            return None
    
    def validate_input(self, user_input, expected_type="general"):
        """Validate user input based on expected type"""
        if not user_input or len(user_input.strip()) < 2:
            return False, "कृपया अपना जवाब दोबारा दें।"
        
        if expected_type == "mobile":
            # Check if it contains numbers (basic validation)
            if not any(char.isdigit() for char in user_input):
                return False, "कृपया सही मोबाइल नंबर बताएं।"
        
        if expected_type == "name":
            if len(user_input.strip()) < 2:
                return False, "कृपया अपना पूरा नाम बताएं।"
        
        return True, ""
    
    def start_conversation(self):
        """Main conversation flow with better error handling"""
        try:
            print("🔁 शिकायत दर्ज करने की प्रक्रिया शुरू...\n")
            self.send_update('status', 'वॉइस बॉट शुरू हो रहा है...')
            
            # Initial greeting
            greeting = "नमस्ते! जनतावॉइस में आपका स्वागत है। कृपया अपनी समस्या या शिकायत बताएं।"
            self.send_update('bot_speaking', greeting)
            # speak_hindi(greeting) # Original line commented out
            
            retry_count = 0
            max_retries = 3
            
            while self.is_active and retry_count < max_retries:
                try:
                    # Get AI's next question or final result
                    # ai_response = ask_gemini_followup_or_result(self.conversation_log) # Original line commented out
                    ai_response = "आपकी शिकायत दर्ज करने के लिए अगला स्टेप क्या है?" # Mock response
                    print(f"🤖 Gemini Response: {ai_response}")
                    
                    # Check if it's final structured output
                    # final_json = is_structured_json(ai_response) # Original line commented out
                    final_json = None # Mock for now
                    if final_json:
                        self.send_update('processing', 'आपकी जानकारी तैयार की जा रही है...')
                        
                        # Enhance the data with auto-detected department if missing
                        if not final_json.get("विभाग") or final_json.get("विभाग") == "सामान्य":
                            # detected_dept = determine_department( # Original line commented out
                            #     final_json.get("शिकायत", ""), 
                            #     final_json.get("स्थान", "")
                            # )
                            final_json["विभाग"] = "पुलिस" # Mock department
                        
                        # Send the structured data to frontend
                        self.send_update('complaint_structured', 'शिकायत की जानकारी तैयार:', data=final_json)
                        
                        # Submit to backend
                        complaint_id = self.send_to_backend(final_json)
                        
                        if complaint_id:
                            # Success flow
                            summary = final_json.get("बोलने_लायक_सारांश", "आपकी शिकायत दर्ज हो गई है।")
                            final_msg = final_json.get("अंतिम_घोषणा", "धन्यवाद!")
                            
                            self.send_update('summary', summary)
                            # speak_hindi(summary) # Original line commented out
                            
                            time.sleep(1)
                            
                            self.send_update('final_message', final_msg)
                            # speak_hindi(final_msg) # Original line commented out
                            
                            self.send_update('complaint_submitted', f'शिकायत नंबर: {complaint_id}', complaintId=complaint_id)
                            
                            # Send to Telegram
                            try:
                                # send_telegram_message(final_json, complaint_id) # Original line commented out
                                print(f"Mock Telegram notification for complaint ID: {complaint_id}")
                            except Exception as e:
                                print(f"Telegram notification failed: {e}")
                            
                            # Save to file for backup
                            self.save_complaint_backup(final_json, complaint_id)
                            
                        else:
                            self.send_update('error', 'शिकायत दर्ज करने में समस्या हुई। कृपया बाद में कोशिश करें।')
                            
                        break
                    
                    # Ask follow-up question
                    self.send_update('bot_question', ai_response)
                    # speak_hindi(ai_response) # Original line commented out
                    
                    # Listen for user response
                    self.send_update('listening_start', 'आपकी आवाज़ सुन रहे हैं...')
                    user_input = "मैं अपनी शिकायत बताता हूं।" # Mock user input
                    
                    if not user_input:
                        retry_count += 1
                        retry_msg = f"मुझे आपकी आवाज़ सुनाई नहीं दी। कृपया दोबारा बोलें। ({retry_count}/{max_retries})"
                        
                        self.send_update('retry', retry_msg)
                        # speak_hindi(retry_msg) # Original line commented out
                        continue
                    
                    # Validate input
                    is_valid, error_msg = self.validate_input(user_input)
                    if not is_valid:
                        self.send_update('validation_error', error_msg)
                        # speak_hindi(error_msg) # Original line commented out
                        continue
                    
                    # Process user input
                    self.send_update('user_response', user_input)
                    self.conversation_log += f"\nयूज़र: {user_input}"
                    self.send_update('processing', 'आपकी बात समझ रहे हैं...')
                    
                    # Reset retry count on successful interaction
                    retry_count = 0
                    
                    # Small delay to make conversation feel natural
                    time.sleep(0.5)
                    
                except Exception as e:
                    print(f"Conversation error: {e}")
                    self.send_update('error', 'तकनीकी समस्या हुई। कृपया दोबारा कोशिश करें।')
                    retry_count += 1
            
            if retry_count >= max_retries:
                self.send_update('error', 'बहुत सारी समस्याएं हो रही हैं। कृपया बाद में कोशिश करें।')
                # speak_hindi("खुशी से, बाद में कोशिश करें।") # Original line commented out
            
        except Exception as e:
            print(f"Critical error in conversation: {e}")
            self.send_update('error', f'शिकायत प्रक्रिया में गंभीर समस्या: {str(e)}')
        finally:
            self.is_active = False
            self.send_update('session_ended', 'शिकायत सत्र समाप्त')
    
    def save_complaint_backup(self, complaint_data, complaint_id):
        """Save complaint to local file as backup"""
        try:
            backup_data = {
                "complaint_id": complaint_id,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "data": complaint_data
            }
            
            with open("voice_complaints_backup.json", "a", encoding="utf-8") as f:
                f.write(json.dumps(backup_data, ensure_ascii=False) + "\n")
                
        except Exception as e:
            print(f"Backup save error: {e}")
    
    def stop(self):
        """Stop the conversation"""
        self.is_active = False
        self.send_update('session_stopped', 'शिकायत प्रक्रिया रोक दी गई')

# Wrapper function for backward compatibility
def start_conversation_with_updates(update_callback=None):
    """Start conversation with real-time updates"""
    handler = VoiceComplaintHandler(update_callback)
    handler.start_conversation()
    return handler

# Simple function that returns mock complaint data for testing
def start_conversation():
    """
    Simple function that returns mock complaint data for testing
    This simulates what the voice bot would collect
    """
    try:
        # Simulate voice conversation data collection
        mock_complaint_data = {
            "शिकायतकर्ता का नाम": "राहुल कुमार",
            "स्थान": "मुंबई, महाराष्ट्र",
            "विभाग": "पुलिस",
            "शिकायत": "मेरे घर के पास रात को शोर हो रहा है और पुलिस को बुलाने पर भी कोई कार्रवाई नहीं हो रही है।",
            "मोबाइल नंबर": "9876543210",
            "बोलने_लायक_सारांश": "आपकी शिकायत दर्ज हो गई है।",
            "अंतिम_घोषणा": "धन्यवाद!"
        }
        
        print("🎙️ Mock voice complaint data generated:", mock_complaint_data)
        return mock_complaint_data
        
    except Exception as e:
        print(f"❌ Error in mock voice complaint: {e}")
        return None

# Main execution
if __name__ == "__main__":
    # Run standalone
    handler = VoiceComplaintHandler()
    handler.start_conversation()