export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // These use the variables you put in your .env file
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    
    const data = await response.json();
    return data.secure_url; // This is the URL you will save to Supabase
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};