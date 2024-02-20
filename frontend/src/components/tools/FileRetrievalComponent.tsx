import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileRetrievalComponent = ({ link }: { link: string }) => {
  const [fileData, setFileData] = useState<Blob | null>(null);

  useEffect(() => {
    console.log('hi')
    const fetchFile = async () => {
      try {
        const response = await axios.get(link, { responseType: 'arraybuffer' });
        if (response.status === 200) {
          const data: Blob = new Blob([response.data], { type: response.headers['content-type'] });
          setFileData(data);
        } else {
          console.error('Failed to fetch file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [link]);
  console.log(fileData)
  return fileData;
};
export default  FileRetrievalComponent;