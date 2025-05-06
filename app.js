/**
 * TimeOff Tracker - Application Module
 * Core application functionality for employee management and time-off tracking
 */

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Initialize data from local storage
    initializeData();
    
    // Load and display employees
    loadEmployees();
    
    // Load and display time-off requests
    loadTimeOffRequests();
    
    // Initialize dashboard stats
    updateDashboardStats();
    
    // Initialize calendar views
    initializeCalendars();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI components
    initializeUI();
    
    // Initialize enhanced features
    initializeEnhancedFeatures();
}

/**
 * Initialize enhanced features for the application
 */
function initializeEnhancedFeatures() {
    // Initialize tab navigation
    initializeTabNavigation();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Initialize pagination
    initializePagination();
    
    // Initialize search functionality
    initializeGlobalSearch();
    
    // Initialize animations and transitions
    initializeAnimations();
    
    // Initialize loading indicators
    initializeLoadingIndicators();
    
    // Initialize notification system
    initializeNotificationSystem();
}

/**
 * Initialize tab navigation for different sections
 */
function initializeTabNavigation() {
    // Get all tab containers
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-nav .tab');
        const tabContents = container.querySelectorAll('.tab-content');
        
        // Add click event to each tab
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get target tab content
                const targetId = this.getAttribute('data-tab');
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show target tab content
                const targetContent = container.querySelector(`.tab-content[data-tab="${targetId}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
    
    // Convert filter tabs to tab navigation
    const filterTabs = document.querySelector('.filter-tabs');
    if (filterTabs) {
        const tabs = filterTabs.querySelectorAll('.filter-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Filter requests based on tab
                const status = this.textContent.toLowerCase().replace(' requests', '');
                filterRequestsByStatus(status);
            });
        });
    }
}

/**
 * Filter requests by status from tab navigation
 * @param {string} status - Status to filter by
 */
function filterRequestsByStatus(status) {
    // Get status filter dropdown
    const statusFilter = document.querySelector('.request-filters select:nth-of-type(3)');
    
    if (statusFilter) {
        // Set value based on status
        if (status === 'all') {
            statusFilter.value = 'all';
        } else {
            // Find matching option
            for (let i = 0; i < statusFilter.options.length; i++) {
                if (statusFilter.options[i].textContent.toLowerCase().includes(status)) {
                    statusFilter.value = statusFilter.options[i].value;
                    break;
                }
            }
        }
        
        // Trigger change event to filter requests
        const event = new Event('change');
        statusFilter.dispatchEvent(event);
    }
}

/**
 * Initialize table sorting functionality
 */
function initializeTableSorting() {
    // Get all sortable tables
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        
        // Add sort icons and click event to each header
        headers.forEach((header, index) => {
            // Skip action columns
            if (header.classList.contains('actions-cell') || 
                header.textContent.toLowerCase().includes('action')) {
                return;
            }
            
            // Make header sortable
            header.classList.add('sortable');
            
            // Add sort icon
            const sortIcon = document.createElement('i');
            sortIcon.className = 'fas fa-sort';
            header.appendChild(sortIcon);
            
            // Add click event
            header.addEventListener('click', function() {
                // Remove sort classes from all headers
                headers.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                    const icon = h.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-sort';
                    }
                });
                
                // Determine sort direction
                let sortDirection = 'asc';
                if (this.classList.contains('sort-asc')) {
                    sortDirection = 'desc';
                }
                
                // Add sort class to clicked header
                this.classList.add(`sort-${sortDirection}`);
                
                // Update sort icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = `fas fa-sort-${sortDirection}`;
                }
                
                // Sort table
                sortTable(table, index, sortDirection);
            });
        });
    });
}

/**
 * Sort a table by a specific column
 * @param {HTMLElement} table - Table element
 * @param {number} columnIndex - Index of column to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 */
function sortTable(table, columnIndex, direction) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = getCellValue(a, columnIndex);
        const bValue = getCellValue(b, columnIndex);
        
        // Compare values
        if (direction === 'asc') {
            return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
        }
    });
    
    // Reorder rows in the table
    rows.forEach(row => {
        tbody.appendChild(row);
    });
    
    // Show sorting animation
    showSortingAnimation(tbody);
}

/**
 * Get the value of a table cell for sorting
 * @param {HTMLElement} row - Table row
 * @param {number} columnIndex - Index of column
 * @returns {string} - Cell value
 */
function getCellValue(row, columnIndex) {
    const cell = row.cells[columnIndex];
    
    // Check for special elements
    const statusBadge = cell.querySelector('.status-badge');
    if (statusBadge) {
        return statusBadge.textContent;
    }
    
    const employeeName = cell.querySelector('.employee-name');
    if (employeeName) {
        return employeeName.textContent;
    }
    
    const requestType = cell.querySelector('.request-type');
    if (requestType) {
        return requestType.textContent;
    }
    
    // Default to cell text content
    return cell.textContent.trim();
}

/**
 * Show animation when sorting table
 * @param {HTMLElement} tbody - Table body element
 */
function showSortingAnimation(tbody) {
    // Add animation class
    tbody.classList.add('sorting');
    
    // Remove class after animation completes
    setTimeout(() => {
        tbody.classList.remove('sorting');
    }, 300);
}

/**
 * Initialize pagination for tables
 */
function initializePagination() {
    // Get all tables with pagination
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        // Get pagination container
        const paginationContainer = table.parentElement.querySelector('.pagination');
        if (!paginationContainer) return;
        
        // Get rows per page
        const rowsPerPage = 10;
        
        // Store current page in data attribute
        table.dataset.currentPage = '1';
        
        // Store rows per page in data attribute
        table.dataset.rowsPerPage = rowsPerPage.toString();
        
        // Initialize pagination
        updatePagination(table);
        
        // Add event listeners to pagination buttons
        const prevButton = paginationContainer.querySelector('.pagination-prev');
        const nextButton = paginationContainer.querySelector('.pagination-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                const currentPage = parseInt(table.dataset.currentPage);
                if (currentPage > 1) {
                    table.dataset.currentPage = (currentPage - 1).toString();
                    updatePagination(table);
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                const currentPage = parseInt(table.dataset.currentPage);
                const totalPages = parseInt(table.dataset.totalPages || '1');
                
                if (currentPage < totalPages) {
                    table.dataset.currentPage = (currentPage + 1).toString();
                    updatePagination(table);
                }
            });
        }
    });
}

/**
 * Update pagination for a table
 * @param {HTMLElement} table - Table element
 */
function updatePagination(table) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    // Get pagination info
    const currentPage = parseInt(table.dataset.currentPage);
    const rowsPerPage = parseInt(table.dataset.rowsPerPage);
    
    // Calculate total pages
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    table.dataset.totalPages = totalPages.toString();
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // Show/hide rows based on current page
    rows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update pagination display
    const paginationContainer = table.parentElement.querySelector('.pagination');
    if (paginationContainer) {
        const pageInfo = paginationContainer.querySelector('.page-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        // Update button states
        const prevButton = paginationContainer.querySelector('.pagination-prev');
        const nextButton = paginationContainer.querySelector('.pagination-next');
        
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = currentPage === totalPages;
        }
    }
    
    // Show pagination animation
    showPaginationAnimation(tbody);
}

/**
 * Show animation when changing pages
 * @param {HTMLElement} tbody - Table body element
 */
function showPaginationAnimation(tbody) {
    // Add animation class
    tbody.classList.add('page-transition');
    
    // Remove class after animation completes
    setTimeout(() => {
        tbody.classList.remove('page-transition');
    }, 300);
}

/**
 * Initialize global search functionality
 */
function initializeGlobalSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Get active section
            const activeSection = document.querySelector('.content-section.active');
            
            if (!activeSection) return;
            
            // Perform search based on active section
            if (activeSection.id === 'dashboard') {
                searchDashboard(searchTerm);
            } else if (activeSection.id === 'employees') {
                searchEmployees(searchTerm);
            } else if (activeSection.id === 'requests') {
                searchRequests(searchTerm);
            } else if (activeSection.id === 'calendar') {
                searchCalendar(searchTerm);
            }
            
            // Show search animation
            showSearchAnimation();
        });
    }
}

/**
 * Search within the dashboard section
 * @param {string} searchTerm - Search term
 */
function searchDashboard(searchTerm) {
    // Search in upcoming time-off
    const timeOffItems = document.querySelectorAll('.upcoming-time-off .time-off-item');
    
    timeOffItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        
        if (text.includes(searchTerm)) {
            item.style.display = '';
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Search in recent requests
    const requestItems = document.querySelectorAll('.recent-requests .request-item');
    
    requestItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        
        if (text.includes(searchTerm)) {
            item.style.display = '';
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Search within the employees section
 * @param {string} searchTerm - Search term
 */
function searchEmployees(searchTerm) {
    // Set search input in employee filters
    const employeeSearchInput = document.querySelector('.employee-filters .search-filter input');
    
    if (employeeSearchInput) {
        employeeSearchInput.value = searchTerm;
        
        // Trigger input event to filter employees
        const event = new Event('input');
        employeeSearchInput.dispatchEvent(event);
    }
}

/**
 * Search within the requests section
 * @param {string} searchTerm - Search term
 */
function searchRequests(searchTerm) {
    // Set search input in request filters
    const requestSearchInput = document.querySelector('.request-filters .search-filter input');
    
    if (requestSearchInput) {
        requestSearchInput.value = searchTerm;
        
        // Trigger input event to filter requests
        const event = new Event('input');
        requestSearchInput.dispatchEvent(event);
    }
}

/**
 * Search within the calendar section
 * @param {string} searchTerm - Search term
 */
function searchCalendar(searchTerm) {
    // Search in calendar events
    const calendarEvents = document.querySelectorAll('.calendar-event');
    
    // Reset all events
    calendarEvents.forEach(event => {
        event.classList.remove('search-match');
    });
    
    // Highlight matching events
    if (searchTerm) {
        calendarEvents.forEach(event => {
            const text = event.textContent.toLowerCase();
            
            if (text.includes(searchTerm)) {
                event.classList.add('search-match');
            }
        });
    }
}

/**
 * Highlight search term in an element
 * @param {HTMLElement} element - Element to highlight in
 * @param {string} searchTerm - Search term to highlight
 */
function highlightSearchTerm(element, searchTerm) {
    // Skip if search term is empty
    if (!searchTerm) return;
    
    // Get text nodes in the element
    const textNodes = getTextNodes(element);
    
    textNodes.forEach(node => {
        const text = node.nodeValue;
        const lowerText = text.toLowerCase();
        const index = lowerText.indexOf(searchTerm);
        
        if (index >= 0) {
            // Create highlight element
            const highlightEl = document.createElement('span');
            highlightEl.className = 'search-highlight';
            
            // Split text into parts
            const before = text.substring(0, index);
            const match = text.substring(index, index + searchTerm.length);
            const after = text.substring(index + searchTerm.length);
            
            // Create text nodes
            const beforeNode = document.createTextNode(before);
            const afterNode = document.createTextNode(after);
            
            // Set highlight text
            highlightEl.textContent = match;
            
            // Replace original node with new nodes
            const parentNode = node.parentNode;
            parentNode.insertBefore(beforeNode, node);
            parentNode.insertBefore(highlightEl, node);
            parentNode.insertBefore(afterNode, node);
            parentNode.removeChild(node);
        }
    });
}

/**
 * Get all text nodes in an element
 * @param {HTMLElement} element - Element to search in
 * @returns {Array} - Array of text nodes
 */
function getTextNodes(element) {
    const textNodes = [];
    
    function getNodes(node) {
        if (node.nodeType === 3) {
            // Text node
            textNodes.push(node);
        } else if (node.nodeType === 1) {
            // Element node
            for (let i = 0; i < node.childNodes.length; i++) {
                getNodes(node.childNodes[i]);
            }
        }
    }
    
    getNodes(element);
    return textNodes;
}

/**
 * Show animation when searching
 */
function showSearchAnimation() {
    const searchIcon = document.querySelector('.search-container i');
    
    if (searchIcon) {
        // Add animation class
        searchIcon.classList.add('searching');
        
        // Remove class after animation completes
        setTimeout(() => {
            searchIcon.classList.remove('searching');
        }, 500);
    }
}

/**
 * Initialize animations and transitions
 */
function initializeAnimations() {
    // Add transition class to main elements
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('with-transition');
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn, .btn-icon').forEach(button => {
        button.classList.add('with-hover');
    });
    
    // Add animation to sidebar navigation
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.add('with-animation');
    });
    
    // Add animation to cards
    document.querySelectorAll('.stat-card, .grid-item').forEach(card => {
        card.classList.add('with-animation');
    });
    
    // Add animation to modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('with-animation');
    });
}

/**
 * Initialize loading indicators
 */
function initializeLoadingIndicators() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(loadingOverlay);
    
    // Create loading indicator function
    window.showLoading = function(show = true) {
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    };
    
    // Add loading indicators to actions
    addLoadingToActions();
}

/**
 * Add loading indicators to actions
 */
function addLoadingToActions() {
    // Add loading to employee form submission
    const saveEmployeeBtn = document.querySelector('.modal-footer .btn-primary');
    if (saveEmployeeBtn) {
        const originalSaveEmployee = saveEmployee;
        
        window.saveEmployee = function() {
            showLoading(true);
            
            // Simulate server delay
            setTimeout(() => {
                originalSaveEmployee();
                showLoading(false);
            }, 500);
        };
    }
    
    // Add loading to request form submission
    const submitRequestBtn = document.querySelector('#requestModal .modal-footer .btn-primary');
    if (submitRequestBtn) {
        const originalSubmitTimeOffRequest = submitTimeOffRequest;
        
        window.submitTimeOffRequest = function() {
            showLoading(true);
            
            // Simulate server delay
            setTimeout(() => {
                originalSubmitTimeOffRequest();
                showLoading(false);
            }, 500);
        };
    }
    
    // Add loading to section changes
    const originalShowSection = showSection;
    
    window.showSection = function(sectionId) {
        showLoading(true);
        
        // Simulate server delay
        setTimeout(() => {
            originalShowSection(sectionId);
            showLoading(false);
        }, 300);
    };
}

/**
 * Initialize enhanced notification system
 */
function initializeNotificationSystem() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    
    // Add to document
    document.body.appendChild(notificationContainer);
    
    // Override notification function
    window.showNotification = function(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'info') icon = 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Add close button event
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after delay
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    };
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Employee search functionality
    const employeeSearchInput = document.querySelector('.employee-filters .search-filter input');
    if (employeeSearchInput) {
        employeeSearchInput.addEventListener('input', function() {
            filterEmployees();
        });
    }
    
    // Department filter
    const departmentFilter = document.querySelector('.employee-filters select:first-of-type');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            filterEmployees();
        });
    }
    
    // Status filter
    const statusFilter = document.querySelector('.employee-filters select:last-of-type');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterEmployees();
        });
    }
    
    // Add employee button
    const addEmployeeBtn = document.querySelector('.section-header .btn-primary');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', function() {
            openEmployeeModal();
        });
    }
    
    // Modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeEmployeeModal();
        });
    }
    
    // Cancel button in modal
    const cancelBtn = document.querySelector('.modal-footer .btn-outline');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeEmployeeModal();
        });
    }
    
    // Save employee button
    const saveEmployeeBtn = document.querySelector('.modal-footer .btn-primary');
    if (saveEmployeeBtn) {
        saveEmployeeBtn.addEventListener('click', function() {
            saveEmployee();
        });
    }
    
    // Navigation menu items
    const navItems = document.querySelectorAll('.sidebar-nav li a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.app-container').classList.toggle('sidebar-collapsed');
        });
    }
    
    // Theme toggle
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            document.body.classList.toggle('dark-theme');
            // Save theme preference
            localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
        });
    }
    
    // New Time-Off Request button
    const newRequestBtn = document.querySelector('#requests .section-header .btn-primary');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            openRequestModal();
        });
    }
    
    // Close Request Modal button
    const closeRequestModalBtn = document.querySelector('#requestModal .close-modal');
    if (closeRequestModalBtn) {
        closeRequestModalBtn.addEventListener('click', function() {
            closeRequestModal();
        });
    }
    
    // Cancel Request button in modal
    const cancelRequestBtn = document.querySelector('#requestModal .modal-footer .btn-outline');
    if (cancelRequestBtn) {
        cancelRequestBtn.addEventListener('click', function() {
            closeRequestModal();
        });
    }
    
    // Submit Request button
    const submitRequestBtn = document.querySelector('#requestModal .modal-footer .btn-primary');
    if (submitRequestBtn) {
        submitRequestBtn.addEventListener('click', function() {
            submitTimeOffRequest();
        });
    }
    
    // Date inputs for time-off request
    const startDateInput = document.getElementById('request-start-date');
    const endDateInput = document.getElementById('request-end-date');
    
    if (startDateInput && endDateInput) {
        // Update days calculation when dates change
        startDateInput.addEventListener('change', function() {
            calculateRequestDays();
        });
        
        endDateInput.addEventListener('change', function() {
            calculateRequestDays();
        });
    }
    
    // Request type selection
    const requestTypeSelect = document.getElementById('request-type');
    if (requestTypeSelect) {
        requestTypeSelect.addEventListener('change', function() {
            updateAvailableDays();
        });
    }
    
    // Calendar navigation buttons
    const prevMonthBtn = document.querySelector('.calendar-navigation .btn-icon:first-child');
    const nextMonthBtn = document.querySelector('.calendar-navigation .btn-icon:nth-child(3)');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateCalendar(-1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateCalendar(1);
        });
    }
    
    // Today button
    const todayBtn = document.querySelector('.calendar-navigation .btn-text');
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            resetCalendarToToday();
        });
    }
    
    // Calendar view options
    const calendarViewOptions = document.querySelectorAll('.calendar-view-options button');
    calendarViewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const view = this.textContent.toLowerCase();
            changeCalendarView(view);
            
            // Update active class
            calendarViewOptions.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Request filter options
    const requestFilterOptions = document.querySelectorAll('.request-filters select');
    requestFilterOptions.forEach(filter => {
        filter.addEventListener('change', function() {
            filterRequests();
        });
    });
    
    // Request search input
    const requestSearchInput = document.querySelector('.request-filters .search-filter input');
    if (requestSearchInput) {
        requestSearchInput.addEventListener('input', function() {
            filterRequests();
        });
    }
    
    // Add pagination event listeners
    const paginationPrev = document.querySelectorAll('.pagination .btn-icon:first-child');
    const paginationNext = document.querySelectorAll('.pagination .btn-icon:last-child');
    
    paginationPrev.forEach(btn => {
        btn.classList.add('pagination-prev');
    });
    
    paginationNext.forEach(btn => {
        btn.classList.add('pagination-next');
    });
}

/**
 * Reset calendar to today's date
 */
function resetCalendarToToday() {
    const today = new Date();
    
    // Get all calendars
    const calendars = document.querySelectorAll('.calendar');
    
    calendars.forEach(calendar => {
        // Update data attributes
        calendar.dataset.year = today.getFullYear();
        calendar.dataset.month = today.getMonth();
        
        // Update header
        const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const header = calendar.querySelector('.calendar-header .current-month');
        if (header) {
            header.textContent = monthYear;
        }
    });
    
    // Refresh calendar
    refreshCalendar();
    
    // Show notification
    showNotification('Calendar reset to today', 'info');
}

/**
 * Initialize UI components and restore user preferences
 */
function initializeUI() {
    // Restore theme preference
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-switch').checked = true;
    }
    
    // Show default section (dashboard)
    showSection('dashboard');
}

/**
 * Show a specific section and hide others
 * @param {string} sectionId - ID of the section to show
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active navigation item
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`.sidebar-nav li a[href="#${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.parentElement.classList.add('active');
    }
    
    // Perform section-specific initializations
    if (sectionId === 'calendar') {
        refreshCalendar();
    } else if (sectionId === 'dashboard') {
        updateDashboardStats();
    } else if (sectionId === 'requests') {
        loadTimeOffRequests();
    } else if (sectionId === 'employees') {
        loadEmployees();
    }
}

/**
 * Load and display employees from data
 */
function loadEmployees() {
    const data = getEmployeeData();
    const employeeTableBody = document.querySelector('.employee-list table tbody');
    
    if (!employeeTableBody) return;
    
    // Clear existing rows
    employeeTableBody.innerHTML = '';
    
    // Add employee rows
    data.employees.forEach(employee => {
        const row = createEmployeeRow(employee);
        employeeTableBody.appendChild(row);
    });
    
    // Initialize pagination for employee table
    initializePagination();
}

/**
 * Create a table row for an employee
 * @param {Object} employee - Employee data
 * @returns {HTMLElement} - TR element with employee data
 */
function createEmployeeRow(employee) {
    const row = document.createElement('tr');
    row.dataset.employeeId = employee.id;
    
    // Employee info cell
    const employeeCell = document.createElement('td');
    employeeCell.className = 'employee-cell';
    employeeCell.innerHTML = `
        <div class="employee-avatar">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="employee-info">
            <p class="employee-name">${employee.firstName} ${employee.lastName}</p>
            <p class="employee-email">${employee.email}</p>
        </div>
    `;
    
    // Department cell
    const departmentCell = document.createElement('td');
    departmentCell.textContent = employee.department.charAt(0).toUpperCase() + employee.department.slice(1);
    
    // Status cell
    const statusCell = document.createElement('td');
    statusCell.innerHTML = `<span class="status-badge ${employee.status}">${employee.status.replace('-', ' ').charAt(0).toUpperCase() + employee.status.replace('-', ' ').slice(1)}</span>`;
    
    // Time-off cells
    const vacationCell = document.createElement('td');
    vacationCell.textContent = `${employee.timeOff.vacation.remaining} days`;
    
    const personalCell = document.createElement('td');
    personalCell.textContent = `${employee.timeOff.personal.remaining} days`;
    
    const sickCell = document.createElement('td');
    sickCell.textContent = `${employee.timeOff.sick.remaining} days`;
    
    // Actions cell
    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell';
    actionsCell.innerHTML = `
        <button class="btn-icon edit-employee" title="Edit Employee"><i class="fas fa-edit"></i></button>
        <button class="btn-icon view-requests" title="View Time-Off Requests"><i class="fas fa-calendar-alt"></i></button>
        <button class="btn-icon delete-employee" title="Delete Employee"><i class="fas fa-trash"></i></button>
    `;
    
    // Add event listeners for action buttons
    actionsCell.querySelector('.edit-employee').addEventListener('click', function() {
        openEmployeeModal(employee.id);
    });
    
    actionsCell.querySelector('.view-requests').addEventListener('click', function() {
        showEmployeeRequests(employee.id);
    });
    
    actionsCell.querySelector('.delete-employee').addEventListener('click', function() {
        if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            deleteEmployee(employee.id);
        }
    });
    
    // Append all cells to the row
    row.appendChild(employeeCell);
    row.appendChild(departmentCell);
    row.appendChild(statusCell);
    row.appendChild(vacationCell);
    row.appendChild(personalCell);
    row.appendChild(sickCell);
    row.appendChild(actionsCell);
    
    return row;
}

