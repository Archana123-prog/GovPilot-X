# Python Version Configuration

This project **requires Python 3.11 or higher**.

## 📋 Configuration Files

This project includes three configuration files that specify the Python version requirement:

### 1. `.python-version`
- Used by **pyenv** (Python version manager)
- Contains: `3.11`
- Automatically sets Python version when you enter the directory

### 2. `requirements.txt`
- Contains: `python_requires>=3.11` at the top
- Tells pip to enforce Python 3.11+ requirement

### 3. `pyproject.toml`
- Modern Python packaging standard (PEP 517/518)
- Contains: `requires-python = ">=3.11"`
- Specifies build requirements and project metadata
- Can be used with pip, poetry, or other package managers

---

## ✅ Check Your Python Version

```powershell
python --version
```

**Expected output:**
```
Python 3.11.0
Python 3.11.1
Python 3.12.0
Python 3.12.1
etc.
```

---

## ❌ Python Version Too Old?

### Option 1: Install via python.org (Recommended)
1. Go to https://www.python.org/downloads/
2. Download **Python 3.11 or newer**
3. Run installer
4. ✅ **IMPORTANT**: Check "Add Python to PATH"
5. Restart your terminal
6. Verify: `python --version`

### Option 2: Use pyenv (Linux/Mac/Windows-WSL)
```bash
# Install pyenv from https://github.com/pyenv/pyenv
pyenv install 3.11.0
pyenv local 3.11.0
```

### Option 3: Use conda
```bash
conda create -n govpilot python=3.11
conda activate govpilot
```

---

## 🔍 Multiple Python Versions Installed?

If you have Python 3.10 and 3.11 both installed:

```powershell
# Use Python 3.11 explicitly
python3.11 --version

# Or use 'py' launcher (Windows)
py -3.11 --version

# Create venv with specific version
python3.11 -m venv venv
```

---

## ⚡ Setting Python in Virtual Environment

Once you activate the virtual environment, it automatically uses the Python version it was created with:

```powershell
# Check Python version in venv
.\venv\Scripts\python.exe --version

# Should output Python 3.11+
```

If your venv was created with wrong Python version, delete and recreate:

```powershell
# Remove old venv
Remove-Item -Recurse venv

# Create with correct Python version
python -m venv venv

# Or specify explicitly
python3.11 -m venv venv

# Activate
.\venv\Scripts\Activate.ps1
```

---

## 📦 Verify Dependencies Work with Your Python

After activating venv and installing requirements:

```powershell
# Check installed Python version in venv
python --version

# Try importing main packages to verify
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
python -c "import sqlalchemy; print(f'SQLAlchemy {sqlalchemy.__version__}')"
python -c "import pydantic; print(f'Pydantic {pydantic.__version__}')"
```

---

## 🐛 Common Python Version Issues

### Issue: "ImportError: No module named 'something'"
- Likely using wrong Python version
- Verify: `python --version`
- Check if using system Python instead of venv Python

### Issue: "Syntax Error" with async/await
- Very old Python version (< 3.7)
- Upgrade to Python 3.11+

### Issue: "The version of pip does not support ..."
- Python version too old
- Or pip needs update: `python -m pip install --upgrade pip`

---

## ✅ Quick Version Check Checklist

Run these commands to verify everything is set up correctly:

```powershell
# 1. System Python version
python --version

# 2. Virtual environment activated?
# (Should see (venv) in prompt)

# 3. Python version in venv
python --version

# 4. Pip version
pip --version

# 5. Can import fastapi?
python -c "import fastapi; print('✅ FastAPI works')"
```

All commands should succeed and show Python 3.11+.

---

## 📖 Additional Info

- Python 3.11 Release: https://www.python.org/downloads/release/python-3110/
- Python 3.12 Release: https://www.python.org/downloads/release/python-3120/
- Semantic Versioning: https://semver.org/

**Questions?** See `SETUP_GUIDE.md` for full setup instructions.
