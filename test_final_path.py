import os

# Test the final path logic
build_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'build')
print(f"Final build path: {build_path}")
print(f"Path exists: {os.path.exists(build_path)}")

if os.path.exists(build_path):
    index_path = os.path.join(build_path, 'index.html')
    print(f"index.html exists: {os.path.exists(index_path)}")
    print("Success!")
else:
    print("Path not found!") 