/**
 * Filter employees based on search input and dropdown filters
 */
function filterEmployees() {
    const searchTerm = document.querySelector('.employee-filters .search-filter input').value.toLowerCase();
    const departmentFilter = document.querySelector('.employee-filters select:first-of-type').value;
    const statusFilter = document.querySelector('.employee-filters select:last-of-type').value;
    
    const data = getEmployeeData();
    let filteredEmployees = [...data.employees];
    
    // Apply search filter
    if (searchTerm) {
        filteredEmployees = filteredEmployees.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            return fullName.includes(searchTerm) || 
                   employee.email.toLowerCase().includes(searchTerm) ||
                   employee.position.toLowerCase().includes(searchTerm);
        });
    }
    
    // Apply department filter
    if (departmentFilter && departmentFilter !== 'All Departments') {
        filteredEmployees = filteredEmployees.filter(employee => {
            return employee.department.toLowerCase() === departmentFilter.toLowerCase();
        });
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'All Status') {
        filteredEmployees = filteredEmployees.filter(employee => {
            return employee.status.toLowerCase() === statusFilter.toLowerCase().replace(' ', '-');
        });
    }
    
    // Update the table with filtered employees
    const employeeTableBody = document.querySelector('.employee-list table tbody');
    if (!employeeTableBody) return;
    
    // Clear existing rows
    employeeTableBody.innerHTML = '';
    
    // Add filtered employee rows
    if (filteredEmployees.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" class="empty-message">No employees found matching your criteria</td>`;
        employeeTableBody.appendChild(emptyRow);
    } else {
        filteredEmployees.forEach(employee => {
            const row = createEmployeeRow(employee);
            employeeTableBody.appendChild(row);
        });
    }
    
    // Update pagination
    const table = document.querySelector('.employee-list table');
    if (table) {
        table.dataset.currentPage = '1';
        updatePagination(table);
    }
}

