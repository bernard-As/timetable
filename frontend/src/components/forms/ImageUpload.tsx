import React, { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageUpload: (imageFile: File) => void
  ImageData: string | null
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, ImageData}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*' as unknown as Accept /* TODO: Remove cast when react-dropzone fixes their type */
  });
  

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px' }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop an image here, or click to select an image</p>
      )}
      {ImageData!==null? <img src={ImageData} alt="uploaded" style={{ width: '100%' }} />: 
      imageFile && <img src={URL.createObjectURL(imageFile)} alt="uploaded" style={{ width: '100%' }} />}
    </div>
  );
};

export default ImageUpload;