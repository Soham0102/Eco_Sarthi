# import google.generativeai as genai
# import json
# import re
# from dotenv import load_dotenv
# import os

# load_dotenv()
# API_KEY = os.getenv("AIzaSyDUClq0SgIcsHqjtQzpHpr7FcPkyVQMWOM")
# genai.configure(api_key=API_KEY)
# model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

# PROMPT_TEMPLATE = """
# तुम एक स्मार्ट नागरिक शिकायत प्रणाली हो...  # shortened for brevity
# Conversation:
# {conversation_log}
# """


# def ask_gemini_followup_or_result(conversation_log):
#     prompt = PROMPT_TEMPLATE.format(conversation_log=conversation_log)
#     response = model.generate_content(prompt)
#     text = response.text.strip()
#     print("🔁 Gemini Response:", text)
#     return text


# def is_structured_json(text):
#     try:
#         match = re.search(r"\{[\s\S]*\}", text)
#         if match:
#             parsed = json.loads(match.group())
#             if "शिकायत" in parsed:
#                 return parsed
#     except json.JSONDecodeError:
#         return None
#     return None

# import google.generativeai as genai
# import json
# import re

# # ✅ Use your API key directly
# #AIzaSyDQ8agyfEwaijZ0VpByd1I71cnzIuKuXvc
# #AIzaSyDUClq0SgIcsHqjtQzpHpr7FcPkyVQMWOM
# API_KEY = "AIzaSyDQ8agyfEwaijZ0VpByd1I71cnzIuKuXvc"
# genai.configure(api_key=API_KEY)

# # Gemini model
# model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

# # ✅ Only ONE correct version of this function
# def ask_gemini_followup_or_result(conversation_log):
#     prompt = f"""
#     तुम एक नागरिक सहायता बोट हो जो यूज़र से क्रमशः एक-एक कर के जानकारी लेती हो।

#     अभी तक की बातचीत:
#     {conversation_log}

#     अब जो जानकारी नहीं ली गई है, केवल उसका अगला सवाल पूछो।
#     यदि सभी ज़रूरी जानकारी मिल चुकी है, तो कृपया एक JSON उत्तर दो जिसमें ये फ़ील्ड हों:
#     {{
#       "शिकायत": "...",
#       "स्थान": "...",
#       "शिकायतकर्ता का नाम": "...",
#       "मोबाइल नंबर": "...",
#       "बोलने_लायक_सारांश": "...",
#       "अंतिम_घोषणा": "...",
#       "विभाग": "..."
#     }}
#     """
#     response = model.generate_content(prompt)
#     text = response.text.strip()
#     print("🤖 Gemini Response:", text)  # Optional for debugging
#     return text

# # ✅ JSON detection logic
# def is_structured_json(text):
#     try:
#         match = re.search(r"\{[\s\S]*\}", text)
#         if match:
#             parsed = json.loads(match.group())
#             if "शिकायत" in parsed:
#                 return parsed
#     except json.JSONDecodeError:
#         return None
#     return None



import google.generativeai as genai
import json
import re
import time
from datetime import datetime

# ✅ Use your API key directly
API_KEY = "AIzaSyDQ8agyfEwaijZ0VpByd1I71cnzIuKuXvc"
genai.configure(api_key=API_KEY)

# Gemini model
model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

# Cache for reducing API calls
response_cache = {}


