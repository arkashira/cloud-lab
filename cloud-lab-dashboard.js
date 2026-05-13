   document.addEventListener('DOMContentLoaded', function() {
       const troubleshootGuideLink = document.createElement('a');
       troubleshootGuideLink.href = '/troubleshooting/docker-installation';
       troubleshootGuideLink.textContent = 'Troubleshoot Docker Installation Issues';
       troubleshootGuideLink.className = 'guide-link';

       const dashboardContainer = document.getElementById('dashboard-container');
       if (dashboardContainer) {
           dashboardContainer.appendChild(troubleshootGuideLink);
       } else {
           console.error("Dashboard container not found.");
       }
   });