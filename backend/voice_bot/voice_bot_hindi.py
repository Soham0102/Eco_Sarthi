import speech_recognition as sr
from gtts import gTTS
import pygame
import time
import os
import random

# Initialize pygame mixer once
pygame.mixer.init()


def speak_hindi(text):
    try:
        # Cache small segments to avoid repeated TTS generation
        segments = [seg.strip() for seg in text.split('।') if seg.strip()]
        for seg in segments:
            sentence = seg + '।'
            filename = f"cache_{hash(sentence)}.mp3"
            if not os.path.exists(filename):
                tts = gTTS(text=sentence, lang='hi')
                tts.save(filename)
            pygame.mixer.music.load(filename)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                time.sleep(0.01)
            time.sleep(0.1)
    except Exception as e:
        print(f"⚠️ Voice Error: {e}")


def listen_hindi(timeout=5, phrase_time_limit=7):
    r = sr.Recognizer()
    with sr.Microphone() as source:
        r.adjust_for_ambient_noise(source, duration=0.5)
        print("सुन रहा हूँ...")
        try:
            audio = r.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
        except sr.WaitTimeoutError:
            speak_hindi("आपने कुछ नहीं कहा, कृपया फिर से प्रयास करें।")
            return None

    try:
        text = r.recognize_google(audio, language="hi-IN")
        print(f"आपने कहा: {text}")
        return text
    except (sr.UnknownValueError, sr.RequestError) as e:
        speak_hindi("खेद है, समस्या हुई। कृपया पुनः प्रयास करें।")
        return None


# # voice_bot_hindi.py
# import speech_recognition as sr
# import pyttsx3
# import time
# import threading
# from threading import Lock

# # Global TTS engine with thread safety
# tts_engine = None
# tts_lock = Lock()

# def initialize_tts():
#     """Initialize TTS engine with Hindi support"""
#     global tts_engine
#     try:
#         if tts_engine is None:
#             tts_engine = pyttsx3.init()
            
#             # Set properties for better Hindi pronunciation
#             voices = tts_engine.getProperty('voices')
            
#             # Try to find Hindi voice
#             hindi_voice = None
#             for voice in voices:
#                 if 'hindi' in voice.name.lower() or 'hi-in' in voice.id.lower():
#                     hindi_voice = voice.id
#                     break
            
#             if hindi_voice:
#                 tts_engine.setProperty('voice', hindi_voice)
            
#             # Set speech rate and volume
#             tts_engine.setProperty('rate', 150)  # Slower for clarity
#             tts_engine.setProperty('volume', 0.9)
            
#     except Exception as e:
#         print(f"TTS initialization error: {e}")

# def speak_hindi(text):
#     """Speak text in Hindi with error handling"""
#     global tts_engine, tts_lock
    
#     try:
#         with tts_lock:
#             if tts_engine is None:
#                 initialize_tts()
            
#             if tts_engine:
#                 print(f"🔊 बोल रहे हैं: {text}")
#                 tts_engine.say(text)
#                 tts_engine.runAndWait()
#             else:
#                 print(f"🔇 TTS unavailable: {text}")
                
#     except Exception as e:
#         print(f"TTS Error: {e}")
#         print(f"📝 Text was: {text}")

# def listen_hindi(timeout=10, phrase_timeout=3):
#     """Listen for Hindi speech with improved error handling"""
#     recognizer = sr.Recognizer()
    
#     # Adjust for ambient noise
#     try:
#         with sr.Microphone() as source:
#             print("🎤 माइक्रोफोन तैयार कर रहे हैं...")
#             recognizer.adjust_for_ambient_noise(source, duration=1)
            
#             # Optimize for Hindi recognition
#             recognizer.energy_threshold = 300
#             recognizer.dynamic_energy_threshold = True
#             recognizer.pause_threshold = phrase_timeout
            
#             print("🎙️ बोलें... (सुन रहे हैं)")
            
#             # Listen with timeout
#             audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=15)
            
#             print("🔄 आपकी आवाज़ को समझ रहे हैं...")
            
#             try:
#                 # Try Google Speech Recognition with Hindi
#                 text = recognizer.recognize_google(audio, language='hi-IN')
#                 print(f"✅ सुना गया: {text}")
#                 return text.strip()
                
#             except sr.UnknownValueError:
#                 print("❌ आवाज़ साफ नहीं सुनाई दी")
#                 return None
                
#             except sr.RequestError as e:
#                 print(f"❌ Google Speech API Error: {e}")
                
#                 # Fallback to offline recognition if available
#                 try:
#                     text = recognizer.recognize_sphinx(audio, language='hi-IN')
#                     print(f"✅ ऑफलाइन पहचान: {text}")
#                     return text.strip()
#                 except:
#                     print("❌ ऑफलाइन पहचान भी काम नहीं कर रही")
#                     return None
                    
#     except sr.WaitTimeoutError:
#         print("⏱️ समय समाप्त - कोई आवाज़ नहीं सुनी")
#         return None
        
#     except Exception as e:
#         print(f"❌ माइक्रोफोन त्रुटि: {e}")
#         return None

# def test_voice_system():
#     """Test both speech recognition and TTS"""
#     print("🧪 आवाज़ सिस्टम की जांच...")
    
#     # Test TTS
#     speak_hindi("नमस्ते, मैं आपकी आवाज़ सुन सकता हूं?")
    
#     # Test STT
#     user_input = listen_hindi(timeout=5)
    
#     if user_input:
#         speak_hindi(f"आपने कहा: {user_input}")
#         return True
#     else:
#         speak_hindi("आवाज़ सुनाई नहीं दी")
#         return False

# def speak_with_callback(text, callback=None):
#     """Speak with optional callback when done"""
#     def speak_thread():
#         speak_hindi(text)
#         if callback:
#             callback()
    
#     thread = threading.Thread(target=speak_thread)
#     thread.daemon = True
#     thread.start()
#     return thread

# # Initialize on import
# initialize_tts()

# if __name__ == "__main__":
#     # Test the voice system
#     print("Testing Voice System...")
#     success = test_voice_system()
#     print(f"Voice system test: {'✅ Passed' if success else '❌ Failed'}")