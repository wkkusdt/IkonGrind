#!/usr/bin/env python3

import os
import json
from pathlib import Path

def generate_tree(directory, prefix="", max_depth=4, current_depth=0, ignore_dirs={'.git', 'node_modules', '.env', 'dist', 'build', '.vscode', '.idea'}):
    """Generate a tree structure of the directory"""
    if current_depth >= max_depth:
        return ""
    
    tree = ""
    items = []
    
    try:
        for item in sorted(os.listdir(directory)):
            if item.startswith('.') and item not in {'.env.example', '.gitignore'}:
                continue
            if item in ignore_dirs:
                continue
            items.append(item)
    except PermissionError:
        return tree
    
    for i, item in enumerate(items):
        path = os.path.join(directory, item)
        is_last = i == len(items) - 1
        current_prefix = "└── " if is_last else "├── "
        tree += f"{prefix}{current_prefix}{item}\n"
        
        if os.path.isdir(path) and item not in ignore_dirs:
            next_prefix = prefix + ("    " if is_last else "│   ")
            tree += generate_tree(path, next_prefix, max_depth, current_depth + 1, ignore_dirs)
    
    return tree

def main():
    root = Path(__file__).parent
    
    print("🎮 IkonGrind - Project Structure")
    print("=" * 50)
    print()
    
    tree = generate_tree(str(root))
    print(tree)
    
    # Count files by type
    print("\n📊 Project Statistics:")
    print("=" * 50)
    
    ts_files = len(list(root.rglob('*.ts'))) + len(list(root.rglob('*.tsx')))
    js_files = len(list(root.rglob('*.js'))) + len(list(root.rglob('*.jsx')))
    json_files = len(list(root.rglob('*.json')))
    md_files = len(list(root.rglob('*.md')))
    
    print(f"TypeScript files: {ts_files}")
    print(f"JavaScript files: {js_files}")
    print(f"JSON files: {json_files}")
    print(f"Markdown files: {md_files}")
    print(f"Total: {ts_files + js_files + json_files + md_files}")
    
    print("\n📁 Key Directories:")
    print("=" * 50)
    print("backend/src/models      - Database schemas")
    print("backend/src/services    - Business logic")
    print("backend/src/controllers - API controllers")
    print("backend/src/routes      - API routes")
    print("backend/src/bot         - Telegram Bot")
    print("webapp/src/pages        - App screens")
    print("webapp/src/store        - State management")
    print("webapp/src/api          - API client")
    print("docs/                   - Documentation")
    
    print("\n📚 Documentation Files:")
    print("=" * 50)
    docs = {
        'README.md': 'Main project documentation',
        'QUICKSTART.md': 'Quick start guide',
        'PROJECT_SUMMARY.md': 'Project summary',
        'docs/API.md': 'API documentation',
        'docs/GAME_MECHANICS.md': 'Game mechanics details',
        'docs/ARCHITECTURE.md': 'System architecture',
        'docs/DEPLOYMENT.md': 'Deployment guide',
        'docs/UX_FLOW.md': 'User experience flow',
        'docs/RECOMMENDATIONS.md': 'Future recommendations'
    }
    
    for file, desc in docs.items():
        print(f"✓ {file:<35} - {desc}")
    
    print("\n✅ Project Ready!")
    print("Start with: cat QUICKSTART.md")

if __name__ == '__main__':
    main()
