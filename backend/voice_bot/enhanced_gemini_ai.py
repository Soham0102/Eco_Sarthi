
# enhanced_gemini_ai.py
import google.generativeai as genai
import json
import re

# Use your API key directly
API_KEY = "AIzaSyDQ8agyfEwaijZ0VpByd1I71cnzIuKuXvc"
genai.configure(api_key=API_KEY)

# Gemini model
model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

def ask_gemini_followup_or_result(conversation_log):
    """
    Enhanced conversation flow with better question progression
    """
    prompt = f"""
    आप एक बुद्धिमान नागरिक सहायता बॉट हैं जो नागरिक शिकायतों को व्यवस्थित तरीके से दर्ज करते हैं। आपका व्यवहार सहानुभूतिपूर्ण और सहायक होना चाहिए।

    अभी तक की बातचीत:
    {conversation_log}

    निर्देश:
    1. यदि बातचीत खाली है या अभी शुरुआत है, तो व्यक्ति से उनकी मुख्य शिकायत पूछें।
    2. यदि व्यक्ति ने शिकायत बताई है, तो अगली जरूरी जानकारी पूछें:
       - व्यक्ति का नाम
       - घटना का स्थान (शहर/जिला/राज्य)
       - संबंधित विभाग (पुलिस, सफाई, बिजली, पानी, रोड, स्वास्थ्य, शिक्षा, आदि)
       - मोबाइल नंबर (वैकल्पिक)
    
    3. एक समय में केवल एक सवाल पूछें।
    4. यदि सभी जरूरी जानकारी मिल गई है, तो JSON format में परिणाम दें।
    5. व्यक्ति को आराम से जवाब देने के लिए प्रेरित करें।
    6. यदि व्यक्ति का जवाब स्पष्ट नहीं है, तो विनम्रता से दोबारा पूछें।

    महत्वपूर्ण: JSON केवल तभी दें जब सभी जरूरी जानकारी (नाम, शिकायत, स्थान) मिल गई हो।

    JSON Format (केवल पूरी जानकारी मिलने पर):
    {{
        "शिकायत": "मुख्य समस्या का विवरण",
        "स्थान": "शहर/जिला/राज्य",
        "शिकायतकर्ता का नाम": "व्यक्ति का नाम",
        "मोबाइल नंबर": "फोन नंबर (यदि दिया गया हो)",
        "विभाग": "संबंधित सरकारी विभाग", 
        "बोलने_लायक_सारांश": "आपकी शिकायत दर्ज हो गई है। [संक्षिप्त सारांश]",
        "अंतिम_घोषणा": "धन्यवाद! आपको जल्द ही शिकायत संख्या मिल जाएगी।"
    }}

    केवल अगला प्रश्न या JSON दें, कोई अतिरिक्त टेक्स्ट नहीं।
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        print(f"🤖 Gemini Response: {text}")
        return text
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return "मुझे खुशी होगी अगर आप अपनी शिकायत बताएं।"

def is_structured_json(text):
    """
    Enhanced JSON detection with better error handling
    """
    try:
        # Look for JSON pattern in the text
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            json_text = json_match.group()
            parsed = json.loads(json_text)
            
            # Validate that it contains required fields
            required_fields = ["शिकायत", "स्थान", "शिकायतकर्ता का नाम"]
            if all(field in parsed for field in required_fields):
                # Add default values for missing optional fields
                if "विभाग" not in parsed:
                    parsed["विभाग"] = "सामान्य"
                if "मोबाइल नंबर" not in parsed:
                    parsed["मोबाइल नंबर"] = ""
                if "बोलने_लायक_सारांश" not in parsed:
                    parsed["बोलने_लायक_सारांश"] = f"आपकी शिकायत '{parsed['शिकायत']}' दर्ज हो गई है।"
                if "अंतिम_घोषणा" not in parsed:
                    parsed["अंतिम_घोषणा"] = "धन्यवाद! आपको जल्द ही अपडेट मिलेगा।"
                
                return parsed
                
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
    except Exception as e:
        print(f"JSON Detection Error: {e}")
    
    return None

def determine_department(complaint_text, location_text=""):
    """
    Automatically determine the department based on complaint content
    """
    complaint_lower = complaint_text.lower()
    
    department_keywords = {
        "पुलिस": ["चोरी", "लूट", "मारपीट", "धोखाधड़ी", "अपराध", "गुंडागर्दी", "हत्या", "रैगिंग"],
        "सफाई विभाग": ["कचरा", "गंदगी", "सफाई", "नाली", "सड़क साफ", "कूड़ा"],
        "बिजली विभाग": ["बिजली", "लाइट", "करंट", "ट्रांसफार्मर", "बिजली कटना", "वोल्टेज"],
        "जल विभाग": ["पानी", "नल", "पाइप", "टंकी", "बोरवेल", "पानी न आना"],
        "सड़क विभाग": ["सड़क", "गड्ढा", "रोड", "पुल", "फुटपाथ", "ट्रैफिक"],
        "स्वास्थ्य विभाग": ["अस्पताल", "डॉक्टर", "दवा", "इलाज", "स्वास्थ्य", "बीमारी"],
        "शिक्षा विभाग": ["स्कूल", "शिक्षक", "पढ़ाई", "कॉलेज", "यूनिवर्सिटी", "परीक्षा"],
        "राशन विभाग": ["राशन", "अनाज", "चावल", "गेहूं", "चीनी", "केरोसिन"],
        "रेलवे": ["ट्रेन", "रेल", "स्टेशन", "प्लेटफॉर्म", "टिकट", "ट्रैक"],
        "बैंक": ["बैंक", "एटीम", "पैसा", "खाता", "लेनदेन", "ब्याज"]
    }
    
    for department, keywords in department_keywords.items():
        if any(keyword in complaint_lower for keyword in keywords):
            return department
    
    return "सामान्य"

def get_conversation_context(conversation_log):
    """
    Analyze conversation to understand what information is missing
    """
    context = {
        "has_complaint": False,
        "has_name": False,
        "has_location": False,
        "has_department": False,
        "has_mobile": False,
        "missing_info": []
    }
    
    if not conversation_log.strip():
        context["missing_info"] = ["complaint"]
        return context
    
    log_lower = conversation_log.lower()
    
    # Check for complaint description
    if any(word in log_lower for word in ["समस्या", "शिकायत", "परेशानी", "दिक्कत"]):
        context["has_complaint"] = True
    
    # Check for name
    if any(word in log_lower for word in ["नाम", "मैं", "मेरा"]):
        context["has_name"] = True
    
    # Check for location
    if any(word in log_lower for word in ["जगह", "स्थान", "शहर", "गांव", "जिला"]):
        context["has_location"] = True
    
    # Check for mobile
    if re.search(r'\d{10}', conversation_log):
        context["has_mobile"] = True
    
    # Determine what's missing
    if not context["has_complaint"]:
        context["missing_info"].append("complaint")
    if not context["has_name"]:
        context["missing_info"].append("name")
    if not context["has_location"]:
        context["missing_info"].append("location")
    
    return context