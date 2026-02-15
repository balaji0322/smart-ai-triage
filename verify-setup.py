#!/usr/bin/env python3
"""
Setup Verification Script for AI Smart Patient Triage System
"""

import sys
import subprocess
import os

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 11:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} (Need 3.11+)")
        return False

def check_package(package_name):
    """Check if a Python package is installed"""
    try:
        __import__(package_name)
        print(f"✅ {package_name}")
        return True
    except ImportError:
        print(f"❌ {package_name} (Not installed)")
        return False

def check_file(filepath):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {filepath}")
        return True
    else:
        print(f"❌ {filepath} (Missing)")
        return False

def main():
    print("=" * 60)
    print("AI Smart Patient Triage - Setup Verification")
    print("=" * 60)
    print()
    
    all_good = True
    
    # Check Python version
    print("📦 Python Version:")
    all_good &= check_python_version()
    print()
    
    # Check critical Python packages
    print("📦 Backend Dependencies:")
    packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'pydantic',
        'jose',
        'passlib',
        'google.genai'
    ]
    for package in packages:
        all_good &= check_package(package)
    print()
    
    # Check critical files
    print("📁 Project Files:")
    files = [
        'backend/app/main.py',
        'backend/requirements.txt',
        'backend/.env',
        'frontend/App.tsx',
        'frontend/index.tsx',
        'package.json',
        'vite.config.ts'
    ]
    for file in files:
        all_good &= check_file(file)
    print()
    
    # Check startup scripts
    print("🚀 Startup Scripts:")
    scripts = ['start.bat', 'start.ps1', 'start.sh', 'start.mjs']
    for script in scripts:
        all_good &= check_file(script)
    print()
    
    # Final verdict
    print("=" * 60)
    if all_good:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("You're ready to run the application:")
        print("  Windows: start.bat")
        print("  PowerShell: .\\start.ps1")
        print("  Linux/Mac: ./start.sh")
        print("  Node.js: node start.mjs")
    else:
        print("❌ SOME CHECKS FAILED")
        print()
        print("Please install missing dependencies:")
        print("  Backend: cd backend && pip install -r requirements.txt")
        print("  Frontend: npm install")
    print("=" * 60)

if __name__ == "__main__":
    main()
