#!/usr/bin/env python3
"""
Test script for voice complaint system
"""

import requests
import json

def test_voice_complaint():
    """Test the voice complaint endpoint"""
    
    print("🧪 Testing Voice Complaint System...")
    
    # Test 1: Call voice complaint endpoint
    print("\n1️⃣ Testing /api/voice-complaint endpoint...")
    try:
        response = requests.post("http://localhost:5000/api/voice-complaint")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Voice complaint endpoint working!")
            print(f"Data received: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            # Test 2: Submit complaint data to complaint endpoint
            if data.get("status") == "success" and data.get("data"):
                print("\n2️⃣ Testing complaint submission...")
                
                complaint_data = data["data"]
                
                # Map Hindi fields to English
                mapped_data = {
                    "name": complaint_data.get("शिकायतकर्ता का नाम", "Anonymous"),
                    "description": complaint_data.get("शिकायत", "Voice complaint recorded"),
                    "location": complaint_data.get("स्थान", "Unknown"),
                    "urgency": "normal",
                    "department": complaint_data.get("विभाग", "General")
                }
                
                print(f"Submitting complaint: {json.dumps(mapped_data, indent=2)}")
                
                complaint_response = requests.post(
                    "http://localhost:5000/api/complaint",
                    json=mapped_data
                )
                
                print(f"Complaint submission status: {complaint_response.status_code}")
                print(f"Complaint response: {complaint_response.text}")
                
                if complaint_response.status_code == 201:
                    print("✅ Complaint submitted successfully!")
                    complaint_result = complaint_response.json()
                    print(f"Complaint ID: {complaint_result.get('complaintId')}")
                else:
                    print("❌ Complaint submission failed!")
                    
        else:
            print("❌ Voice complaint endpoint failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure backend is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_admin_complaints():
    """Test fetching complaints from admin endpoint"""
    
    print("\n3️⃣ Testing admin complaints endpoint...")
    try:
        response = requests.get("http://localhost:5000/api/admin/complaints")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                complaints = data.get("complaints", [])
                print(f"✅ Admin complaints endpoint working!")
                print(f"Found {len(complaints)} complaints")
                
                if complaints:
                    print("\nLatest complaints:")
                    for i, complaint in enumerate(complaints[:3]):  # Show first 3
                        print(f"  {i+1}. ID: {complaint.get('id')} - {complaint.get('name')} - {complaint.get('status')}")
                else:
                    print("  No complaints found in database")
            else:
                print("❌ Admin complaints endpoint returned error")
        else:
            print("❌ Admin complaints endpoint failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure backend is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Voice Complaint System Tests...")
    print("=" * 50)
    
    test_voice_complaint()
    test_admin_complaints()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")