/**
 * Open the employee modal for adding or editing an employee
 * @param {number} employeeId - ID of the employee to edit (optional)
 */
function openEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employeeModal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const form = modal.querySelector('.employee-form');
    
    // Reset form
    form.reset();
    
    if (employeeId) {
        // Edit existing employee
        modalTitle.textContent = 'Edit Employee';
        
        // Get employee data
        const data = getEmployeeData();
        const employee = data.employees.find(emp => emp.id === employeeId);
        
        if (employee) {
            // Populate form with employee data
            form.querySelector('#employee-first-name').value = employee.firstName;
            form.querySelector('#employee-last-name').value = employee.lastName;
            form.querySelector('#employee-email').value = employee.email;
            form.querySelector('#employee-department').value = employee.department;
            form.querySelector('#employee-position').value = employee.position;
            form.querySelector('#employee-start-date').value = employee.startDate;
            form.querySelector('#employee-status').value = employee.status;
            form.querySelector('#employee-vacation-days').value = employee.timeOff.vacation.total;
            form.querySelector('#employee-personal-days').value = employee.timeOff.personal.total;
            form.querySelector('#employee-sick-days').value = employee.timeOff.sick.total;
            
            // Store employee ID for saving
            form.dataset.employeeId = employeeId;
        }
    } else {
        // Add new employee
        modalTitle.textContent = 'Add New Employee';
        form.removeAttribute('data-employee-id');
        
        // Set default values for new employee
        const today = new Date().toISOString().split('T')[0];
        form.querySelector('#employee-start-date').value = today;
        form.querySelector('#employee-vacation-days').value = defaultTimeOffAllocation.vacation.total;
        form.querySelector('#employee-personal-days').value = defaultTimeOffAllocation.personal.total;
        form.querySelector('#employee-sick-days').value = defaultTimeOffAllocation.sick.total;
    }
    
    // Show modal with animation
    modal.classList.add('active');
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
}