def generate_complaint_id():
    """Generate unique complaint ID"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"CMP-{timestamp}"


def get_department_from_complaint(complaint_text):
    """Simple rule-based department detection to save API calls"""
    complaint_lower = complaint_text.lower()
    
    # Road related
    if any(word in complaint_lower for word in ["सड़क", "गड्ढा", "road", "street", "pothole"]):
        return "सड़क विभाग"
    
    # Water related
    elif any(word in complaint_lower for word in ["पानी", "नल", "water", "tap", "pipe"]):
        return "जल विभाग"
    
    # Electricity related
    elif any(word in complaint_lower for word in ["बिजली", "light", "electricity", "power"]):
        return "विद्युत विभाग"
    
    # Sanitation related
    elif any(word in complaint_lower for word in ["कूड़ा", "गंदगी", "garbage", "waste", "cleaning"]):
        return "स्वच्छता विभाग"
    
    # Health related
    elif any(word in complaint_lower for word in ["अस्पताल", "doctor", "health", "medical"]):
        return "स्वास्थ्य विभाग"
    
    # Education related
    elif any(word in complaint_lower for word in ["स्कूल", "school", "education", "teacher"]):
        return "शिक्षा विभाग"
    
    # Default
    else:
        return "सामान्य प्रशासन"


def ask_gemini_followup_or_result(conversation_log):
    """
    Simplified version - only use AI for complex cases
    This saves API quota for your free account
    """
    
    # Check cache first
    cache_key = hash(conversation_log)
    if cache_key in response_cache:
        return response_cache[cache_key]
    
    # Simple prompt to save tokens
    prompt = f"""
    बातचीत: {conversation_log}
    
    अगला सवाल पूछो या JSON बनाओ:
    {{
      "शिकायत": "...",
      "स्थान": "...",
      "शिकायतकर्ता का नाम": "...",
      "मोबाइल नंबर": "...",
      "विभाग": "..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Cache the response
        response_cache[cache_key] = text
        
        print("🤖 Gemini Response:", text[:100] + "..." if len(text) > 100 else text)
        return text
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        # Fallback response
        return "कृपया अपनी समस्या के बारे में और बताएं।"


def ask_smart_followup(current_data, missing_fields):
    """
    Smart followup questions without using API
    This saves your quota significantly
    """
    
    if "शिकायत" in missing_fields:
        return "आपकी मुख्य समस्या क्या है? कृपया विस्तार से बताएं।"
    
    elif "स्थान" in missing_fields:
        return "यह समस्या कहाँ हो रही है? कृपया पूरा पता बताएं।"
    
    elif "शिकायतकर्ता का नाम" in missing_fields:
        return "आपका नाम क्या है?"
    
    elif "मोबाइल नंबर" in missing_fields:
        return "कृपया अपना मोबाइल नंबर बताएं ताकि हम आपसे संपर्क कर सकें।"
    
    else:
        # All info collected, create final JSON
        department = get_department_from_complaint(current_data.get("शिकायत", ""))
        
        final_data = {
            "शिकायत": current_data.get("शिकायत", ""),
            "स्थान": current_data.get("स्थान", ""),
            "शिकायतकर्ता का नाम": current_data.get("शिकायतकर्ता का नाम", ""),
            "मोबाइल नंबर": current_data.get("मोबाइल नंबर", ""),
            "विभाग": department,
            "complaint_id": generate_complaint_id(),
            "बोलने_लायक_सारांश": f"आपकी शिकायत {department} को भेजी जा रही है।",
            "अंतिम_घोषणा": "आपकी शिकायत सफलतापूर्वक दर्ज हो गई है। धन्यवाद!"
        }
        
        return json.dumps(final_data, ensure_ascii=False)


def is_structured_json(text):
    """Enhanced JSON detection logic"""
    try:
        # Look for JSON pattern
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            json_str = match.group()
            parsed = json.loads(json_str)
            
            # Check if it's a complaint JSON
            if "शिकायत" in parsed or "complaint" in str(parsed).lower():
                return parsed
                
        # Try to parse the entire text as JSON
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "शिकायत" in parsed:
            return parsed
            
    except (json.JSONDecodeError, AttributeError):
        pass
    
    return None


def validate_phone_number(phone):
    """Simple phone number validation"""
    import re
    # Remove spaces and common characters
    phone = re.sub(r'[^\d]', '', phone)
    
    # Check if it's a valid Indian mobile number
    if len(phone) == 10 and phone.startswith(('6', '7', '8', '9')):
        return True
    elif len(phone) == 13 and phone.startswith('91'):
        return True
    
    return False


def create_final_complaint(complaint_data):
    """Create final complaint JSON with all validations"""
    
    # Validate required fields
    required_fields = ["शिकायत", "स्थान", "शिकायतकर्ता का नाम", "मोबाइल नंबर"]
    
    for field in required_fields:
        if not complaint_data.get(field, "").strip():
            return None
    
    # Validate phone number
    if not validate_phone_number(complaint_data["मोबाइल नंबर"]):
        return None
    
    # Get department
    department = get_department_from_complaint(complaint_data["शिकायत"])
    
    # Create final structure
    final_complaint = {
        "complaint_id": generate_complaint_id(),
        "शिकायत": complaint_data["शिकायत"].strip(),
        "स्थान": complaint_data["स्थान"].strip(),
        "शिकायतकर्ता का नाम": complaint_data["शिकायतकर्ता का नाम"].strip(),
        "मोबाइल नंबर": complaint_data["मोबाइल नंबर"].strip(),
        "विभाग": department,
        "timestamp": datetime.now().isoformat(),
        "status": "दर्ज",
        "priority": "medium",
        "बोलने_लायक_सारांश": f"आपकी शिकायत संख्या {generate_complaint_id()[:8]} दर्ज हो गई है। यह {department} को भेजी जा रही है।",
        "अंतिम_घोषणा": "आपकी शिकायत सफलतापूर्वक दर्ज हो गई है। जल्द ही कार्रवाई की जाएगी। धन्यवाद!"
    }
    
    return final_complaint