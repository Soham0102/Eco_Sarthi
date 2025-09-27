from flask import Blueprint, request, jsonify
import sqlite3
import hashlib
import uuid
from datetime import datetime
import os

enhanced_worker_routes = Blueprint('enhanced_worker_routes', __name__)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('ecosarthi.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_worker_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Workers table with roles
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('garbage_collector', 'dustbin_monitor', 'complaint_manager')),
            area TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            golden_points INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Worker tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS worker_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT UNIQUE NOT NULL,
            worker_id TEXT NOT NULL,
            task_type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            home_number TEXT,
            location TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'assigned',
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            points_earned INTEGER DEFAULT 10,
            FOREIGN KEY (worker_id) REFERENCES workers (worker_id)
        )
    ''')
    
    # QR scans table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS qr_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id TEXT UNIQUE NOT NULL,
            worker_id TEXT NOT NULL,
            home_number TEXT NOT NULL,
            scan_type TEXT DEFAULT 'house_verification',
            points_earned INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers (worker_id)
        )
    ''')

    # Daily collections table to mark pickup done per home/date
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collection_date DATE NOT NULL,
            home_number TEXT NOT NULL,
            worker_id TEXT NOT NULL,
            verified_qr INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Worker activities table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS worker_activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            description TEXT,
            points_earned INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers (worker_id)
        )
    ''')

    # Proofs table for task completion
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS worker_task_proofs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            worker_id TEXT NOT NULL,
            notes TEXT,
            photo_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers (worker_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize tables on import
init_worker_tables()

# Ensure uploads folder exists
UPLOADS_DIR = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

@enhanced_worker_routes.route('/api/worker/register', methods=['POST'])
def register_worker():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'email', 'phone', 'role', 'area', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        # Validate role
        valid_roles = ['garbage_collector', 'dustbin_monitor', 'complaint_manager']
        if data['role'] not in valid_roles:
            return jsonify({'success': False, 'message': 'Invalid role'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if worker ID already exists
        cursor.execute('SELECT id FROM workers WHERE worker_id = ?', (data['workerId'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Worker ID already exists'}), 400
        
        # Check if email already exists
        cursor.execute('SELECT id FROM workers WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
        # Generate worker ID if not provided
        worker_id = data.get('workerId', f"{data['role'][:2].upper()}{uuid.uuid4().hex[:6].upper()}")
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        
        # Insert new worker
        cursor.execute('''
            INSERT INTO workers (worker_id, full_name, email, phone, role, area, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            worker_id, data['fullName'], data['email'], data['phone'],
            data['role'], data['area'], password_hash
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Worker registration successful',
            'workerId': worker_id
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/login', methods=['POST'])
def login_worker():
    try:
        data = request.get_json()
        worker_id = data.get('workerId')
        password = data.get('password')
        
        if not worker_id or not password:
            return jsonify({'success': False, 'message': 'Worker ID and password are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute('''
            SELECT worker_id, full_name, role, area, golden_points FROM workers 
            WHERE worker_id = ? AND password_hash = ? AND is_active = 1
        ''', (worker_id, password_hash))
        
        worker = cursor.fetchone()
        
        if worker:
            # Update last login
            cursor.execute('''
                UPDATE workers SET last_login = CURRENT_TIMESTAMP 
                WHERE worker_id = ?
            ''', (worker['worker_id'],))
            conn.commit()
            
            conn.close()
            
            return jsonify({
                'success': True,
                'workerId': worker['worker_id'],
                'workerName': worker['full_name'],
                'role': worker['role'],
                'area': worker['area'],
                'goldenPoints': worker['golden_points']
            }), 200
        else:
            conn.close()
            return jsonify({'success': False, 'message': 'Invalid credentials or inactive account'}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/assign-task', methods=['POST'])
def assign_task():
    try:
        data = request.get_json()
        worker_id = data.get('workerId')
        task_type = data.get('taskType')
        title = data.get('title')
        description = data.get('description', '')
        home_number = data.get('homeNumber')
        location = data.get('location')
        priority = data.get('priority', 'medium')
        
        if not worker_id or not task_type or not title:
            return jsonify({'success': False, 'message': 'Worker ID, task type, and title are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Generate task ID
        task_id = f"TASK_{uuid.uuid4().hex[:8].upper()}"
        
        # Insert task
        cursor.execute('''
            INSERT INTO worker_tasks (task_id, worker_id, task_type, title, description, home_number, location, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (task_id, worker_id, task_type, title, description, home_number, location, priority))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Task assigned successfully',
            'taskId': task_id
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/complete-task', methods=['POST'])
def complete_task():
    try:
        data = request.get_json()
        worker_id = data.get('workerId')
        task_id = data.get('taskId')
        
        if not worker_id or not task_id:
            return jsonify({'success': False, 'message': 'Worker ID and task ID are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get task details
        cursor.execute('''
            SELECT task_type, title, points_earned FROM worker_tasks 
            WHERE task_id = ? AND worker_id = ? AND status = 'assigned'
        ''', (task_id, worker_id))
        
        task = cursor.fetchone()
        if not task:
            conn.close()
            return jsonify({'success': False, 'message': 'Task not found or already completed'}), 404
        
        # Update task status
        cursor.execute('''
            UPDATE worker_tasks 
            SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
            WHERE task_id = ?
        ''', (task_id,))
        
        # Add activity
        cursor.execute('''
            INSERT INTO worker_activities (worker_id, activity_type, description, points_earned)
            VALUES (?, ?, ?, ?)
        ''', (worker_id, 'Task Completion', f'Completed: {task["title"]}', task['points_earned']))
        
        # Update golden points
        cursor.execute('''
            UPDATE workers SET golden_points = golden_points + ? WHERE worker_id = ?
        ''', (task['points_earned'], worker_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Task completed successfully',
            'pointsEarned': task['points_earned']
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@enhanced_worker_routes.route('/api/worker/complete-task-proof', methods=['POST'])
def complete_task_with_proof():
    """
    Completes a task with optional proof photo and notes. Accepts multipart/form-data.
    Fields: workerId, taskId, notes (optional), proof (file, optional)
    """
    try:
        worker_id = request.form.get('workerId')
        task_id = request.form.get('taskId')
        notes = request.form.get('notes')
        file = request.files.get('proof')

        if not worker_id or not task_id:
            return jsonify({'success': False, 'message': 'Worker ID and task ID are required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Validate the task exists and is assigned
        cursor.execute('''
            SELECT title, points_earned FROM worker_tasks 
            WHERE task_id = ? AND worker_id = ? AND status = 'assigned'
        ''', (task_id, worker_id))
        task = cursor.fetchone()
        if not task:
            conn.close()
            return jsonify({'success': False, 'message': 'Task not found or already completed'}), 404

        # Save proof file if provided
        photo_path = None
        if file:
            safe_name = f"PROOF_{task_id}_{uuid.uuid4().hex[:8]}.jpg"
            abs_path = os.path.join(UPLOADS_DIR, safe_name)
            file.save(abs_path)
            photo_path = f"/uploads/{safe_name}"

        # Enforce QR scan before completion if home_number exists
        cursor.execute('SELECT home_number FROM worker_tasks WHERE task_id = ?', (task_id,))
        row = cursor.fetchone()
        requires_qr = bool(row and row['home_number'])

        if requires_qr:
            # Check if a QR scan exists for this worker and home in last 24h
            cursor.execute('''
                SELECT 1 FROM qr_scans 
                WHERE worker_id = ? AND home_number = ? AND DATETIME(created_at) >= DATETIME('now', '-1 day')
                LIMIT 1
            ''', (worker_id, row['home_number']))
            qr_ok = cursor.fetchone() is not None
            if not qr_ok:
                conn.close()
                return jsonify({'success': False, 'message': 'QR scan required before completing this task'}), 400

        # Update task as completed
        cursor.execute('''
            UPDATE worker_tasks 
            SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
            WHERE task_id = ?
        ''', (task_id,))

        # Store proof record
        cursor.execute('''
            INSERT INTO worker_task_proofs (task_id, worker_id, notes, photo_path)
            VALUES (?, ?, ?, ?)
        ''', (task_id, worker_id, notes, photo_path))

        # Add activity
        cursor.execute('''
            INSERT INTO worker_activities (worker_id, activity_type, description, points_earned)
            VALUES (?, 'Task Completion', ?, ?)
        ''', (worker_id, f'Completed: {task["title"]}', task['points_earned']))

        # Update golden points
        cursor.execute('''
            UPDATE workers SET golden_points = golden_points + ? WHERE worker_id = ?
        ''', (task['points_earned'], worker_id))

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Task completed with proof',
            'pointsEarned': task['points_earned'],
            'photoPath': photo_path
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/scan-qr', methods=['POST'])
def scan_qr():
    try:
        data = request.get_json()
        worker_id = data.get('workerId')
        qr_data = data.get('qrData')
        role = data.get('role')
        
        if not worker_id or not qr_data:
            return jsonify({'success': False, 'message': 'Worker ID and QR data are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Generate scan ID
        scan_id = f"SCAN_{uuid.uuid4().hex[:8].upper()}"
        
        # Extract home number from QR data
        home_number = qr_data if qr_data.startswith('HOME') else f"HOME{qr_data}"
        
        # Insert QR scan
        cursor.execute('''
            INSERT INTO qr_scans (scan_id, worker_id, home_number, scan_type)
            VALUES (?, ?, ?, ?)
        ''', (scan_id, worker_id, home_number, 'house_verification'))
        
        # Add activity
        points_earned = 5
        cursor.execute('''
            INSERT INTO worker_activities (worker_id, activity_type, description, points_earned)
            VALUES (?, ?, ?, ?)
        ''', (worker_id, 'QR Scan', f'Scanned home: {home_number}', points_earned))
        
        # Update golden points for worker
        cursor.execute('''
            UPDATE workers SET golden_points = golden_points + ? WHERE worker_id = ?
        ''', (points_earned, worker_id))

        # Mark daily collection done for this home (today)
        cursor.execute('''
            INSERT INTO daily_collections (collection_date, home_number, worker_id, verified_qr)
            VALUES (DATE('now'), ?, ?, 1)
        ''', (home_number, worker_id))

        # Award citizen green points on verified pickup
        cursor.execute('''
            SELECT citizen_id FROM citizens WHERE home_number = ?
        ''', (home_number,))
        citizen_row = cursor.fetchone()
        if citizen_row:
            citizen_id = citizen_row['citizen_id']
            # Add citizen activity and points
            cursor.execute('''
                INSERT INTO citizen_activities (citizen_id, activity_type, description, points_earned)
                VALUES (?, 'Verified Pickup', ?, 10)
            ''', (citizen_id, f'Pickup verified by QR at {home_number}'))
            cursor.execute('''
                UPDATE citizens SET green_points = green_points + 10 WHERE citizen_id = ?
            ''', (citizen_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'QR scan recorded successfully',
            'homeNumber': home_number,
            'pointsEarned': points_earned
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/tasks/<worker_id>', methods=['GET'])
def get_worker_tasks(worker_id):
    try:
        status = request.args.get('status', 'assigned')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT task_id, task_type, title, description, home_number, location, priority, status, assigned_at
            FROM worker_tasks 
            WHERE worker_id = ? AND status = ?
            ORDER BY assigned_at ASC
        ''', (worker_id, status))
        
        tasks = []
        for row in cursor.fetchall():
            tasks.append({
                'taskId': row['task_id'],
                'taskType': row['task_type'],
                'title': row['title'],
                'description': row['description'],
                'homeNumber': row['home_number'],
                'location': row['location'],
                'priority': row['priority'],
                'status': row['status'],
                'assignedAt': row['assigned_at']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'tasks': tasks
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/activities/<worker_id>', methods=['GET'])
def get_worker_activities(worker_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT activity_type, description, points_earned, created_at
            FROM worker_activities 
            WHERE worker_id = ? 
            ORDER BY created_at DESC 
            LIMIT 20
        ''', (worker_id,))
        
        activities = []
        for row in cursor.fetchall():
            activities.append({
                'activityType': row['activity_type'],
                'description': row['description'],
                'pointsEarned': row['points_earned'],
                'createdAt': row['created_at']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'activities': activities
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_worker_routes.route('/api/worker/leaderboard', methods=['GET'])
def get_worker_leaderboard():
    try:
        area = request.args.get('area', 'all')
        role = request.args.get('role', 'all')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
            SELECT worker_id, full_name, role, area, golden_points
            FROM workers 
            WHERE is_active = 1
        '''
        params = []
        
        if area != 'all':
            query += ' AND area = ?'
            params.append(area)
        
        if role != 'all':
            query += ' AND role = ?'
            params.append(role)
        
        query += ' ORDER BY golden_points DESC LIMIT 10'
        
        cursor.execute(query, params)
        
        leaderboard = []
        rank = 1
        for row in cursor.fetchall():
            leaderboard.append({
                'rank': rank,
                'workerId': row['worker_id'],
                'name': row['full_name'],
                'role': row['role'],
                'area': row['area'],
                'goldenPoints': row['golden_points']
            })
            rank += 1
        
        conn.close()
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@enhanced_worker_routes.route('/api/worker/award-training', methods=['POST'])
def award_training_points():
    """
    Awards training (golden) points to a worker and records an activity entry.
    Body: { workerId: string, points: int, description?: string }
    """
    try:
        data = request.get_json()
        worker_id = data.get('workerId')
        points = int(data.get('points', 0))
        description = data.get('description') or 'Completed training module/quizzes'

        if not worker_id or points <= 0:
            return jsonify({'success': False, 'message': 'workerId and positive points are required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Update points
        cursor.execute('''
            UPDATE workers SET golden_points = golden_points + ? WHERE worker_id = ?
        ''', (points, worker_id))

        # Record activity
        cursor.execute('''
            INSERT INTO worker_activities (worker_id, activity_type, description, points_earned)
            VALUES (?, 'Training', ?, ?)
        ''', (worker_id, description, points))

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'pointsAwarded': points}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
