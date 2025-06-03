import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { useCookies } from 'react-cookie';

const AssessmentModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cookies, setCookie] = useCookies(['assessmentModalShown']);
  const formLink = 'https://docs.google.com/forms/d/e/1FAIpQLSc1dPOVq2ogwlBQr66XXkHqvGHMWQNTJiW3PozV4EL_q0iupg/viewform?usp=header'; // Replace with actual Google Form link

  useEffect(() => {
    // Check if the cookie exists; if not, show the modal
    if (!cookies.assessmentModalShown) {
      setIsModalVisible(true);
    }
  }, [cookies]);

  const handleOk = () => {
    // Set cookie to prevent modal from showing again
    setCookie('assessmentModalShown', 'true', { path: '/', maxAge: 31536000 }); // 1 year expiry
    setIsModalVisible(false);
    // Navigate to the Google Form
    window.open(formLink, '_blank');
  };

  const handleCancel = () => {
    // Close the modal without setting the cookie
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Complete Your Assessment"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Later
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Go to Form
        </Button>,
      ]}
    >
      <p>
        Please take a moment to fill out an assessment form. Your feedback is
        important to us!
      </p>
    </Modal>
  );
};

export default AssessmentModal;