/**
 * Close the employee modal
 */
function closeEmployeeModal() {
    const modal = document.getElementById('employeeModal');
    
    // Hide modal with animation
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.classList.remove('active');
    }, 300);
}

/**
 * Save employee data from the modal form
 */
function saveEmployee() {
    const form = document.querySelector('.employee-form');
    
    // Basic form validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const firstName = form.querySelector('#employee-first-name').value;
    const lastName = form.querySelector('#employee-last-name').value;
    const email = form.querySelector('#employee-email').value;
    const department = form.querySelector('#employee-department').value;
    const position = form.querySelector('#employee-position').value;
    const startDate = form.querySelector('#employee-start-date').value;
    const status = form.querySelector('#employee-status').value;
    const vacationDays = parseInt(form.querySelector('#employee-vacation-days').value);
    const personalDays = parseInt(form.querySelector('#employee-personal-days').value);
    const sickDays = parseInt(form.querySelector('#employee-sick-days').value);
    
    // Get current data
    const data = getEmployeeData();
    
    // Check if editing existing employee
    const employeeId = form.dataset.employeeId ? parseInt(form.dataset.employeeId) : null;
    
    if (employeeId) {
        // Update existing employee
        const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
        
        if (employeeIndex !== -1) {
            const employee = data.employees[employeeIndex];
            
            // Update employee data
            employee.firstName = firstName;
            employee.lastName = lastName;
            employee.email = email;
            employee.department = department;
            employee.position = position;
            employee.startDate = startDate;
            employee.status = status;
            
            // Calculate used days based on previous totals and remaining days
            const vacationUsed = employee.timeOff.vacation.used;
            const personalUsed = employee.timeOff.personal.used;
            const sickUsed = employee.timeOff.sick.used;
            
            // Update time-off data
            employee.timeOff = {
                vacation: {
                    total: vacationDays,
                    used: vacationUsed,
                    remaining: vacationDays - vacationUsed
                },
                personal: {
                    total: personalDays,
                    used: personalUsed,
                    remaining: personalDays - personalUsed
                },
                sick: {
                    total: sickDays,
                    used: sickUsed,
                    remaining: sickDays - sickUsed
                }
            };
            
            // Update employee in data
            data.employees[employeeIndex] = employee;
        }
    } else {
        // Create new employee
        const newEmployee = {
            id: Date.now(), // Use timestamp as unique ID
            firstName,
            lastName,
            email,
            department,
            position,
            startDate,
            status,
            timeOff: {
                vacation: {
                    total: vacationDays,
                    used: 0,
                    remaining: vacationDays
                },
                personal: {
                    total: personalDays,
                    used: 0,
                    remaining: personalDays
                },
                sick: {
                    total: sickDays,
                    used: 0,
                    remaining: sickDays
                }
            },
            requests: []
        };
        
        // Add new employee to data
        data.employees.push(newEmployee);
    }
    
    // Save updated data
    saveEmployeeData(data);
    
    // Reload employees table
    loadEmployees();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Close modal
    closeEmployeeModal();
    
    // Show success message
    showNotification(employeeId ? 'Employee updated successfully' : 'Employee added successfully');
}

/**
 * Delete an employee
 * @param {number} employeeId - ID of the employee to delete
 */
function deleteEmployee(employeeId) {
    // Get current data
    const data = getEmployeeData();
    
    // Find employee index
    const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex !== -1) {
        // Remove employee from data
        data.employees.splice(employeeIndex, 1);
        
        // Save updated data
        saveEmployeeData(data);
        
        // Reload employees table
        loadEmployees();
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Show success message
        showNotification('Employee deleted successfully');
    }
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Open the time-off request modal
 * @param {number} employeeId - ID of the employee for the request (optional)
 * @param {number} requestId - ID of the request to edit (optional)
 */
