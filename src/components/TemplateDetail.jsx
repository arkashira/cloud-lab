import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TemplateDetail = ({ templateId }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const response = await axios.post(`/api/templates/${templateId}/launch`);
      toast.success('Template launched successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Assuming the response contains a link to the sandbox console
      window.location.href = response.data.sandboxLink;
    } catch (error) {
      toast.error('Failed to launch template.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div>
      <button onClick={handleLaunch} disabled={isLaunching}>
        {isLaunching ? 'Launching...' : 'Launch'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default TemplateDetail;