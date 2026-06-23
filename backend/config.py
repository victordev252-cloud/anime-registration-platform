"""
Configuration file for Anime Registration Platform
"""

import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500MB
    
    # Telegram
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '8325076687:AAHmcl6V8RTLwhP8_vktLPG67tVxR3zWups')
    TELEGRAM_GROUP_LINK = os.getenv('TELEGRAM_GROUP_LINK', 'https://t.me/kqkwkejen3i388')
    
    # Video storage
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads/videos')
    ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
    
    # Admin credentials
    ADMIN_USERNAME = 'ANASMENO1'
    ADMIN_PASSWORD = 'ANASMENO1'  # Should be hashed in production
    
    # Email settings
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = os.getenv('MAIL_PORT', 587)
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://user:password@localhost:5432/anime_registration_dev'
    )


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    
    # In production, ensure strong secret keys
    if not os.getenv('SECRET_KEY'):
        raise ValueError('SECRET_KEY not set in environment')
    if not os.getenv('JWT_SECRET_KEY'):
        raise ValueError('JWT_SECRET_KEY not set in environment')


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


# Configuration selector
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get current configuration"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])
