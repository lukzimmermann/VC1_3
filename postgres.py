import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

class PostgresDB:
    def __init__(self):
        self.dbname = os.getenv("DB_NAME")
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.host = os.getenv("DB_HOST")
        self.port = os.getenv("DB_PORT")
        self.conn = None
        self.cur = None

    def connect(self):
        try:
            self.conn = psycopg2.connect(
                dbname=self.dbname,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            )
            self.cur = self.conn.cursor()
            #print("Connected to the database.")
        except Exception as e:
            print(f"Error connecting to the database: {e}")

    def disconnect(self):
        if self.conn:
            self.conn.close()
            #print("Disconnected from the database.")

    def executeQuery(self, query, data=None):
        try:
            result = self.cur.execute(query, data)
            self.conn.commit()
            #print("Query executed successfully.")
            return result
        except Exception as e:
            self.conn.rollback()
            print(f"Error executing query: {e}")

    def selectQuery(self, query, data=None):
        try:
            self.cur.execute(query, data)
            result = self.cur.fetchall()
            #print("Query executed successfully.")
            return result
        except Exception as e:
            print(f"Error executing query: {e}")
            return None