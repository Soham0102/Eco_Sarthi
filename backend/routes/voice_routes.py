# from flask import Blueprint, jsonify
# from voice_bot.jantavoice import start_conversation

# voice_routes = Blueprint('voice_routes', __name__)

# @voice_routes.route('/api/voice-complaint', methods=['GET'])
# def handle_voice_complaint():
#     try:
#         final_result = start_conversation()
#         return jsonify({"status": "success", "data": final_result})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})




from flask import Blueprint, jsonify, request
import logging
import traceback

# Import the improved voice bot
from voice_bot.jantavoice import start_conversation

voice_routes = Blueprint('voice_routes', __name__)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@voice_routes.route('/api/voice-complaint', methods=['GET', 'POST'])
def handle_voice_complaint():
    """
    Handle voice complaint requests
    Supports both GET and POST methods for flexibility
    """
    try:
        logger.info("Starting voice complaint process...")
        
        # Start the conversation
        final_result = start_conversation()
        
        if final_result:
            logger.info(f"Voice complaint completed successfully: {final_result.get('complaint_id', 'Unknown')}")
            return jsonify({
                "status": "success", 
                "message": "शिकायत सफलतापूर्वक दर्ज हो गई है",
                "data": final_result,
                "complaint_id": final_result.get('complaint_id', 'Unknown')
            }), 200
        else:
            logger.warning("Voice complaint process returned None")
            return jsonify({
                "status": "error", 
                "message": "शिकायत दर्ज करने में समस्या हुई"
            }), 400
            
    except Exception as e:
        logger.error(f"Voice complaint error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "status": "error", 
            "message": f"तकनीकी समस्या: {str(e)}"
        }), 500


