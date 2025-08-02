import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from werkzeug.utils import secure_filename
import logging

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

class CloudStorageService:
    def __init__(self):
        self.cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
        self.api_key = os.environ.get('CLOUDINARY_API_KEY')
        self.api_secret = os.environ.get('CLOUDINARY_API_SECRET')
        
        # Check if Cloudinary is configured
        if not all([self.cloud_name, self.api_key, self.api_secret]):
            logging.warning("Cloudinary not fully configured. Using fallback local storage.")
            self.enabled = False
        else:
            self.enabled = True
            logging.info("Cloudinary storage enabled")
    
    def upload_image(self, file, folder="ultra-portal"):
        """
        Upload an image to Cloudinary and return the URL
        """
        if not self.enabled:
            logging.warning("Cloudinary not enabled, skipping upload")
            return None
            
        try:
            # Secure the filename
            filename = secure_filename(file.filename)
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                public_id=filename,
                overwrite=True,
                resource_type="image",
                transformation=[
                    {"width": 800, "height": 600, "crop": "limit"},
                    {"quality": "auto", "fetch_format": "auto"}
                ]
            )
            
            # Return the secure URL
            return result.get('secure_url')
            
        except Exception as e:
            logging.error(f"Error uploading to Cloudinary: {e}")
            return None
    
    def delete_image(self, public_id):
        """
        Delete an image from Cloudinary
        """
        if not self.enabled:
            return False
            
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get('result') == 'ok'
        except Exception as e:
            logging.error(f"Error deleting from Cloudinary: {e}")
            return False
    
    def get_image_url(self, public_id, transformation=None):
        """
        Get the URL for an image with optional transformations
        """
        if not self.enabled:
            return None
            
        try:
            if transformation:
                return cloudinary.CloudinaryImage(public_id).build_url(transformation=transformation)
            else:
                return cloudinary.CloudinaryImage(public_id).build_url()
        except Exception as e:
            logging.error(f"Error generating Cloudinary URL: {e}")
            return None

# Create a singleton instance
cloud_storage = CloudStorageService() 