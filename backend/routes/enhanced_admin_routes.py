from flask import Blueprint, request, jsonify
import sqlite3
from datetime import datetime, timedelta
import math

enhanced_admin_routes = Blueprint('enhanced_admin_routes', __name__)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('ecosarthi.db')
    conn.row_factory = sqlite3.Row
    return conn

@enhanced_admin_routes.route('/api/admin/workers', methods=['GET'])
def get_all_workers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT worker_id, full_name, email, phone, role, area, golden_points, 
                   created_at, last_login, is_active
            FROM workers 
            ORDER BY created_at DESC
        ''')
        
        workers = []
        for row in cursor.fetchall():
            workers.append({
                'workerId': row['worker_id'],
                'fullName': row['full_name'],
                'email': row['email'],
                'phone': row['phone'],
                'role': row['role'],
                'area': row['area'],
                'goldenPoints': row['golden_points'],
                'createdAt': row['created_at'],
                'lastLogin': row['last_login'],
                'isActive': bool(row['is_active'])
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'workers': workers
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/citizens', methods=['GET'])
def get_all_citizens():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT citizen_id, home_number, full_name, email, phone, address, area, 
                   green_points, streak, created_at, last_login
            FROM citizens 
            ORDER BY green_points DESC
        ''')
        
        citizens = []
        for row in cursor.fetchall():
            citizens.append({
                'citizenId': row['citizen_id'],
                'homeNumber': row['home_number'],
                'fullName': row['full_name'],
                'email': row['email'],
                'phone': row['phone'],
                'address': row['address'],
                'area': row['area'],
                'greenPoints': row['green_points'],
                'streak': row['streak'],
                'createdAt': row['created_at'],
                'lastLogin': row['last_login']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'citizens': citizens
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/tasks', methods=['GET'])
def get_all_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT task_id, worker_id, task_type, title, description, home_number, 
                   location, priority, status, assigned_at, completed_at, points_earned
            FROM worker_tasks 
            ORDER BY assigned_at DESC
        ''')
        
        tasks = []
        for row in cursor.fetchall():
            tasks.append({
                'taskId': row['task_id'],
                'workerId': row['worker_id'],
                'taskType': row['task_type'],
                'title': row['title'],
                'description': row['description'],
                'homeNumber': row['home_number'],
                'location': row['location'],
                'priority': row['priority'],
                'status': row['status'],
                'assignedAt': row['assigned_at'],
                'completedAt': row['completed_at'],
                'pointsEarned': row['points_earned']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'tasks': tasks
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/qr-scans', methods=['GET'])
def get_all_qr_scans():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT scan_id, worker_id, home_number, scan_type, points_earned, created_at
            FROM qr_scans 
            ORDER BY created_at DESC
        ''')
        
        scans = []
        for row in cursor.fetchall():
            scans.append({
                'scanId': row['scan_id'],
                'workerId': row['worker_id'],
                'homeNumber': row['home_number'],
                'scanType': row['scan_type'],
                'pointsEarned': row['points_earned'],
                'createdAt': row['created_at']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'scans': scans
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/analytics', methods=['GET'])
def get_analytics():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get total counts
        cursor.execute('SELECT COUNT(*) as count FROM workers WHERE is_active = 1')
        total_workers = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(*) as count FROM citizens')
        total_citizens = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(*) as count FROM worker_tasks WHERE status = "assigned"')
        active_tasks = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(*) as count FROM qr_scans WHERE DATE(created_at) = DATE("now")')
        today_scans = cursor.fetchone()['count']
        
        # Get top performers
        cursor.execute('''
            SELECT full_name, golden_points, role 
            FROM workers 
            WHERE is_active = 1 
            ORDER BY golden_points DESC 
            LIMIT 5
        ''')
        top_workers = []
        for row in cursor.fetchall():
            top_workers.append({
                'name': row['full_name'],
                'points': row['golden_points'],
                'role': row['role']
            })
        
        cursor.execute('''
            SELECT full_name, green_points, home_number 
            FROM citizens 
            ORDER BY green_points DESC 
            LIMIT 5
        ''')
        top_citizens = []
        for row in cursor.fetchall():
            top_citizens.append({
                'name': row['full_name'],
                'points': row['green_points'],
                'homeNumber': row['home_number']
            })
        
        # Get task completion rates
        cursor.execute('''
            SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
            FROM worker_tasks 
            WHERE DATE(assigned_at) >= DATE('now', '-7 days')
        ''')
        task_stats = cursor.fetchone()
        completion_rate = (task_stats['completed_tasks'] / task_stats['total_tasks'] * 100) if task_stats['total_tasks'] > 0 else 0
        
        conn.close()
        
        return jsonify({
            'success': True,
            'analytics': {
                'totalWorkers': total_workers,
                'totalCitizens': total_citizens,
                'activeTasks': active_tasks,
                'todayScans': today_scans,
                'completionRate': round(completion_rate, 2),
                'topWorkers': top_workers,
                'topCitizens': top_citizens
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/assign-task', methods=['POST'])
def admin_assign_task():
    try:
        data = request.get_json()
        
        # This endpoint delegates to the worker routes
        from routes.enhanced_worker_routes import assign_task
        return assign_task()
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/register-worker', methods=['POST'])
def admin_register_worker():
    try:
        data = request.get_json()
        
        # This endpoint delegates to the worker routes
        from routes.enhanced_worker_routes import register_worker
        return register_worker()
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@enhanced_admin_routes.route('/api/admin/assign-by-distance', methods=['POST'])
def admin_assign_by_distance():
    try:
        data = request.get_json()
        lat = float(data.get('location', {}).get('lat'))
        lng = float(data.get('location', {}).get('lng'))
        title = data.get('title') or 'Collection Task'
        description = data.get('description', '')
        priority = data.get('priority', 'medium')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT worker_id, full_name, role, area FROM workers WHERE is_active = 1')
        workers = cursor.fetchall()

        def area_to_coord(a: str):
            h = sum(ord(c) for c in (a or 'A'))
            return (20.0 + (h % 100) * 0.01, 77.0 + ((h // 100) % 100) * 0.01)

        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            phi1 = math.radians(lat1)
            phi2 = math.radians(lat2)
            dphi = math.radians(lat2 - lat1)
            dlambda = math.radians(lon2 - lon1)
            a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
            return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

        ranked = []
        for w in workers:
            wlat, wlng = area_to_coord(w['area'])
            dist = haversine(lat, lng, wlat, wlng)
            ranked.append((dist, w['worker_id']))
        ranked.sort(key=lambda x: x[0])

        if not ranked:
            conn.close()
            return jsonify({'success': False, 'message': 'No active workers'}), 400

        nearest_worker_id = ranked[0][1]
        task_id = f"AUTO_{int(datetime.utcnow().timestamp())}"
        cursor.execute('''
            INSERT INTO worker_tasks (task_id, worker_id, task_type, title, description, location, priority)
            VALUES (?, ?, 'Collection', ?, ?, ?, ?)
        ''', (task_id, nearest_worker_id, title, description, f"{lat},{lng}", priority))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'assignedTo': nearest_worker_id, 'taskId': task_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
