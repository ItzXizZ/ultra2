import os

# Simulate Flask app.root_path
app_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app')
build_path_old = os.path.join(app_root, '..', 'build')
build_path_new = os.path.join(os.path.dirname(app_root), 'build')

print(f"App root (Flask): {app_root}")
print(f"Build path (old): {build_path_old}")
print(f"Build path (new): {build_path_new}")
print(f"Old path exists: {os.path.exists(build_path_old)}")
print(f"New path exists: {os.path.exists(build_path_new)}")

# Test the correct path
correct_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build')
print(f"Correct path: {correct_path}")
print(f"Correct path exists: {os.path.exists(correct_path)}") 