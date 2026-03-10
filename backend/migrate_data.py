import pymysql

# =====================================================
# CHANGE THESE TO YOUR LOCAL DATABASE CREDENTIALS
# =====================================================
LOCAL_HOST = '127.0.0.1'
LOCAL_PORT = 3306
LOCAL_USER = 'root'
LOCAL_PASSWORD = 'Smit1911'
LOCAL_DB = 'resume_db'

# Railway database (DO NOT CHANGE)
RAILWAY_HOST = 'yamanote.proxy.rlwy.net'
RAILWAY_PORT = 24292
RAILWAY_USER = 'root'
RAILWAY_PASSWORD = 'iitPaPIcYhXFKusvTeJMJwkOZOvavNop'
RAILWAY_DB = 'railway'

local = pymysql.connect(host=LOCAL_HOST, port=LOCAL_PORT, user=LOCAL_USER, password=LOCAL_PASSWORD, database=LOCAL_DB)
railway = pymysql.connect(host=RAILWAY_HOST, port=RAILWAY_PORT, user=RAILWAY_USER, password=RAILWAY_PASSWORD, database=RAILWAY_DB)

local_cur = local.cursor()
rail_cur = railway.cursor()

# Users first, then dependent tables
tables = ['users', 'resumes', 'education', 'experience', 'skills', 'projects', 'certifications']

# Step 1: Sync missing columns
for table in tables:
    local_cur.execute('SHOW COLUMNS FROM ' + table)
    local_cols = {col[0]: col for col in local_cur.fetchall()}
    rail_cur.execute('SHOW COLUMNS FROM ' + table)
    rail_cols = {col[0] for col in rail_cur.fetchall()}

    for col_name, col_info in local_cols.items():
        if col_name not in rail_cols:
            col_type = col_info[1]
            nullable = 'NULL' if col_info[2] == 'YES' else 'NOT NULL'
            default = ''
            if col_info[4] is not None:
                default = " DEFAULT '" + str(col_info[4]) + "'"
            alter_sql = 'ALTER TABLE ' + table + ' ADD COLUMN ' + col_name + ' ' + col_type + ' ' + nullable + default
            print('Adding column: ' + table + '.' + col_name)
            rail_cur.execute(alter_sql)
            railway.commit()

# Step 2: Get existing emails in Railway to avoid duplicate users
rail_cur.execute('SELECT email FROM users')
existing_emails = {row[0] for row in rail_cur.fetchall()}
print('Existing users in Railway: ' + str(len(existing_emails)))

# Step 3: Get existing user IDs in Railway
rail_cur.execute('SELECT id FROM users')
existing_user_ids = {row[0] for row in rail_cur.fetchall()}

# Step 4: Migrate users (skip duplicates by email)
local_cur.execute('SHOW COLUMNS FROM users')
user_cols = [col[0] for col in local_cur.fetchall()]
rail_cur.execute('SHOW COLUMNS FROM users')
rail_user_cols = {col[0] for col in rail_cur.fetchall()}
common_user_cols = [c for c in user_cols if c in rail_user_cols]
col_list = ', '.join(common_user_cols)
email_idx = common_user_cols.index('email')

local_cur.execute('SELECT ' + col_list + ' FROM users')
local_users = local_cur.fetchall()

new_users = 0
new_user_ids = set()
for row in local_users:
    if row[email_idx] not in existing_emails:
        placeholders = ', '.join(['%s'] * len(common_user_cols))
        sql = 'INSERT INTO users (' + col_list + ') VALUES (' + placeholders + ')'
        rail_cur.execute(sql, row)
        new_users += 1
        id_idx = common_user_cols.index('id')
        new_user_ids.add(row[id_idx])
    else:
        id_idx = common_user_cols.index('id')
        new_user_ids.add(row[id_idx])

railway.commit()
print('users: ' + str(new_users) + ' new rows added')

# Step 5: Migrate other tables (only for users that exist)
for table in ['resumes', 'education', 'experience', 'skills', 'projects', 'certifications']:
    local_cur.execute('SHOW COLUMNS FROM ' + table)
    local_columns = [col[0] for col in local_cur.fetchall()]
    rail_cur.execute('SHOW COLUMNS FROM ' + table)
    rail_columns = {col[0] for col in rail_cur.fetchall()}
    common_cols = [c for c in local_columns if c in rail_columns]
    col_list = ', '.join(common_cols)
    placeholders = ', '.join(['%s'] * len(common_cols))

    # Get existing IDs in Railway to skip duplicates
    rail_cur.execute('SELECT id FROM ' + table)
    existing_ids = {row[0] for row in rail_cur.fetchall()}

    local_cur.execute('SELECT ' + col_list + ' FROM ' + table)
    rows = local_cur.fetchall()
    id_idx = common_cols.index('id')

    count = 0
    for row in rows:
        if row[id_idx] not in existing_ids:
            sql = 'INSERT INTO ' + table + ' (' + col_list + ') VALUES (' + placeholders + ')'
            try:
                rail_cur.execute(sql, row)
                count += 1
            except Exception as e:
                print('  Skipped row in ' + table + ': ' + str(e))
    railway.commit()
    print(table + ': ' + str(count) + ' new rows added')

print()
print('Migration complete!')

local.close()
railway.close()
