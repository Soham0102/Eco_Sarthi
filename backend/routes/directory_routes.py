from flask import Blueprint, request, jsonify
import sqlite3

directory_routes = Blueprint('directory_routes', __name__)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('ecosarthi.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_directory_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Compost makers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS compost_makers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            owner TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            area TEXT NOT NULL,
            city TEXT NOT NULL,
            address TEXT NOT NULL,
            services TEXT NOT NULL,
            capacity TEXT,
            rating REAL DEFAULT 0.0,
            logo TEXT DEFAULT '🌱',
            working_hours TEXT,
            established_year INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Scrap shops table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scrap_shops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            owner TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            area TEXT NOT NULL,
            city TEXT NOT NULL,
            address TEXT NOT NULL,
            services TEXT NOT NULL,
            specialties TEXT NOT NULL,
            rating REAL DEFAULT 0.0,
            logo TEXT DEFAULT '♻️',
            working_hours TEXT,
            established_year INTEGER,
            pickup_available BOOLEAN DEFAULT 0,
            minimum_quantity TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize tables on import
init_directory_tables()

@directory_routes.route('/api/compost-makers', methods=['GET'])
def get_compost_makers():
    try:
        area = request.args.get('area', 'all')
        city = request.args.get('city', 'all')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
            SELECT id, name, owner, phone, email, area, city, address, services, 
                   capacity, rating, logo, working_hours, established_year
            FROM compost_makers 
            WHERE is_active = 1
        '''
        params = []
        
        if area != 'all':
            query += ' AND area = ?'
            params.append(area)
        
        if city != 'all':
            query += ' AND city = ?'
            params.append(city)
        
        query += ' ORDER BY rating DESC, name ASC'
        
        cursor.execute(query, params)
        
        makers = []
        for row in cursor.fetchall():
            makers.append({
                'id': row['id'],
                'name': row['name'],
                'owner': row['owner'],
                'phone': row['phone'],
                'email': row['email'],
                'area': row['area'],
                'city': row['city'],
                'address': row['address'],
                'services': row['services'].split(',') if row['services'] else [],
                'capacity': row['capacity'],
                'rating': row['rating'],
                'logo': row['logo'],
                'workingHours': row['working_hours'],
                'establishedYear': row['established_year']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'makers': makers
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@directory_routes.route('/api/scrap-shops', methods=['GET'])
def get_scrap_shops():
    try:
        area = request.args.get('area', 'all')
        city = request.args.get('city', 'all')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
            SELECT id, name, owner, phone, email, area, city, address, services, 
                   specialties, rating, logo, working_hours, established_year,
                   pickup_available, minimum_quantity
            FROM scrap_shops 
            WHERE is_active = 1
        '''
        params = []
        
        if area != 'all':
            query += ' AND area = ?'
            params.append(area)
        
        if city != 'all':
            query += ' AND city = ?'
            params.append(city)
        
        query += ' ORDER BY rating DESC, name ASC'
        
        cursor.execute(query, params)
        
        shops = []
        for row in cursor.fetchall():
            shops.append({
                'id': row['id'],
                'name': row['name'],
                'owner': row['owner'],
                'phone': row['phone'],
                'email': row['email'],
                'area': row['area'],
                'city': row['city'],
                'address': row['address'],
                'services': row['services'].split(',') if row['services'] else [],
                'specialties': row['specialties'].split(',') if row['specialties'] else [],
                'rating': row['rating'],
                'logo': row['logo'],
                'workingHours': row['working_hours'],
                'establishedYear': row['established_year'],
                'pickupAvailable': bool(row['pickup_available']),
                'minimumQuantity': row['minimum_quantity']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'shops': shops
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@directory_routes.route('/api/compost-makers', methods=['POST'])
def add_compost_maker():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'owner', 'phone', 'area', 'city', 'address', 'services']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO compost_makers (name, owner, phone, email, area, city, address, services, 
                                      capacity, rating, logo, working_hours, established_year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['owner'], data['phone'], data.get('email'),
            data['area'], data['city'], data['address'], ','.join(data['services']),
            data.get('capacity'), data.get('rating', 0.0), data.get('logo', '🌱'),
            data.get('workingHours'), data.get('establishedYear')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Compost maker added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@directory_routes.route('/api/scrap-shops', methods=['POST'])
def add_scrap_shop():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'owner', 'phone', 'area', 'city', 'address', 'services', 'specialties']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO scrap_shops (name, owner, phone, email, area, city, address, services, 
                                   specialties, rating, logo, working_hours, established_year,
                                   pickup_available, minimum_quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['owner'], data['phone'], data.get('email'),
            data['area'], data['city'], data['address'], ','.join(data['services']),
            ','.join(data['specialties']), data.get('rating', 0.0), data.get('logo', '♻️'),
            data.get('workingHours'), data.get('establishedYear'),
            data.get('pickupAvailable', False), data.get('minimumQuantity')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Scrap shop added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