@voice_routes.route('/api/voice-status', methods=['GET'])
def voice_status():
    """
    Check if voice bot is ready and working
    """
    try:
        return jsonify({
            "status": "ready",
            "message": "Voice bot is ready to accept complaints",
            "version": "2.0"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@voice_routes.route('/api/voice-test', methods=['GET'])
def voice_test():
    """
    Test endpoint for voice functionality
    """
    try:
        # Import voice functions for testing
        from voice_bot.voice_bot_hindi import speak_hindi
        
        test_message = "यह एक परीक्षण संदेश है"
        speak_hindi(test_message)
        
        return jsonify({
            "status": "success",
            "message": "Voice test completed",
            "test_message": test_message
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Voice test failed: {str(e)}"
        }), 500



        
# from flask import Blueprint, jsonify, Response, session
# import json
# import threading
# import time
# from queue import Queue
# import sys
# import os
# import datetime

# # Add parent path for imports
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# # Import with error handling
# try:
#     from voice_bot.enhanced_jantavoice import start_conversation_with_updates
#     from voice_bot.voice_bot_hindi import speak_hindi, listen_hindi
#     from voice_bot.enhanced_gemini_ai import ask_gemini_followup_or_result, is_structured_json, determine_department
#     from utils.generate_id import generate_complaint_id, generate_token
#     from config import complaints_collection
# except ImportError as e:
#     print(f"Import error in voice_routes: {e}")
#     # Create fallback functions
#     def speak_hindi(text): print(f"Speaking: {text}")
#     def listen_hindi(): return "मॉक इनपुट"
#     def ask_gemini_followup_or_result(log): return "कृपया बताएं"
#     def is_structured_json(text): return None
#     def determine_department(complaint, location): return "सामान्य"
#     def generate_complaint_id(): return f"VOICE{int(time.time())}"
#     def generate_token(): return f"TOK{int(time.time())}"
#     complaints_collection = None

# voice_routes = Blueprint("voice_routes", __name__)

# # Thread-safe session management
# import threading
# session_lock = threading.Lock()
# active_sessions = {}

# class VoiceSession:
#     def __init__(self, session_id):
#         self.session_id = session_id
#         self.is_active = False
#         self.conversation_log = ""
#         self.message_queue = Queue()
#         self.thread = None
#         self.lock = threading.Lock()
        
#     def send_update(self, message_type, message, **kwargs):
#         """Send real-time update to frontend"""
#         try:
#             data = {
#                 'type': message_type,
#                 'message': message,
#                 'timestamp': datetime.datetime.now().isoformat(),
#                 'session_id': self.session_id,
#                 **kwargs
#             }
#             self.message_queue.put(data)
#         except Exception as e:
#             print(f"Error sending update: {e}")
        
#     def process_conversation(self):
#         """Main conversation processing thread"""
#         try:
#             with self.lock:
#                 self.is_active = True
                
#             self.send_update('bot_question', 'नमस्ते! जनतावॉइस में आपका स्वागत है। कृपया अपनी शिकायत बताएं।', step='greeting')
            
#             # Start conversation using enhanced handler
#             try:
#                 handler = start_conversation_with_updates(self.send_update)
#             except Exception as e:
#                 print(f"Error starting conversation handler: {e}")
#                 self.send_update('error', f'वॉइस हैंडलर में समस्या: {str(e)}')
#                 return
            
#         except Exception as e:
#             print(f"Error in conversation: {e}")
#             self.send_update('error', f'शिकायत प्रक्रिया में समस्या: {str(e)}')
#         finally:
#             with self.lock:
#                 self.is_active = False
            
#     def submit_complaint(self, complaint_data):
#         """Submit complaint to database"""
#         try:
#             if not complaints_collection:
#                 print("Database not configured")
#                 return None
                
#             complaint_id = generate_complaint_id()
#             token = generate_token()
            
#             complaint = {
#                 "id": complaint_id,
#                 "token": token,
#                 "type": "voice",
#                 "name": complaint_data.get("शिकायतकर्ता का नाम", ""),
#                 "location": complaint_data.get("स्थान", ""),
#                 "department": complaint_data.get("विभाग", ""),
#                 "description": complaint_data.get("शिकायत", ""),
#                 "mobile": complaint_data.get("मोबाइल नंबर", ""),
#                 "timestamp": datetime.datetime.utcnow(),
#                 "status": "Pending",
#                 "urgency": "normal"
#             }
            
#             complaints_collection.insert_one(complaint)
#             print(f"[Voice Complaint] ID: {complaint_id}, Token: {token}")
#             return complaint_id
            
#         except Exception as e:
#             print(f"Error submitting complaint: {e}")
#             return None
            
#     def stop(self):
#         """Stop the session"""
#         with self.lock:
#             self.is_active = False
#         self.send_update('session_stopped', 'सेशन बंद किया गया')

# @voice_routes.route("/api/start-voice-session", methods=["POST"])
# def start_voice_session():
#     """Start a new voice complaint session"""
#     try:
#         session_id = f"voice_{int(time.time())}_{threading.get_ident()}"
        
#         with session_lock:
#             # Clean up old sessions
#             to_remove = []
#             for sid, vsession in active_sessions.items():
#                 if not vsession.is_active:
#                     to_remove.append(sid)
            
#             for sid in to_remove:
#                 del active_sessions[sid]
            
#             # Create new session
#             voice_session = VoiceSession(session_id)
#             active_sessions[session_id] = voice_session
        
#         # Start conversation thread
#         voice_session.thread = threading.Thread(target=voice_session.process_conversation)
#         voice_session.thread.daemon = True
#         voice_session.thread.start()
        
#         # Store session ID in Flask session
#         session['voice_session_id'] = session_id
        
#         return jsonify({
#             "success": True,
#             "session_id": session_id,
#             "message": "Voice session started"
#         }), 200
        
#     except Exception as e:
#         print(f"Error starting voice session: {e}")
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500

# @voice_routes.route("/api/stop-voice-session", methods=["POST"])
# def stop_voice_session():
#     """Stop current voice session"""
#     try:
#         session_id = session.get('voice_session_id')
        
#         if session_id:
#             with session_lock:
#                 if session_id in active_sessions:
#                     active_sessions[session_id].stop()
#                     del active_sessions[session_id]
            
#             # Clear from Flask session
#             session.pop('voice_session_id', None)
            
#         return jsonify({
#             "success": True,
#             "message": "Voice session stopped"
#         }), 200
        
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500

# @voice_routes.route("/api/voice-complaint-stream")
# def voice_complaint_stream():
#     """Server-Sent Events stream for real-time updates"""
#     def generate():
#         session_id = session.get('voice_session_id')
        
#         if not session_id:
#             yield f"data: {json.dumps({'type': 'error', 'message': 'No session ID'})}\n\n"
#             return
            
#         # Wait for session to be created
#         max_wait = 5  # seconds
#         waited = 0
#         voice_session = None
        
#         while waited < max_wait:
#             with session_lock:
#                 voice_session = active_sessions.get(session_id)
#             if voice_session:
#                 break
#             time.sleep(0.1)
#             waited += 0.1
            
#         if not voice_session:
#             yield f"data: {json.dumps({'type': 'error', 'message': 'Session not found'})}\n\n"
#             return
        
#         try:
#             # Send initial connection confirmation
#             yield f"data: {json.dumps({'type': 'connected', 'session_id': session_id})}\n\n"
            
#             last_heartbeat = time.time()
            
#             while voice_session.is_active:
#                 try:
#                     # Try to get message from queue (timeout after 1 second)
#                     message = voice_session.message_queue.get(timeout=1)
#                     yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"
#                     last_heartbeat = time.time()
#                 except:
#                     # Send heartbeat every 5 seconds to keep connection alive
#                     if time.time() - last_heartbeat > 5:
#                         yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': time.time()})}\n\n"
#                         last_heartbeat = time.time()
                        
#         except Exception as e:
#             yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
#         finally:
#             yield f"data: {json.dumps({'type': 'stream_ended'})}\n\n"
    
#     return Response(
#         generate(),
#         mimetype='text/event-stream',
#         headers={
#             'Cache-Control': 'no-cache',
#             'Connection': 'keep-alive',
#             'Access-Control-Allow-Origin': '*',
#             'Access-Control-Allow-Headers': 'Cache-Control'
#         }
#     )

# @voice_routes.route("/api/voice-session-status", methods=["GET"])
# def voice_session_status():
#     """Get current voice session status"""
#     try:
#         session_id = session.get('voice_session_id')
        
#         if not session_id:
#             return jsonify({
#                 "success": False,
#                 "message": "No active session"
#             }), 200
            
#         with session_lock:
#             voice_session = active_sessions.get(session_id)
            
#         if voice_session:
#             return jsonify({
#                 "success": True,
#                 "session_id": session_id,
#                 "is_active": voice_session.is_active,
#                 "message": "Session found"
#             }), 200
#         else:
#             return jsonify({
#                 "success": False,
#                 "message": "Session not found"
#             }), 200
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500

# # Legacy route for backward compatibility
# @voice_routes.route("/api/voice-complaint", methods=["GET"])
# def voice_complaint():
#     """Legacy endpoint - redirects to new system"""
#     return jsonify({
#         "status": "redirect",
#         "message": "Please use the new real-time voice system",
#         "endpoints": {
#             "start": "/api/start-voice-session",
#             "stream": "/api/voice-complaint-stream",
#             "stop": "/api/stop-voice-session",
#             "status": "/api/voice-session-status"
#         }
#     }), 200