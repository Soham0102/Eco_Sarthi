#!/usr/bin/env python3
"""
Test script for Women & Child complaint system
"""

import requests
import json

def test_women_child_complaint():
    """Test the women and child complaint endpoint with a long message"""
    
    print("🧪 Testing Women & Child Complaint System...")
    
    # Test with a long complaint message
    long_message = "Hello abcd, this is a test complaint message to verify that the full text is being saved and displayed properly in the admin dashboard. This message should be long enough to test if there are any truncation issues."
    
    print(f"\n📝 Testing with message: '{long_message}'")
    
    # Test 1: Submit complaint
    print("\n1️⃣ Submitting complaint...")
    try:
        # Create form data
        form_data = {
            "text": long_message,
            "category": "women-child",
            "name": "Test User",
            "location": "Test Location",
            "department": "Women-Child",
            "urgency": "normal"
        }
        
        print(f"📤 Sending data: {json.dumps(form_data, indent=2)}")
        
        response = requests.post(
            "http://localhost:5000/api/complaint/women-child",
            data=form_data
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Complaint submitted successfully!")
            print(f"Complaint ID: {data.get('complaintId')}")
            print(f"Token: {data.get('token')}")
            
            # Test 2: Fetch complaints from admin endpoint
            print("\n2️⃣ Fetching complaints from admin endpoint...")
            
            admin_response = requests.get("http://localhost:5000/api/admin/complaints")
            print(f"Admin Status Code: {admin_response.status_code}")
            
            if admin_response.status_code == 200:
                admin_data = admin_response.json()
                if admin_data.get("success"):
                    complaints = admin_data.get("complaints", [])
                    print(f"✅ Found {len(complaints)} complaints")
                    
                    # Find our test complaint
                    test_complaint = None
                    for complaint in complaints:
                        if complaint.get("id") == data.get("complaintId"):
                            test_complaint = complaint
                            break
                    
                    if test_complaint:
                        print("\n📋 Test complaint details:")
                        print(f"  ID: {test_complaint.get('id')}")
                        print(f"  Name: {test_complaint.get('name')}")
                        print(f"  Description: '{test_complaint.get('description')}'")
                        print(f"  Category: {test_complaint.get('category')}")
                        print(f"  Department: {test_complaint.get('department')}")
                        print(f"  Status: {test_complaint.get('status')}")
                        
                        # Check if description matches
                        if test_complaint.get('description') == long_message:
                            print("✅ Description matches exactly!")
                        else:
                            print("❌ Description mismatch!")
                            print(f"  Expected: '{long_message}'")
                            print(f"  Got: '{test_complaint.get('description')}'")
                            
                            # Check length
                            expected_len = len(long_message)
                            actual_len = len(test_complaint.get('description', ''))
                            print(f"  Expected length: {expected_len}")
                            print(f"  Actual length: {actual_len}")
                            
                            if actual_len < expected_len:
                                print("⚠️  Message appears to be truncated!")
                    else:
                        print("❌ Test complaint not found in admin list")
                else:
                    print("❌ Admin endpoint returned error")
            else:
                print("❌ Admin endpoint failed!")
                
        else:
            print("❌ Complaint submission failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure backend is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_short_message():
    """Test with a short message to see if it's a length issue"""
    
    print("\n🧪 Testing with short message...")
    
    short_message = "Hello abcd"
    
    try:
        form_data = {
            "text": short_message,
            "category": "women-child",
            "name": "Test User 2",
            "location": "Test Location 2",
            "department": "Women-Child",
            "urgency": "normal"
        }
        
        response = requests.post(
            "http://localhost:5000/api/complaint/women-child",
            data=form_data
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Short message complaint submitted! ID: {data.get('complaintId')}")
        else:
            print(f"❌ Short message complaint failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error with short message: {e}")

if __name__ == "__main__":
    print("🚀 Starting Women & Child Complaint Tests...")
    print("=" * 60)
    
    test_women_child_complaint()
    test_short_message()
    
    print("\n" + "=" * 60)
    print("🏁 Tests completed!")
