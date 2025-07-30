import os

# Test the same path logic as Flask app
app_root = os.path.dirname(os.path.abspath(__file__))
build_path = os.path.join(app_root, 'build')

print(f"App root: {app_root}")
print(f"Build path: {build_path}")
print(f"Build path exists: {os.path.exists(build_path)}")

if os.path.exists(build_path):
    print("Build directory contents:")
    for item in os.listdir(build_path):
        print(f"  - {item}")
    
    index_path = os.path.join(build_path, 'index.html')
    print(f"index.html exists: {os.path.exists(index_path)}")
else:
    print("Build directory not found!") 