import sqlite3
from openbb_payday.payday_models import User, LoanApplication, Repayment

DATABASE_FILE = "payday.db"

def set_database_file(filename):
    global DATABASE_FILE
    DATABASE_FILE = filename

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            hashed_password TEXT,
            email TEXT NOT NULL UNIQUE,
            verification_token TEXT,
            account_status TEXT NOT NULL DEFAULT 'pending',
            referral_code TEXT NOT NULL UNIQUE,
            referred_by TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS loan_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            address TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            social_insurance_number TEXT NOT NULL,
            employment_status TEXT NOT NULL,
            monthly_income REAL NOT NULL,
            loan_amount_requested REAL NOT NULL,
            loan_purpose TEXT NOT NULL,
            status TEXT NOT NULL,
            total_repayment REAL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS repayments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (application_id) REFERENCES loan_applications (id)
        )
        """
    )
    conn.commit()
    conn.close()