function openRequestModal(employeeId = null, requestId = null) {
    const modal = document.getElementById('requestModal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const form = modal.querySelector('.request-form');
    
    // Reset form
    form.reset();
    
    // Get current data
    const data = getEmployeeData();
    
    // Populate employee dropdown
    const employeeSelect = document.getElementById('request-employee');
    if (employeeSelect) {
        // Clear existing options
        employeeSelect.innerHTML = '';
        
        // Add employee options
        data.employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.firstName} ${employee.lastName}`;
            employeeSelect.appendChild(option);
        });
        
        // Set selected employee if provided
        if (employeeId) {
            employeeSelect.value = employeeId;
        }
    }
    
    if (requestId) {
        // Edit existing request
        modalTitle.textContent = 'Edit Time-Off Request';
        
        // Find the employee and request
        let targetEmployee = null;
        let targetRequest = null;
        
        for (const employee of data.employees) {
            const request = employee.requests.find(req => req.id === requestId);
            if (request) {
                targetEmployee = employee;
                targetRequest = request;
                break;
            }
        }
        
        if (targetEmployee && targetRequest) {
            // Set employee
            employeeSelect.value = targetEmployee.id;
            
            // Populate form with request data
            form.querySelector('#request-type').value = targetRequest.type;
            form.querySelector('#request-status').value = targetRequest.status;
            form.querySelector('#request-start-date').value = targetRequest.startDate;
            form.querySelector('#request-end-date').value = targetRequest.endDate;
            form.querySelector('#request-days').value = targetRequest.days;
            form.querySelector('#request-notes').value = targetRequest.notes || '';
            
            // Store request ID for saving
            form.dataset.requestId = requestId;
            
            // Update available days
            updateAvailableDays();
        }
    } else {
        // New request
        modalTitle.textContent = 'New Time-Off Request';
        form.removeAttribute('data-request-id');
        
        // Set default values
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        form.querySelector('#request-start-date').value = today.toISOString().split('T')[0];
        form.querySelector('#request-end-date').value = tomorrow.toISOString().split('T')[0];
        form.querySelector('#request-status').value = 'pending';
        
        // Calculate days
        calculateRequestDays();
        
        // Update available days
        updateAvailableDays();
    }
    
    // Show modal with animation
    modal.classList.add('active');
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
}

/**
 * Close the time-off request modal
 */
function closeRequestModal() {
    const modal = document.getElementById('requestModal');
    
    // Hide modal with animation
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.classList.remove('active');
    }, 300);
}

/**
 * Calculate the number of business days between two dates
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {number} - Number of business days
 */
function calculateBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure start date is before end date
    if (start > end) return 0;
    
    // Initialize count
    let count = 0;
    
    // Clone start date
    const current = new Date(start);
    
    // Iterate through days
    while (current <= end) {
        // Check if current day is a weekday (0 = Sunday, 6 = Saturday)
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        
        // Move to next day
        current.setDate(current.getDate() + 1);
    }
    
    return count;
}

/**
 * Calculate the number of days for a time-off request
 */
function calculateRequestDays() {
    const startDateInput = document.getElementById('request-start-date');
    const endDateInput = document.getElementById('request-end-date');
    const daysInput = document.getElementById('request-days');
    
    if (startDateInput && endDateInput && daysInput) {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (startDate && endDate) {
            const days = calculateBusinessDays(startDate, endDate);
            daysInput.value = days;
            
            // Update available days
            updateAvailableDays();
        }
    }
}

/**
 * Update the available days display based on selected request type
 */
function updateAvailableDays() {
    const employeeSelect = document.getElementById('request-employee');
    const requestTypeSelect = document.getElementById('request-type');
    const daysInput = document.getElementById('request-days');
    const availableDaysSpan = document.getElementById('available-days');
    
    if (employeeSelect && requestTypeSelect && daysInput && availableDaysSpan) {
        const employeeId = parseInt(employeeSelect.value);
        const requestType = requestTypeSelect.value;
        const requestDays = parseInt(daysInput.value) || 0;
        
        // Get employee data
        const data = getEmployeeData();
        const employee = data.employees.find(emp => emp.id === employeeId);
        
        if (employee && employee.timeOff[requestType]) {
            const remainingDays = employee.timeOff[requestType].remaining;
            availableDaysSpan.textContent = remainingDays;
            
            // Check if request exceeds available days
            if (requestDays > remainingDays) {
                daysInput.classList.add('invalid');
                availableDaysSpan.classList.add('error');
            } else {
                daysInput.classList.remove('invalid');
                availableDaysSpan.classList.remove('error');
            }
        }
    }
}

/**
 * Submit a time-off request
 */
function submitTimeOffRequest() {
    const form = document.querySelector('.request-form');
    
    // Basic form validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form values
    const employeeId = parseInt(form.querySelector('#request-employee').value);
    const requestType = form.querySelector('#request-type').value;
    const requestStatus = form.querySelector('#request-status').value;
    const startDate = form.querySelector('#request-start-date').value;
    const endDate = form.querySelector('#request-end-date').value;
    const days = parseInt(form.querySelector('#request-days').value);
    const notes = form.querySelector('#request-notes').value;
    
    // Get current data
    const data = getEmployeeData();
    
    // Find employee
    const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex === -1) {
        showNotification('Employee not found', 'error');
        return;
    }
    
    const employee = data.employees[employeeIndex];
    
    // Validate request
    if (!validateTimeOffRequest(employee, requestType, days, startDate, endDate, form.dataset.requestId)) {
        return;
    }
    
    // Check if editing existing request
    const requestId = form.dataset.requestId ? parseInt(form.dataset.requestId) : null;
    
    if (requestId) {
        // Update existing request
        const requestIndex = employee.requests.findIndex(req => req.id === requestId);
        
        if (requestIndex !== -1) {
            const oldRequest = employee.requests[requestIndex];
            const oldStatus = oldRequest.status;
            const oldDays = oldRequest.days;
            const oldType = oldRequest.type;
            
            // Create updated request
            const updatedRequest = {
                id: requestId,
                type: requestType,
                startDate,
                endDate,
                days,
                status: requestStatus,
                requestDate: oldRequest.requestDate,
                notes
            };
            
            // Update time-off balances if status changed or days/type changed
            if ((oldStatus !== 'approved' && requestStatus === 'approved') || 
                (oldStatus === 'approved' && (oldDays !== days || oldType !== requestType))) {
                
                // If old request was approved, restore those days first
                if (oldStatus === 'approved') {
                    employee.timeOff[oldType].used -= oldDays;
                    employee.timeOff[oldType].remaining += oldDays;
                }
                
                // If new request is approved, deduct days
                if (requestStatus === 'approved') {
                    employee.timeOff[requestType].used += days;
                    employee.timeOff[requestType].remaining -= days;
                }
            }
            
            // Update request in data
            employee.requests[requestIndex] = updatedRequest;
        }
    } else {
        // Create new request
        const newRequest = {
            id: Date.now(), // Use timestamp as unique ID
            type: requestType,
            startDate,
            endDate,
            days,
            status: requestStatus,
            requestDate: new Date().toISOString().split('T')[0],
            notes
        };
        
        // Update time-off balances if request is approved
        if (requestStatus === 'approved') {
            employee.timeOff[requestType].used += days;
            employee.timeOff[requestType].remaining -= days;
        }
        
        // Add new request to employee
        if (!employee.requests) {
            employee.requests = [];
        }
        employee.requests.push(newRequest);
    }
    
    // Update employee in data
    data.employees[employeeIndex] = employee;
    
    // Save updated data
    saveEmployeeData(data);
    
    // Reload time-off requests
    loadTimeOffRequests();
    
    // Reload employees table
    loadEmployees();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Refresh calendar
    refreshCalendar();
    
    // Close modal
    closeRequestModal();
    
    // Show success message
    showNotification(requestId ? 'Time-off request updated successfully' : 'Time-off request submitted successfully');
}

/**
 * Validate a time-off request
 * @param {Object} employee - Employee data
 * @param {string} requestType - Type of time-off request
 * @param {number} days - Number of days requested
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} excludeRequestId - ID of request to exclude from validation (for edits)
 * @returns {boolean} - Whether the request is valid
 */
function validateTimeOffRequest(employee, requestType, days, startDate, endDate, excludeRequestId = null) {
    // Check if employee has enough days available
    if (days > employee.timeOff[requestType].remaining) {
        showNotification(`Not enough ${requestType} days available`, 'error');
        return false;
    }
    
    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date must be before end date', 'error');
        return false;
    }
    
    // Check if start date is in the past
    if (new Date(startDate) < new Date(new Date().toISOString().split('T')[0])) {
        showNotification('Start date cannot be in the past', 'error');
        return false;
    }
    
    // Check for date conflicts with existing approved requests
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (const request of employee.requests) {
        // Skip the request being edited
        if (excludeRequestId && request.id === parseInt(excludeRequestId)) {
            continue;
        }
        
        // Only check approved or active requests
        if (request.status !== 'approved' && request.status !== 'active') {
            continue;
        }
        
        const reqStart = new Date(request.startDate);
        const reqEnd = new Date(request.endDate);
        
        // Check for overlap
        if ((start >= reqStart && start <= reqEnd) || 
            (end >= reqStart && end <= reqEnd) || 
            (start <= reqStart && end >= reqEnd)) {
            showNotification('Date conflict with existing time-off request', 'error');
            return false;
        }
    }
    
    return true;
}

/**
 * Load and display time-off requests
 * @param {number} employeeId - ID of employee to filter by (optional)
 */
function loadTimeOffRequests(employeeId = null) {
    const data = getEmployeeData();
    const requestsTableBody = document.querySelector('.requests-list table tbody');
    
    if (!requestsTableBody) return;
    
    // Clear existing rows
    requestsTableBody.innerHTML = '';
    
    // Collect all requests
    let allRequests = [];
    
    data.employees.forEach(employee => {
        if (employee.requests && employee.requests.length > 0) {
            // Filter by employee if specified
            if (employeeId && employee.id !== employeeId) {
                return;
            }
            
            // Add employee info to each request
            const employeeRequests = employee.requests.map(request => ({
                ...request,
                employeeId: employee.id,
                employeeName: `${employee.firstName} ${employee.lastName}`
            }));
            
            allRequests = [...allRequests, ...employeeRequests];
        }
    });
    
    // Sort requests by start date (most recent first)
    allRequests.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    // Add request rows
    if (allRequests.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" class="empty-message">No time-off requests found</td>`;
        requestsTableBody.appendChild(emptyRow);
    } else {
        allRequests.forEach(request => {
            const row = createRequestRow(request);
            requestsTableBody.appendChild(row);
        });
    }
    
    // Update filter counts
    updateRequestFilterCounts(allRequests);
    
    // Initialize pagination for requests table
    initializePagination();
}

