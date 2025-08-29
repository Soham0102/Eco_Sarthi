# import os
# import sys

# # Ensure parent directory is in path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from voice_bot.voice_bot_hindi import speak_hindi, listen_hindi
# from voice_bot.gemini_ai import ask_gemini_followup_or_result, is_structured_json
# import json
# import requests
# from utils.telegram_utils import send_telegram_message


# def send_to_backend(json_data):
#     url = "http://localhost:5000/api/complaint"   # ← singular
#     try:
#         res = requests.post(url, json=json_data)
#         print("✅ Backend response:", res.json())
#     except Exception as e:
#         print("❌ Failed to send to backend:", e)



# def start_conversation():
#     # Simplified flow with fixed follow-up questions for reliability
#     conversation = []
#     # First prompt
#     speak_hindi("नमस्ते! जनतावॉइस में आपका स्वागत है। कृपया अपनी समस्या बताएं।")
    
#     # 1. Collect issue description
#     while True:
#         issue = listen_hindi()
#         if issue:
#             conversation.append(f"यूज़र: {issue}")
#             break
#         speak_hindi("कृपया समस्या बताएं।")

#     # 2. Collect location
#     speak_hindi("कृपया उस स्थान का नाम बताएं जहाँ समस्या है।")
#     while True:
#         location = listen_hindi()
#         if location:
#             conversation.append(f"यूज़र: {location}")
#             break
#         speak_hindi("कृपया स्थान बताएं।")

#     # 3. Collect user name
#     speak_hindi("कृपया अपना नाम बताएं।")
#     while True:
#         name = listen_hindi()
#         if name:
#             conversation.append(f"यूज़र: {name}")
#             break
#         speak_hindi("कृपया नाम बताएं।")

#     # 4. Collect mobile number (spoken digits)
#     speak_hindi("कृपया अपना दस अंकों का मोबाइल नंबर बताएं।")
#     while True:
#         mobile = listen_hindi()
#         if mobile and len(mobile.replace(" ", "")) >= 10:
#             mobile = ''.join(filter(str.isdigit, mobile))
#             conversation.append(f"यूज़र: {mobile}")
#             break
#         speak_hindi("कृपया सही मोबाइल नंबर बताएं।")

#     # Build structured JSON
#     result = {
#         "शिकायत": issue,
#         "स्थान": location,
#         "शिकायतकर्ता का नाम": name,
#         "मोबाइल नंबर": mobile,
#         "बोलने_लायक_सारांश": f"शिकायत {location} से संबंधित है।",
#         "अंतिम_घोषणा": "शिकायत दर्ज हो चुकी है और संबंधित विभाग को भेज दी गई है। धन्यवाद!"
#     }

#     # Speak summary and announcement
#     speak_hindi(result["बोलने_लायक_सारांश"])
#     speak_hindi(result["अंतिम_घोषणा"])

#     # Print and save
#     print("अंतिम शिकायत:")
#     print(json.dumps(result, indent=2, ensure_ascii=False))
#     with open("complaints.json", "a", encoding="utf-8") as file:
#         file.write(json.dumps(result, ensure_ascii=False) + "\n")

#     # Send to backend and Telegram
#     send_to_backend(result)
#     send_telegram_message(result, result.get("complaint_id", "CMP-UNKNOWN"))

#     # Return for API
#     return {"output": "\n".join(conversation), **result}


# if __name__ == "__main__":
#     start_conversation()

# import os
# import sys
# import json
# import requests

# # Add parent path for imports
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from voice_bot.voice_bot_hindi import speak_hindi, listen_hindi
# from voice_bot.gemini_ai import ask_gemini_followup_or_result, is_structured_json
# from utils.telegram_utils import send_telegram_message


# def send_to_backend(json_data):
#     url = "http://localhost:5000/api/complaint"
#     try:
#         res = requests.post(url, json=json_data)
#         print("✅ Backend response:", res.json())
#     except Exception as e:
#         print("❌ Backend error:", e)


# def start_conversation():
#     conversation_log = ""
#     print("🔁 शिकायत दर्ज करने की प्रक्रिया शुरू...\n")

#     # First prompt
#     speak_hindi("नमस्ते! जनतावॉइस में आपका स्वागत है।")
    
