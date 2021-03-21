import sqlite3
import json

con = sqlite3.connect('hnu50.db')

cur = con.cursor()

# Create table
# cur.execute('''CREATE TABLE Universities(
#   Id INT Primary Key,
#   Title VARCHAR(50),
#   Url VARCHAR(50)
# );''')

# cur.execute('''CREATE TABLE Specialists(
#   Id INT Primary Key,
#   Title VARCHAR(50),
#   Url VARCHAR(50)
# );''')


# cur.execute('''CREATE TABLE UniSpecs(
#   Id INT Primary Key,
#   UniverId INT,
#   SpecId INT,
#   FOREIGN KEY (UniverId)
#       REFERENCES universities (Id),
#   FOREIGN KEY (SpecId)
#     REFERENCES specialists (Id)
# );''')

# with open('datasets/id2s.json', 'r') as sp_ids_file:
#     s_ids = json.load(sp_ids_file)

# with open('datasets/s2url.json', 'r') as sp_url_file:
#     s_urls = json.load(sp_url_file)

# for s_id in s_ids.keys():
#     cur.execute(f"INSERT INTO specialists VALUES ({int(s_id)}, '{s_ids[str(s_id)]}', '{s_urls[s_ids[str(s_id)]]}')")

# cur.execute('SELECT * FROM specialists')
# print(cur.fetchall())

# with open('datasets/id2uni.json', 'r') as uni_ids_file:
#     u_ids = json.load(uni_ids_file)

# with open('datasets/universities.json', 'r') as uni_url_file:
#     u_urls = json.load(uni_url_file)

# for u_id in u_ids.keys():
#     cur.execute(f"INSERT INTO universities VALUES ({int(u_id)}, '{u_ids[str(u_id)]}', 'null')")

# cur.execute('SELECT * FROM universities')
# print(cur.fetchall())

# with open('datasets/uni_info.json', 'r') as uni_spec_file:
#     us_links = json.load(uni_spec_file)

# s = 1
# for uni_id in us_links:
#     spec_ids = us_links[uni_id]
#     for spec_id in spec_ids:
#         cur.execute(f"INSERT INTO UniSpecs VALUES ({s}, {uni_id}, {spec_id})")
#         s += 1

# cur.execute('SELECT * FROM UniSpecs')
# print(cur.fetchall())

# cur.execute('''CREATE TABLE Users(
#   Id INTEGER Primary Key AUTOINCREMENT,
#   Email VARCHAR(50) UNIQUE,
#   Login VARCHAR(50),
#   Password VARCHAR(50),
#   FirstName VARCHAR(50),
#   LastName VARCHAR(50)
# );''')

# Save (commit) the changes
con.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
con.close()