/**
 * Create a table row for a time-off request
 * @param {Object} request - Request data with employee info
 * @returns {HTMLElement} - TR element with request data
 */
function createRequestRow(request) {
    const row = document.createElement('tr');
    row.dataset.requestId = request.id;
    row.dataset.employeeId = request.employeeId;
    
    // Employee name cell
    const employeeCell = document.createElement('td');
    employeeCell.className = 'employee-cell';
    employeeCell.innerHTML = `
        <div class="employee-avatar">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="employee-info">
            <p class="employee-name">${request.employeeName}</p>
        </div>
    `;
    
    // Request type cell
    const typeCell = document.createElement('td');
    typeCell.innerHTML = `<span class="request-type ${request.type}">${request.type.charAt(0).toUpperCase() + request.type.slice(1)}</span>`;
    
    // Start date cell
    const startDateCell = document.createElement('td');
    startDateCell.textContent = formatDate(request.startDate);
    
    // End date cell
    const endDateCell = document.createElement('td');
    endDateCell.textContent = formatDate(request.endDate);
    
    // Days cell
    const daysCell = document.createElement('td');
    daysCell.textContent = `${request.days} days`;
    
    // Status cell
    const statusCell = document.createElement('td');
    statusCell.innerHTML = `<span class="status-badge ${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>`;
    
    // Actions cell
    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell';
    
    // Different actions based on status
    if (request.status === 'pending') {
        actionsCell.innerHTML = `
            <button class="btn-icon approve-request" title="Approve Request"><i class="fas fa-check"></i></button>
            <button class="btn-icon deny-request" title="Deny Request"><i class="fas fa-times"></i></button>
            <button class="btn-icon edit-request" title="Edit Request"><i class="fas fa-edit"></i></button>
        `;
        
        // Add event listeners for action buttons
        actionsCell.querySelector('.approve-request').addEventListener('click', function() {
            updateRequestStatus(request.employeeId, request.id, 'approved');
        });
        
        actionsCell.querySelector('.deny-request').addEventListener('click', function() {
            updateRequestStatus(request.employeeId, request.id, 'denied');
        });
    } else {
        actionsCell.innerHTML = `
            <button class="btn-icon edit-request" title="Edit Request"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete-request" title="Delete Request"><i class="fas fa-trash"></i></button>
        `;
    }
    
    // Add edit event listener
    actionsCell.querySelector('.edit-request').addEventListener('click', function() {
        openRequestModal(request.employeeId, request.id);
    });
    
    // Add delete event listener if present
    const deleteBtn = actionsCell.querySelector('.delete-request');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this time-off request?')) {
                deleteTimeOffRequest(request.employeeId, request.id);
            }
        });
    }
    
    // Append all cells to the row
    row.appendChild(employeeCell);
    row.appendChild(typeCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(daysCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);
    
    return row;
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Update the status of a time-off request
 * @param {number} employeeId - ID of the employee
 * @param {number} requestId - ID of the request
 * @param {string} newStatus - New status for the request
 */
function updateRequestStatus(employeeId, requestId, newStatus) {
    // Get current data
    const data = getEmployeeData();
    
    // Find employee
    const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex === -1) {
        showNotification('Employee not found', 'error');
        return;
    }
    
    const employee = data.employees[employeeIndex];
    
    // Find request
    const requestIndex = employee.requests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
        showNotification('Request not found', 'error');
        return;
    }
    
    const request = employee.requests[requestIndex];
    const oldStatus = request.status;
    
    // Update request status
    request.status = newStatus;
    
    // Update time-off balances if status changed to/from approved
    if (oldStatus !== 'approved' && newStatus === 'approved') {
        // Deduct days when approving
        employee.timeOff[request.type].used += request.days;
        employee.timeOff[request.type].remaining -= request.days;
    } else if (oldStatus === 'approved' && newStatus !== 'approved') {
        // Restore days when un-approving
        employee.timeOff[request.type].used -= request.days;
        employee.timeOff[request.type].remaining += request.days;
    }
    
    // Update request in data
    employee.requests[requestIndex] = request;
    
    // Update employee in data
    data.employees[employeeIndex] = employee;
    
    // Save updated data
    saveEmployeeData(data);
    
    // Reload time-off requests
    loadTimeOffRequests();
    
    // Reload employees table
    loadEmployees();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Refresh calendar
    refreshCalendar();
    
    // Show success message
    showNotification(`Time-off request ${newStatus}`);
}

/**
 * Delete a time-off request
 * @param {number} employeeId - ID of the employee
 * @param {number} requestId - ID of the request to delete
 */
function deleteTimeOffRequest(employeeId, requestId) {
    // Get current data
    const data = getEmployeeData();
    
    // Find employee
    const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex === -1) {
        showNotification('Employee not found', 'error');
        return;
    }
    
    const employee = data.employees[employeeIndex];
    
    // Find request
    const requestIndex = employee.requests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
        showNotification('Request not found', 'error');
        return;
    }
    
    const request = employee.requests[requestIndex];
    
    // If request was approved, restore time-off balance
    if (request.status === 'approved' || request.status === 'active') {
        employee.timeOff[request.type].used -= request.days;
        employee.timeOff[request.type].remaining += request.days;
    }
    
    // Remove request from data
    employee.requests.splice(requestIndex, 1);
    
    // Update employee in data
    data.employees[employeeIndex] = employee;
    
    // Save updated data
    saveEmployeeData(data);
    
    // Reload time-off requests
    loadTimeOffRequests();
    
    // Reload employees table
    loadEmployees();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Refresh calendar
    refreshCalendar();
    
    // Show success message
    showNotification('Time-off request deleted successfully');
}

/**
 * Filter time-off requests based on dropdown filters
 */
