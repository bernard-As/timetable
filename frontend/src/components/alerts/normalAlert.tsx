import React, { useEffect } from 'react';
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface AlertProps {
  title: string;
  icon: any;
}

const Alert: React.FC<AlertProps> = ({ title, icon }) => {
  useEffect(() => {
    // Show the alert when the component mounts
    showAlert();
  }, []); // Empty dependency array ensures that it runs only once on mount

  const showAlert = () => {
    const alertConfig: SweetAlertOptions = {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      icon,
      title, // Use the provided title
    };

    Swal.fire(alertConfig);
  };

  return null; // Return null because there's no need to render anything in the DOM
};

export default Alert;
