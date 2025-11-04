// Tab navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Main navigation tabs
            const menuItems = document.querySelectorAll('.menu-item');
            const tabContents = document.querySelectorAll('.tab-content');
            
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all menu items and tab contents
                    menuItems.forEach(i => i.classList.remove('active'));
                    tabContents.forEach(tab => tab.classList.remove('active'));
                    
                    // Add active class to clicked menu item
                    this.classList.add('active');
                    
                    // Show corresponding tab content
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Settings sub-tabs
            const settingsTabs = document.querySelectorAll('[data-settings-tab]');
            const settingsTabContents = document.querySelectorAll('.settings-tab-content');
            
            settingsTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all settings tabs and contents
                    settingsTabs.forEach(t => t.classList.remove('active'));
                    settingsTabContents.forEach(content => content.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding content
                    const tabId = this.getAttribute('data-settings-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Simulate loading data
            fetchDashboardData();
        });
        
        function fetchDashboardData() {
            // In a real application, this would be an API call
            console.log('Fetching dashboard data...');
            
            // Simulate API call delay
            setTimeout(() => {
                console.log('Dashboard data loaded');
            }, 1000);
        }
        
        // Global logout handler — clears session/local storage entries and redirects to login page
        document.addEventListener('click', function (e) {
          const target = e.target.closest('[data-logout], #logoutBtn');
          if (!target) return;
        
          // optional: clear auth/session data
          try {
            localStorage.removeItem('authToken');
            sessionStorage.clear();
          } catch (err) {
            // ignore storage errors
          }
        
          // redirect to login page
          window.location.href = 'admin_login.html';
        });