#     while True:
#         # AI decides the next question or outputs final JSON
#         ai_response = ask_gemini_followup_or_result(conversation_log)
#         print("🤖 Gemini said:", ai_response)

#         # If it's final structured output
#         final_json = is_structured_json(ai_response)
#         if final_json:
#             break

#         # Otherwise ask follow-up question
#         speak_hindi(ai_response)
#         user_input = listen_hindi()
#         if not user_input:
#             speak_hindi("कृपया दोबारा बोलें।")
#             continue

#         conversation_log += f"\nयूज़र: {user_input}"

#     # ✅ Speak the summary and final thank-you
#     if final_json.get("बोलने_लायक_सारांश"):
#         speak_hindi(final_json["बोलने_लायक_सारांश"])
#     if final_json.get("अंतिम_घोषणा"):
#         speak_hindi(final_json["अंतिम_घोषणा"])

#     # Print and save
#     print("✅ अंतिम शिकायत:")
#     print(json.dumps(final_json, indent=2, ensure_ascii=False))
#     with open("complaints.json", "a", encoding="utf-8") as f:
#         f.write(json.dumps(final_json, ensure_ascii=False) + "\n")

#     # Send to backend and Telegram
#     send_to_backend(final_json)
#     send_telegram_message(final_json, final_json.get("complaint_id", "CMP-UNKNOWN"))

#     return final_json


# if __name__ == "__main__":
#     start_conversation()


import os
import sys
import json
import requests
import time

# Add parent path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from voice_bot.voice_bot_hindi import speak_hindi, listen_hindi
from voice_bot.gemini_ai import ask_gemini_followup_or_result, is_structured_json, generate_complaint_id
from utils.telegram_utils import send_telegram_message


def send_to_backend(json_data):
    """Send complaint data to backend API"""
    url = "http://localhost:5000/api/complaint"
    try:
        # Map fields for backend compatibility
        backend_data = {
            "name": json_data.get("शिकायतकर्ता का नाम", ""),
            "complaint": json_data.get("शिकायत", ""),
            "description": json_data.get("विवरण", json_data.get("शिकायत", "")),  # Use description or fallback to complaint
            "location": json_data.get("स्थान", ""),
            "phone": json_data.get("मोबाइल नंबर", ""),
            "department": json_data.get("विभाग", ""),
            "priority": json_data.get("priority", "medium"),
            "complaint_id": json_data.get("complaint_id", "")
        }
        
        res = requests.post(url, json=backend_data)
        print("✅ Backend response:", res.json())
        return True
    except Exception as e:
        print("❌ Backend error:", e)
        return False


