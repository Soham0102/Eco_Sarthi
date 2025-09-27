from flask import Blueprint, request, jsonify
import sqlite3
import hashlib
import uuid
from datetime import datetime
import os

citizen_routes = Blueprint('citizen_routes', __name__)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('ecosarthi.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_citizen_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Citizens table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS citizens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citizen_id TEXT UNIQUE NOT NULL,
            home_number TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            area TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            green_points INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Citizen activities table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS citizen_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citizen_id TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            description TEXT,
            points_earned INTEGER DEFAULT 0,
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (citizen_id) REFERENCES citizens (citizen_id)
        )
    ''')
    
    # Pickup requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pickup_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT UNIQUE NOT NULL,
            citizen_id TEXT NOT NULL,
            home_number TEXT NOT NULL,
            request_type TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            scheduled_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (citizen_id) REFERENCES citizens (citizen_id)
        )
    ''')

    # Daily pickup schedules table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_pickup_schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citizen_id TEXT NOT NULL,
            home_number TEXT NOT NULL,
            pickup_time TEXT NOT NULL, -- e.g., '07:00'
            days_mask TEXT NOT NULL DEFAULT '1111111', -- 7 chars, Monday-Sunday flag
            active INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (citizen_id) REFERENCES citizens (citizen_id)
        )
    ''')
    
    # Complaints table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id TEXT UNIQUE NOT NULL,
            citizen_id TEXT NOT NULL,
            home_number TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            FOREIGN KEY (citizen_id) REFERENCES citizens (citizen_id)
        )
    ''')
    
    # AI queries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ai_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citizen_id TEXT NOT NULL,
            query TEXT NOT NULL,
            response TEXT NOT NULL,
            points_earned INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (citizen_id) REFERENCES citizens (citizen_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize tables on import
init_citizen_tables()

@citizen_routes.route('/api/citizen/register', methods=['POST'])
def register_citizen():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'email', 'phone', 'address', 'area', 'homeNumber', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        # Check if home number already exists
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM citizens WHERE home_number = ?', (data['homeNumber'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Home number already registered'}), 400
        
        # Check if email already exists
        cursor.execute('SELECT id FROM citizens WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
        # Generate citizen ID and hash password
        citizen_id = f"CITIZEN_{uuid.uuid4().hex[:8].upper()}"
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        
        # Insert new citizen
        cursor.execute('''
            INSERT INTO citizens (citizen_id, home_number, full_name, email, phone, address, area, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            citizen_id, data['homeNumber'], data['fullName'], data['email'],
            data['phone'], data['address'], data['area'], password_hash
        ))
        
        # Create default daily pickup schedule at 07:00 everyday
        cursor.execute('''
            INSERT INTO daily_pickup_schedules (citizen_id, home_number, pickup_time, days_mask, active)
            VALUES (?, ?, '07:00', '1111111', 1)
        ''', (citizen_id, data['homeNumber']))

        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'citizenId': citizen_id
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@citizen_routes.route('/api/citizen/schedule/<citizen_id>', methods=['GET'])
def get_citizen_schedule(citizen_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT pickup_time, days_mask, active FROM daily_pickup_schedules
            WHERE citizen_id = ? AND active = 1
            ORDER BY created_at DESC LIMIT 1
        ''', (citizen_id,))

        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({'success': True, 'schedule': None}), 200

        pickup_time = row['pickup_time']  # 'HH:MM'
        days_mask = row['days_mask']      # '1111111' => Mon..Sun

        # Compute next occurrence in local time (assumes server local time)
        from datetime import datetime, timedelta
        now = datetime.now()
        hour, minute = [int(x) for x in pickup_time.split(':')]

        def is_day_active(dt):
            # Monday=0 ... Sunday=6
            idx = dt.weekday()
            return days_mask[idx] == '1'

        # Start from today, find next active day/time
        next_dt = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if next_dt <= now or not is_day_active(next_dt):
            for i in range(1, 8):
                cand = next_dt + timedelta(days=i)
                if is_day_active(cand):
                    next_dt = cand
                    break

        conn.close()
        return jsonify({
            'success': True,
            'schedule': {
                'pickupTime': pickup_time,
                'daysMask': days_mask,
                'active': True,
                'nextPickupAt': next_dt.isoformat()
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@citizen_routes.route('/api/citizen/login', methods=['POST'])
def login_citizen():
    try:
        data = request.get_json()
        home_number = data.get('homeNumber')
        password = data.get('password')
        
        if not home_number or not password:
            return jsonify({'success': False, 'message': 'Home number and password are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute('''
            SELECT citizen_id, full_name, green_points, area FROM citizens 
            WHERE home_number = ? AND password_hash = ?
        ''', (home_number, password_hash))
        
        citizen = cursor.fetchone()
        
        if citizen:
            # Update last login
            cursor.execute('''
                UPDATE citizens SET last_login = CURRENT_TIMESTAMP 
                WHERE citizen_id = ?
            ''', (citizen['citizen_id'],))
            conn.commit()
            
            conn.close()
            
            return jsonify({
                'success': True,
                'citizenId': citizen['citizen_id'],
                'citizenName': citizen['full_name'],
                'greenPoints': citizen['green_points'],
                'area': citizen['area']
            }), 200
        else:
            conn.close()
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@citizen_routes.route('/api/citizen/request-pickup', methods=['POST'])
def request_pickup():
    try:
        data = request.get_json()
        citizen_id = data.get('citizenId')
        home_number = data.get('homeNumber')
        request_type = data.get('type', 'general')
        description = data.get('description', '')
        
        if not citizen_id or not home_number:
            return jsonify({'success': False, 'message': 'Citizen ID and home number are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Generate request ID
        request_id = f"REQ_{uuid.uuid4().hex[:8].upper()}"
        
        # Insert pickup request
        cursor.execute('''
            INSERT INTO pickup_requests (request_id, citizen_id, home_number, request_type, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (request_id, citizen_id, home_number, request_type, description))
        
        # Add activity
        points_earned = 20 if request_type == 'emergency' else 15
        cursor.execute('''
            INSERT INTO citizen_activities (citizen_id, activity_type, description, points_earned)
            VALUES (?, ?, ?, ?)
        ''', (citizen_id, 'Pickup Request', f'{request_type.title()} pickup requested', points_earned))
        
        # Update green points
        cursor.execute('''
            UPDATE citizens SET green_points = green_points + ? WHERE citizen_id = ?
        ''', (points_earned, citizen_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Pickup request submitted successfully',
            'requestId': request_id,
            'pointsEarned': points_earned
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@citizen_routes.route('/api/citizen/ai-segregation', methods=['POST'])
def ai_segregation():
    try:
        data = request.get_json()
        citizen_id = data.get('citizenId')
        query = data.get('query')
        
        if not citizen_id or not query:
            return jsonify({'success': False, 'message': 'Citizen ID and query are required'}), 400
        
        # Simple AI responses for waste segregation
        ai_responses = {
            'plastic': 'Plastic items should be cleaned and placed in the blue recycling bin. Remove labels and caps.',
            'paper': 'Paper and cardboard go in the green bin. Make sure they are dry and clean.',
            'organic': 'Food scraps, vegetable peels, and garden waste go in the brown compost bin.',
            'glass': 'Glass bottles and jars go in the yellow bin. Remove caps and rinse clean.',
            'metal': 'Metal cans and aluminum foil go in the blue recycling bin after cleaning.',
            'electronic': 'Electronic waste should be taken to designated e-waste collection centers.',
            'hazardous': 'Batteries, chemicals, and medicines require special disposal - contact local authorities.'
        }
        
        # Simple keyword matching
        query_lower = query.lower()
        response = "Here's how to properly segregate your waste: "
        
        for keyword, advice in ai_responses.items():
            if keyword in query_lower:
                response = advice
                break
        else:
            response = "For proper waste segregation: 1) Separate wet and dry waste 2) Clean recyclables 3) Use designated bins 4) Compost organic waste when possible."
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Store AI query
        cursor.execute('''
            INSERT INTO ai_queries (citizen_id, query, response, points_earned)
            VALUES (?, ?, ?, ?)
        ''', (citizen_id, query, response, 5))
        
        # Add activity
        cursor.execute('''
            INSERT INTO citizen_activities (citizen_id, activity_type, description, points_earned)
            VALUES (?, ?, ?, ?)
        ''', (citizen_id, 'AI Segregation Help', 'Used AI assistant for waste segregation', 5))
        
        # Update green points
        cursor.execute('''
            UPDATE citizens SET green_points = green_points + ? WHERE citizen_id = ?
        ''', (5, citizen_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'response': response,
            'pointsEarned': 5
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@citizen_routes.route('/api/citizen/activities/<citizen_id>', methods=['GET'])
def get_citizen_activities(citizen_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT activity_type, description, points_earned, status, created_at
            FROM citizen_activities 
            WHERE citizen_id = ? 
            ORDER BY created_at DESC 
            LIMIT 20
        ''', (citizen_id,))
        
        activities = []
        for row in cursor.fetchall():
            activities.append({
                'activityType': row['activity_type'],
                'description': row['description'],
                'pointsEarned': row['points_earned'],
                'status': row['status'],
                'createdAt': row['created_at']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'activities': activities
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@citizen_routes.route('/api/citizen/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        area = request.args.get('area', 'all')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if area == 'all':
            cursor.execute('''
                SELECT full_name, home_number, green_points, area
                FROM citizens 
                ORDER BY green_points DESC 
                LIMIT 10
            ''')
        else:
            cursor.execute('''
                SELECT full_name, home_number, green_points, area
                FROM citizens 
                WHERE area = ?
                ORDER BY green_points DESC 
                LIMIT 10
            ''', (area,))
        
        leaderboard = []
        rank = 1
        for row in cursor.fetchall():
            leaderboard.append({
                'rank': rank,
                'name': row['full_name'],
                'homeNumber': row['home_number'],
                'points': row['green_points'],
                'area': row['area']
            })
            rank += 1
        
        conn.close()
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
