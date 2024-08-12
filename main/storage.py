import hashlib
from django.core.files.storage import FileSystemStorage
from PIL import Image, ImageChops
import os

class OverwriteStorage(FileSystemStorage):
    def calculate_file_hash(self, file, chunk_size=8192):
        hash_md5 = hashlib.md5()
        for chunk in iter(lambda: file.read(chunk_size), b""):
            hash_md5.update(chunk)
        file.seek(0)  # Reset file pointer after reading
        return hash_md5.hexdigest()

    def compare_images(self, existing_file, new_file):
        existing_image = Image.open(existing_file)
        new_image = Image.open(new_file)
        return ImageChops.difference(existing_image, new_image).getbbox() is None

    def _save(self, name, content):
        # Get the hash of the new file
        new_file_hash = self.calculate_file_hash(content)

        # Check all files in the storage
        for existing_file_name in self.listdir(os.path.dirname(name))[1]:
            existing_file_path = os.path.join(os.path.dirname(name), existing_file_name)
            existing_file = self.open(existing_file_path)
            existing_file_hash = self.calculate_file_hash(existing_file)

            # If hashes match, compare images or other files
            if existing_file_hash == new_file_hash:
                existing_file.seek(0)  # Reset file pointer for image comparison
                if self.compare_images(existing_file, content):
                    # Files are identical; no need to save the new file
                    existing_file.close()
                    return existing_file_name

            existing_file.close()

        # If no identical file is found, save the new file
        return super()._save(name, content)
