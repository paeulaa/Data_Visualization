import pandas as pd
import sqlite3
import json

# Connect to database
conn = sqlite3.connect('../db/data.db')
# Visit all data in students
query = "SELECT * FROM students"
data = pd.read_sql_query(query, conn)
conn.close()

# Json file's hierarchy structure 
root = {"name": "Root", "children": []}

# 'NaN' to 0
data = data.fillna(0)

columns = [
    'Q5.1', 'Q5.2', 'Q5.3', 'Q5.4', 'Q5.5', 'Q5.6',
    'Q6.1', 'Q6.2', 'Q6.3', 'Q6.4', 'Q6.5', 'Q6.6', 'Q6.7', 'Q6.8',
    'Q7.1', 'Q7.2', 'Q7.3', 'Q7.4',
    'Q8.1', 'Q8.2', 'Q8.3', 'Q8.4', 'Q8.5',
    'Q9.1', 'Q9.2', 'Q9.3', 'Q9.4', 'Q9.5'
]

# Create node objects
for q_col in columns:
    cluster = {"name": q_col, "children": []}
    for idx, row in data.iterrows():
        value = row[q_col]
        distance = row['Q4']  # Q4 表示距离
        studentID = str(row['id']) 
        degree = str(row['Q1'])
        major = str(row['Q2']).replace(' ', '_')
        gender = str(row['Q3'])
        
        data_point = {
            "name": f"Data Point {idx+1}",
            "value": value,
            "distance": distance,
            "studentID": studentID,
            "degree": degree,
            "major": major,
            "gender": gender
        }
        cluster["children"].append(data_point)
    root["children"].append(cluster)

# output json file
json_data = json.dumps(root, indent=4)

with open('hierarchy_data.json', 'w') as f:
    f.write(json_data)

print("Successfully generate JSON file.")