function filterRequests() {
    const employeeFilter = document.querySelector('.request-filters select:nth-of-type(1)').value;
    const typeFilter = document.querySelector('.request-filters select:nth-of-type(2)').value;
    const statusFilter = document.querySelector('.request-filters select:nth-of-type(3)').value;
    const searchTerm = document.querySelector('.request-filters .search-filter input').value.toLowerCase();
    
    // Get current data
    const data = getEmployeeData();
    
    // Collect all requests
    let allRequests = [];
    
    data.employees.forEach(employee => {
        if (employee.requests && employee.requests.length > 0) {
            // Add employee info to each request
            const employeeRequests = employee.requests.map(request => ({
                ...request,
                employeeId: employee.id,
                employeeName: `${employee.firstName} ${employee.lastName}`
            }));
            
            allRequests = [...allRequests, ...employeeRequests];
        }
    });
    
    // Apply filters
    let filteredRequests = [...allRequests];
    
    // Apply employee filter
    if (employeeFilter && employeeFilter !== 'all') {
        const employeeId = parseInt(employeeFilter);
        filteredRequests = filteredRequests.filter(request => request.employeeId === employeeId);
    }
    
    // Apply type filter
    if (typeFilter && typeFilter !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredRequests = filteredRequests.filter(request => {
            return request.employeeName.toLowerCase().includes(searchTerm) ||
                   request.notes?.toLowerCase().includes(searchTerm);
        });
    }
    
    // Sort requests by start date (most recent first)
    filteredRequests.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    // Update the table with filtered requests
    const requestsTableBody = document.querySelector('.requests-list table tbody');
    if (!requestsTableBody) return;
    
    // Clear existing rows
    requestsTableBody.innerHTML = '';
    
    // Add filtered request rows
    if (filteredRequests.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" class="empty-message">No time-off requests found matching your criteria</td>`;
        requestsTableBody.appendChild(emptyRow);
    } else {
        filteredRequests.forEach(request => {
            const row = createRequestRow(request);
            requestsTableBody.appendChild(row);
        });
    }
    
    // Update pagination
    const table = document.querySelector('.requests-list table');
    if (table) {
        table.dataset.currentPage = '1';
        updatePagination(table);
    }
}

/**
 * Update the counts in the request filters
 * @param {Array} requests - Array of all requests
 */