def start_conversation():
    """Start the human-like conversation flow"""
    complaint_data = {
        "शिकायत": "",
        "विवरण": "",  # Added description field
        "स्थान": "",
        "शिकायतकर्ता का नाम": "",
        "मोबाइल नंबर": "",
        "विभाग": "",
        "priority": "medium"
    }
    
    conversation_step = 0
    max_retries = 2
    
    print("🔁 शिकायत दर्ज करने की प्रक्रिया शुरू...\n")
    
    # Human-like introduction
    greetings = [
    "नमस्कार! जनतावॉइस में आपका हार्दिक स्वागत है। ",
    "स्वागत है आपका! जनतावॉइस में। ",
    "नमस्कार! जनतावॉइस में आपका हार्दिक स्वागत है। आइए"
]
    
    import random
    speak_hindi(random.choice(greetings))
    time.sleep(1)
    
    # Conversation flow with predefined steps (including description)
    conversation_steps = [
    {
        "question": "कृपया अपनी मुख्य समस्या या शिकायत बताएं।",
        "field": "शिकायत",
        "followup": [
            "यह वाकई एक गंभीर विषय लग रहा है।",
            "मैं आपकी बात समझ रही हूँ।",
            "ठीक है, इसे मैं नोट कर रही हूँ।"
        ]
    },
    {
        "question": "कृपया इस समस्या के बारे में विस्तार से बताएं — जैसे कब से यह हो रही है और किस तरह की परेशानी हो रही है?",
        "field": "विवरण",
        "followup": [
            "जी हाँ, यह जानकारी बहुत आवश्यक है।",
            "आपकी बात समझ में आ गई।",
            "ध्यानपूर्वक नोट कर रही हूँ।"
        ]
    },
    {
        "question": "यह समस्या कहाँ हो रही है? कृपया पूरा स्थान या पता बताएं।",
        "field": "स्थान",
        "followup": [
            "समझ गई।",
            "ठीक है, स्थान नोट किया गया है।",
            "आपका धन्यवाद।"
        ]
    },
    {
        "question": "आपका नाम क्या है कृपया बताएं?",
        "field": "शिकायतकर्ता का नाम",
        "followup": [
            "बहुत अच्छा, धन्यवाद।",
            "ठीक है, नाम दर्ज कर लिया गया है।",
            "जी, नोट कर लिया है।"
        ]
    },
    {
        "question": "कृपया अपना मोबाइल नंबर बताएं ताकि हम आपसे संपर्क कर सकें।",
        "field": "मोबाइल नंबर",
        "followup": [
            "धन्यवाद, नंबर नोट कर लिया है।",
            "ठीक है, आपका नंबर सुरक्षित है।",
            "बहुत धन्यवाद।"
        ]
    }
]
    
    # Step-by-step conversation
    for step in conversation_steps:
        retry_count = 0
        
        while retry_count <= max_retries:
            # Ask question
            speak_hindi(step["question"])
            user_input = listen_hindi()
            
            if not user_input:
                retry_count += 1
                if retry_count <= max_retries:
                    speak_hindi("कृपया दोबारा स्पष्ट रूप से बोलें।")
                continue
                
            # Store the response
            complaint_data[step["field"]] = user_input
            
            # Human-like acknowledgment
            speak_hindi(random.choice(step["followup"]))
            time.sleep(0.5)
            break
        
        if retry_count > max_retries:
            speak_hindi("खेद है, तकनीकी समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।")
            return None
    
    # Determine department using simple logic (saves API calls)
    complaint_text = complaint_data["शिकायत"].lower()
    description_text = complaint_data["विवरण"].lower()
    combined_text = complaint_text + " " + description_text
    
    if any(word in combined_text for word in ["सड़क", "गड्ढा", "road", "street", "pothole"]):
        complaint_data["विभाग"] = "सड़क विभाग"
    elif any(word in combined_text for word in ["पानी", "नल", "water", "tap", "pipe"]):
        complaint_data["विभाग"] = "जल विभाग"
    elif any(word in combined_text for word in ["बिजली", "light", "electricity", "power"]):
        complaint_data["विभाग"] = "विद्युत विभाग"
    elif any(word in combined_text for word in ["कूड़ा", "गंदगी", "garbage", "waste", "cleaning"]):
        complaint_data["विभाग"] = "स्वच्छता विभाग"
    elif any(word in combined_text for word in ["अस्पताल", "doctor", "health", "medical"]):
        complaint_data["विभाग"] = "स्वास्थ्य विभाग"
    else:
        complaint_data["विभाग"] = "सामान्य प्रशासन"
    
    # Generate complaint ID
    complaint_data["complaint_id"] = generate_complaint_id()
    
    # Create summary with description
    summary = f"""आपकी शिकायत दर्ज हो गई है। """
    
    final_message = """आपकी शिकायत सफलतापूर्वक दर्ज हो गई है। 
    जल्द ही {complaint_data['विभाग']} से संपर्क किया जाएगा। 
    धन्यवाद!"""
    
    complaint_data["बोलने_लायक_सारांश"] = summary
    complaint_data["अंतिम_घोषणा"] = final_message
    
    # Speak summary and final message
    speak_hindi(summary)
    time.sleep(1)
    speak_hindi(final_message)
    
    # Print and save with description
    print("✅ अंतिम शिकायत:")
    print(json.dumps(complaint_data, indent=2, ensure_ascii=False))
    
    try:
        with open("complaints.json", "a", encoding="utf-8") as f:
            f.write(json.dumps(complaint_data, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"File save error: {e}")
    
    # Send to backend and Telegram
    send_to_backend(complaint_data)
    send_telegram_message(complaint_data, complaint_data.get("complaint_id", "CMP-UNKNOWN"))
    
    return complaint_data


if __name__ == "__main__":
    start_conversation()