import pandas as pd
import sqlite3

csv_file = '../csv/chatbot.csv'
df = pd.read_csv(csv_file, sep=';', encoding='latin1')

# Delete 'Timestamp' 
df = df.drop(columns=['Timestamp'])
df = df.drop(columns=['Q10'])

# Adding `id` 
df.reset_index(inplace=True)
df.rename(columns={'index': 'id'}, inplace=True)

# replace 'strongly disagree, disagree, neutral, agree, strongly agree' to 1-5
agreement_mapping = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5
}
columns_to_replace = ['Q5.1', 'Q5.2', 'Q5.3', 'Q5.4', 'Q5.5', 'Q5.6', 'Q6.1', 'Q6.2', 'Q6.3', 'Q6.4', 'Q6.5', 'Q6.6', 'Q6.7', 'Q6.8', 'Q7.1', 'Q7.2', 'Q7.3', 'Q7.4', 'Q8.1', 'Q8.2', 'Q8.3', 'Q8.4', 'Q8.5', 'Q9.1', 'Q9.2', 'Q9.3', 'Q9.4', 'Q9.5']

for column in columns_to_replace:
    if column in df.columns:
        df[column] = df[column].map(agreement_mapping)


# Replace Q4
frequency_mapping = {
    'Never': 1,
    'Rarely': 2,
    'Sometimes': 3,
    'Often': 4,
    'Very Often': 5
}

if 'Q4' in df.columns:
    df['Q4'] = df['Q4'].map(frequency_mapping)


# Connect to Sqlite database
conn = sqlite3.connect('../db/data.db')

# adding dataframe to database
table_name = 'students'
df.to_sql(table_name, conn, if_exists='replace', index=False)

conn.commit()
conn.close()