function updateRequestFilterCounts(requests) {
    // Update employee filter
    const employeeFilter = document.querySelector('.request-filters select:nth-of-type(1)');
    if (employeeFilter) {
        // Get unique employee IDs
        const employeeIds = [...new Set(requests.map(request => request.employeeId))];
        
        // Get current data
        const data = getEmployeeData();
        
        // Clear existing options (except "All Employees")
        while (employeeFilter.options.length > 1) {
            employeeFilter.remove(1);
        }
        
        // Add employee options
        employeeIds.forEach(id => {
            const employee = data.employees.find(emp => emp.id === id);
            if (employee) {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = `${employee.firstName} ${employee.lastName}`;
                employeeFilter.appendChild(option);
            }
        });
    }
    
    // Update type filter counts
    const typeFilter = document.querySelector('.request-filters select:nth-of-type(2)');
    if (typeFilter) {
        // Get counts by type
        const typeCounts = {
            vacation: requests.filter(req => req.type === 'vacation').length,
            personal: requests.filter(req => req.type === 'personal').length,
            sick: requests.filter(req => req.type === 'sick').length
        };
        
        // Update option text
        for (let i = 1; i < typeFilter.options.length; i++) {
            const option = typeFilter.options[i];
            const type = option.value;
            const count = typeCounts[type] || 0;
            option.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`;
        }
    }
    
    // Update status filter counts
    const statusFilter = document.querySelector('.request-filters select:nth-of-type(3)');
    if (statusFilter) {
        // Get counts by status
        const statusCounts = {
            pending: requests.filter(req => req.status === 'pending').length,
            approved: requests.filter(req => req.status === 'approved').length,
            denied: requests.filter(req => req.status === 'denied').length,
            cancelled: requests.filter(req => req.status === 'cancelled').length,
            active: requests.filter(req => req.status === 'active').length,
            completed: requests.filter(req => req.status === 'completed').length
        };
        
        // Update option text
        for (let i = 1; i < statusFilter.options.length; i++) {
            const option = statusFilter.options[i];
            const status = option.value;
            const count = statusCounts[status] || 0;
            option.textContent = `${status.charAt(0).toUpperCase() + status.slice(1)} (${count})`;
        }
    }
}

/**
 * Show time-off requests for a specific employee
 * @param {number} employeeId - ID of the employee
 */
function showEmployeeRequests(employeeId) {
    // Switch to requests section
    showSection('requests');
    
    // Set employee filter
    const employeeFilter = document.querySelector('.request-filters select:nth-of-type(1)');
    if (employeeFilter) {
        employeeFilter.value = employeeId;
    }
    
    // Load filtered requests
    loadTimeOffRequests(employeeId);
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    // Get current data
    const data = getEmployeeData();
    
    // Calculate total employees
    const totalEmployees = data.employees.length;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = totalEmployees;
    
    // Calculate employees on leave
    const employeesOnLeave = data.employees.filter(emp => emp.status === 'on-leave').length;
    document.querySelector('.stat-card:nth-child(5) .stat-value').textContent = employeesOnLeave;
    
    // Calculate pending requests
    let pendingRequests = 0;
    data.employees.forEach(employee => {
        if (employee.requests) {
            pendingRequests += employee.requests.filter(req => req.status === 'pending').length;
        }
    });
    document.querySelector('.stat-card:nth-child(6) .stat-value').textContent = pendingRequests;
    
    // Update time-off stats for current user (using first employee as example)
    if (data.employees.length > 0) {
        const currentEmployee = data.employees[0]; // Using first employee as example
        
        // Update vacation days
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = 
            `${currentEmployee.timeOff.vacation.remaining} days`;
        
        // Update personal days
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = 
            `${currentEmployee.timeOff.personal.remaining} days`;
        
        // Update sick days
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = 
            `${currentEmployee.timeOff.sick.remaining} days`;
    }
    
    // Update upcoming time-off list
    updateUpcomingTimeOff();
}

/**
 * Update the upcoming time-off list on the dashboard
 */
function updateUpcomingTimeOff() {
    const upcomingList = document.querySelector('.upcoming-time-off ul');
    if (!upcomingList) return;
    
    // Clear existing items
    upcomingList.innerHTML = '';
    
    // Get current data
    const data = getEmployeeData();
    
    // Collect all approved and active requests
    let allRequests = [];
    
    data.employees.forEach(employee => {
        if (employee.requests && employee.requests.length > 0) {
            // Filter for approved and active requests
            const approvedRequests = employee.requests.filter(req => 
                (req.status === 'approved' || req.status === 'active') && 
                new Date(req.startDate) >= new Date()
            );
            
            // Add employee info to each request
            const employeeRequests = approvedRequests.map(request => ({
                ...request,
                employeeId: employee.id,
                employeeName: `${employee.firstName} ${employee.lastName}`
            }));
            
            allRequests = [...allRequests, ...employeeRequests];
        }
    });
    
    // Sort by start date (soonest first)
    allRequests.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    // Take only the next 5 requests
    const upcomingRequests = allRequests.slice(0, 5);
    
    // Add to list
    if (upcomingRequests.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-message';
        emptyItem.textContent = 'No upcoming time-off scheduled';
        upcomingList.appendChild(emptyItem);
    } else {
        upcomingRequests.forEach(request => {
            const item = document.createElement('li');
            item.className = `time-off-item ${request.type}`;
            
            item.innerHTML = `
                <div class="time-off-icon">
                    <i class="${getTimeOffIcon(request.type)}"></i>
                </div>
                <div class="time-off-details">
                    <p class="time-off-employee">${request.employeeName}</p>
                    <p class="time-off-date">${formatDate(request.startDate)} - ${formatDate(request.endDate)}</p>
                </div>
                <div class="time-off-type">
                    <span class="request-type ${request.type}">${request.type.charAt(0).toUpperCase() + request.type.slice(1)}</span>
                </div>
            `;
            
            upcomingList.appendChild(item);
        });
    }
}

/**
 * Get the appropriate icon class for a time-off type
 * @param {string} type - Time-off type
 * @returns {string} - Font Awesome icon class
 */
function getTimeOffIcon(type) {
    switch (type) {
        case 'vacation':
            return 'fas fa-umbrella-beach';
        case 'personal':
            return 'fas fa-user-clock';
        case 'sick':
            return 'fas fa-thermometer-half';
        default:
            return 'fas fa-calendar-day';
    }
}

/**
 * Initialize calendar views
 */
function initializeCalendars() {
    // Set current month in calendar headers
    const currentDate = new Date();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const calendarHeaders = document.querySelectorAll('.calendar-header .current-month');
    calendarHeaders.forEach(header => {
        header.textContent = monthYear;
    });
    
    // Store current date in data attributes
    const calendars = document.querySelectorAll('.calendar');
    calendars.forEach(calendar => {
        calendar.dataset.year = currentDate.getFullYear();
        calendar.dataset.month = currentDate.getMonth();
    });
    
    // Generate calendars
    refreshCalendar();
}

/**
 * Navigate calendar by changing month
 * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
 */
function navigateCalendar(direction) {
    // Get all calendars
    const calendars = document.querySelectorAll('.calendar');
    
    calendars.forEach(calendar => {
        // Get current year and month
        let year = parseInt(calendar.dataset.year);
        let month = parseInt(calendar.dataset.month);
        
        // Update month
        month += direction;
        
        // Handle year change
        if (month < 0) {
            month = 11;
            year--;
        } else if (month > 11) {
            month = 0;
            year++;
        }
        
        // Update data attributes
        calendar.dataset.year = year;
        calendar.dataset.month = month;
        
        // Update header
        const monthYear = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const header = calendar.querySelector('.calendar-header .current-month');
        if (header) {
            header.textContent = monthYear;
        }
    });
    
    // Refresh calendar
    refreshCalendar();
}

/**
 * Change calendar view (month, week, day)
 * @param {string} view - View type
 */
function changeCalendarView(view) {
    const calendar = document.querySelector('#calendar .calendar');
    if (!calendar) return;
    
    // Update data attribute
    calendar.dataset.view = view;
    
    // Refresh calendar
    refreshCalendar();
}

/**
 * Refresh calendar with time-off data
 */
function refreshCalendar() {
    // Get all calendars
    const calendars = document.querySelectorAll('.calendar');
    
    // Get current data
    const data = getEmployeeData();
    
    // Collect all approved and active requests
    let allRequests = [];
    
    data.employees.forEach(employee => {
        if (employee.requests && employee.requests.length > 0) {
            // Filter for approved and active requests
            const approvedRequests = employee.requests.filter(req => 
                req.status === 'approved' || req.status === 'active'
            );
            
            // Add employee info to each request
            const employeeRequests = approvedRequests.map(request => ({
                ...request,
                employeeId: employee.id,
                employeeName: `${employee.firstName} ${employee.lastName}`
            }));
            
            allRequests = [...allRequests, ...employeeRequests];
        }
    });
    
    // Update each calendar
    calendars.forEach(calendar => {
        // Get year and month from data attributes
        const year = parseInt(calendar.dataset.year);
        const month = parseInt(calendar.dataset.month);
        
        // Get view type (default to month)
        const view = calendar.dataset.view || 'month';
        
        // Generate calendar based on view
        if (view === 'month') {
            generateMonthCalendar(calendar, year, month, allRequests);
        } else if (view === 'week') {
            generateWeekCalendar(calendar, year, month, allRequests);
        } else if (view === 'day') {
            generateDayCalendar(calendar, year, month, allRequests);
        }
    });
}

/**
 * Generate a month view calendar
 * @param {HTMLElement} calendar - Calendar element
 * @param {number} year - Year to display
 * @param {number} month - Month to display (0-11)
 * @param {Array} requests - Array of time-off requests
 */
function generateMonthCalendar(calendar, year, month, requests) {
    const calendarGrid = calendar.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing content
    calendarGrid.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Create days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
        const prevMonthDate = new Date(year, month, -firstDayOfWeek + i + 1);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day prev-month';
        dayCell.textContent = prevMonthDate.getDate();
        calendarGrid.appendChild(dayCell);
    }
    
    // Create days for current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        // Check if this is today
        const today = new Date();
        if (date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        // Add events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        // Find requests for this day
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayRequests = requests.filter(request => {
            const start = new Date(request.startDate);
            const end = new Date(request.endDate);
            return date >= start && date <= end;
        });
        
        // Add events
        dayRequests.forEach(request => {
            const event = document.createElement('div');
            event.className = `calendar-event ${request.type}`;
            event.textContent = request.employeeName;
            event.title = `${request.employeeName} - ${request.type.charAt(0).toUpperCase() + request.type.slice(1)}`;
            eventsContainer.appendChild(event);
        });
        
        dayCell.appendChild(eventsContainer);
        calendarGrid.appendChild(dayCell);
    }
    
    // Fill remaining grid with days from next month
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day next-month';
        dayCell.textContent = day;
        calendarGrid.appendChild(dayCell);
    }
}

/**
 * Generate a week view calendar
 * @param {HTMLElement} calendar - Calendar element
 * @param {number} year - Year to display
 * @param {number} month - Month to display (0-11)
 * @param {Array} requests - Array of time-off requests
 */
function generateWeekCalendar(calendar, year, month, requests) {
    const calendarGrid = calendar.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing content
    calendarGrid.innerHTML = '';
    
    // Get current date
    const currentDate = new Date();
    
    // Find the first day of the week containing the 1st of the month
    // or the current date if we're viewing the current month
    let startDate;
    if (year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        // Current month - use current date
        startDate = new Date(currentDate);
    } else {
        // Other month - use 1st of month
        startDate = new Date(year, month, 1);
    }
    
    // Adjust to start of week (Sunday)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Create day headers
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Create week view
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day week-view';
        
        // Check if this is today
        const today = new Date();
        if (date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        // Check if this is in a different month
        if (date.getMonth() !== month) {
            dayCell.classList.add('other-month');
        }
        
        // Add day number and month
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
        dayCell.appendChild(dayHeader);
        
        // Add events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        // Find requests for this day
        const dayRequests = requests.filter(request => {
            const start = new Date(request.startDate);
            const end = new Date(request.endDate);
            return date >= start && date <= end;
        });
        
        // Add events
        dayRequests.forEach(request => {
            const event = document.createElement('div');
            event.className = `calendar-event ${request.type}`;
            event.innerHTML = `
                <span class="event-time">${request.type.charAt(0).toUpperCase() + request.type.slice(1)}</span>
                <span class="event-title">${request.employeeName}</span>
            `;
            eventsContainer.appendChild(event);
        });
        
        dayCell.appendChild(eventsContainer);
        calendarGrid.appendChild(dayCell);
    }
}

/**
 * Generate a day view calendar
 * @param {HTMLElement} calendar - Calendar element
 * @param {number} year - Year to display
 * @param {number} month - Month to display (0-11)
 * @param {Array} requests - Array of time-off requests
 */
function generateDayCalendar(calendar, year, month, requests) {
    const calendarGrid = calendar.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing content
    calendarGrid.innerHTML = '';
    
    // Get current date
    const currentDate = new Date();
    
    // Use current date if we're viewing the current month, otherwise use 1st of month
    let viewDate;
    if (year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        // Current month - use current date
        viewDate = new Date(currentDate);
    } else {
        // Other month - use 1st of month
        viewDate = new Date(year, month, 1);
    }
    
    // Create day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header full-width';
    dayHeader.textContent = viewDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    calendarGrid.appendChild(dayHeader);
    
    // Create day view
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day day-view';
    
    // Add events container
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'day-events';
    
    // Find requests for this day
    const dayRequests = requests.filter(request => {
        const start = new Date(request.startDate);
        const end = new Date(request.endDate);
        return viewDate >= start && viewDate <= end;
    });
    
    // Add events
    if (dayRequests.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'no-events';
        noEvents.textContent = 'No time-off scheduled for this day';
        eventsContainer.appendChild(noEvents);
    } else {
        dayRequests.forEach(request => {
            const event = document.createElement('div');
            event.className = `calendar-event ${request.type} detailed`;
            
            event.innerHTML = `
                <div class="event-icon">
                    <i class="${getTimeOffIcon(request.type)}"></i>
                </div>
                <div class="event-details">
                    <h4>${request.employeeName}</h4>
                    <p><strong>${request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave</strong></p>
                    <p>${formatDate(request.startDate)} - ${formatDate(request.endDate)} (${request.days} days)</p>
                    ${request.notes ? `<p class="event-notes">${request.notes}</p>` : ''}
                </div>
            `;
            
            eventsContainer.appendChild(event);
        });
    }
    
    dayCell.appendChild(eventsContainer);
    calendarGrid.appendChild(dayCell);
}