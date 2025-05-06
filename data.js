/**
 * TimeOff Tracker - Data Module
 * Contains data structures and sample data for the application
 */

// Employee data structure and sample data
const employeeData = {
    // Sample employees with varied time-off balances
    employees: [
        {
            id: 1,
            firstName: "Alex",
            lastName: "Johnson",
            email: "alex.j@company.com",
            department: "engineering",
            position: "Senior Developer",
            startDate: "2020-03-15",
            status: "active",
            timeOff: {
                vacation: {
                    total: 20,
                    used: 6,
                    remaining: 14
                },
                personal: {
                    total: 5,
                    used: 0,
                    remaining: 5
                },
                sick: {
                    total: 10,
                    used: 2,
                    remaining: 8
                }
            },
            requests: [
                {
                    id: 101,
                    type: "vacation",
                    startDate: "2025-06-10",
                    endDate: "2025-06-16",
                    days: 5,
                    status: "approved",
                    requestDate: "2025-04-15",
                    notes: "Summer vacation"
                },
                {
                    id: 105,
                    type: "vacation",
                    startDate: "2025-08-05",
                    endDate: "2025-08-09",
                    days: 5,
                    status: "pending",
                    requestDate: "2025-05-01",
                    notes: "Family reunion"
                }
            ]
        },
        {
            id: 2,
            firstName: "Sarah",
            lastName: "Miller",
            email: "sarah.m@company.com",
            department: "marketing",
            position: "Marketing Manager",
            startDate: "2019-08-01",
            status: "active",
            timeOff: {
                vacation: {
                    total: 25,
                    used: 10,
                    remaining: 15
                },
                personal: {
                    total: 5,
                    used: 2,
                    remaining: 3
                },
                sick: {
                    total: 10,
                    used: 1,
                    remaining: 9
                }
            },
            requests: [
                {
                    id: 102,
                    type: "personal",
                    startDate: "2025-05-20",
                    endDate: "2025-05-20",
                    days: 1,
                    status: "approved",
                    requestDate: "2025-05-01",
                    notes: "Family appointment"
                },
                {
                    id: 106,
                    type: "sick",
                    startDate: "2025-05-10",
                    endDate: "2025-05-10",
                    days: 1,
                    status: "completed",
                    requestDate: "2025-05-10",
                    notes: "Doctor appointment"
                }
            ]
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.c@company.com",
            department: "sales",
            position: "Sales Representative",
            startDate: "2021-02-10",
            status: "on-leave",
            timeOff: {
                vacation: {
                    total: 15,
                    used: 15,
                    remaining: 0
                },
                personal: {
                    total: 5,
                    used: 1,
                    remaining: 4
                },
                sick: {
                    total: 10,
                    used: 3,
                    remaining: 7
                }
            },
            requests: [
                {
                    id: 103,
                    type: "vacation",
                    startDate: "2025-05-01",
                    endDate: "2025-05-15",
                    days: 11,
                    status: "active",
                    requestDate: "2025-03-20",
                    notes: "Family vacation"
                },
                {
                    id: 107,
                    type: "personal",
                    startDate: "2025-06-01",
                    endDate: "2025-06-01",
                    days: 1,
                    status: "pending",
                    requestDate: "2025-05-02",
                    notes: "Personal matter"
                }
            ]
        },
        {
            id: 4,
            firstName: "Jessica",
            lastName: "Taylor",
            email: "jessica.t@company.com",
            department: "hr",
            position: "HR Specialist",
            startDate: "2018-11-05",
            status: "active",
            timeOff: {
                vacation: {
                    total: 25,
                    used: 5,
                    remaining: 20
                },
                personal: {
                    total: 5,
                    used: 0,
                    remaining: 5
                },
                sick: {
                    total: 10,
                    used: 0,
                    remaining: 10
                }
            },
            requests: [
                {
                    id: 108,
                    type: "vacation",
                    startDate: "2025-07-15",
                    endDate: "2025-07-26",
                    days: 10,
                    status: "pending",
                    requestDate: "2025-05-03",
                    notes: "Summer holiday"
                }
            ]
        },
        {
            id: 5,
            firstName: "David",
            lastName: "Wilson",
            email: "david.w@company.com",
            department: "engineering",
            position: "QA Engineer",
            startDate: "2022-01-15",
            status: "active",
            timeOff: {
                vacation: {
                    total: 15,
                    used: 0,
                    remaining: 15
                },
                personal: {
                    total: 5,
                    used: 1,
                    remaining: 4
                },
                sick: {
                    total: 10,
                    used: 5,
                    remaining: 5
                }
            },
            requests: [
                {
                    id: 104,
                    type: "sick",
                    startDate: "2025-04-10",
                    endDate: "2025-04-12",
                    days: 3,
                    status: "completed",
                    requestDate: "2025-04-10",
                    notes: "Flu"
                },
                {
                    id: 109,
                    type: "sick",
                    startDate: "2025-05-05",
                    endDate: "2025-05-07",
                    days: 3,
                    status: "completed",
                    requestDate: "2025-05-05",
                    notes: "Cold"
                }
            ]
        },
        {
            id: 6,
            firstName: "Emily",
            lastName: "Garcia",
            email: "emily.g@company.com",
            department: "finance",
            position: "Financial Analyst",
            startDate: "2021-06-15",
            status: "active",
            timeOff: {
                vacation: {
                    total: 18,
                    used: 8,
                    remaining: 10
                },
                personal: {
                    total: 5,
                    used: 2,
                    remaining: 3
                },
                sick: {
                    total: 10,
                    used: 0,
                    remaining: 10
                }
            },
            requests: [
                {
                    id: 110,
                    type: "vacation",
                    startDate: "2025-09-01",
                    endDate: "2025-09-05",
                    days: 5,
                    status: "approved",
                    requestDate: "2025-04-20",
                    notes: "Labor Day week"
                },
                {
                    id: 111,
                    type: "vacation",
                    startDate: "2025-12-22",
                    endDate: "2025-12-26",
                    days: 3,
                    status: "pending",
                    requestDate: "2025-05-04",
                    notes: "Christmas holiday"
                }
            ]
        }
    ],
    
    // Time-off request statuses
    requestStatuses: ["pending", "approved", "denied", "cancelled", "active", "completed"],
    
    // Department options
    departments: ["engineering", "marketing", "sales", "hr", "finance", "operations"],
    
    // Employee statuses
    employeeStatuses: ["active", "on-leave", "inactive"],
    
    // Time-off types
    timeOffTypes: [
        {
            id: "vacation",
            name: "Vacation",
            description: "Planned time off for holidays, travel, or personal enjoyment",
            icon: "umbrella-beach",
            color: "#4CAF50"
        },
        {
            id: "personal",
            name: "Personal",
            description: "Time off for personal matters such as appointments or family events",
            icon: "user-clock",
            color: "#2196F3"
        },
        {
            id: "sick",
            name: "Sick",
            description: "Time off due to illness or medical appointments",
            icon: "thermometer-half",
            color: "#FF5722"
        }
    ],
    
    // Historical time-off usage by month (for reporting)
    timeOffHistory: {
        "2025-01": { vacation: 15, personal: 3, sick: 8 },
        "2025-02": { vacation: 12, personal: 5, sick: 10 },
        "2025-03": { vacation: 8, personal: 2, sick: 12 },
        "2025-04": { vacation: 10, personal: 4, sick: 7 },
        "2025-05": { vacation: 20, personal: 6, sick: 5 }
    }
};

// Default time-off allocation for new employees
const defaultTimeOffAllocation = {
    vacation: {
        total: 15,
        used: 0,
        remaining: 15
    },
    personal: {
        total: 5,
        used: 0,
        remaining: 5
    },
    sick: {
        total: 10,
        used: 0,
        remaining: 10
    }
};

// Time-off policy settings
const timeOffPolicies = {
    minAdvanceNotice: {
        vacation: 14, // days
        personal: 2,  // days
        sick: 0       // days
    },
    maxConsecutiveDays: {
        vacation: 15,
        personal: 2,
        sick: 5
    },
    accrualRates: {
        vacation: {
            lessThan2Years: 10,
            between2And5Years: 15,
            moreThan5Years: 20
        },
        personal: {
            standard: 5
        },
        sick: {
            standard: 10
        }
    },
    carryOverLimits: {
        vacation: 5,
        personal: 0,
        sick: 3
    }
};

// Initialize local storage with sample data if not already present
function initializeData() {
    if (!localStorage.getItem('employeeData')) {
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
    }
    return getEmployeeData();
}

// Get employee data from local storage
function getEmployeeData() {
    const data = JSON.parse(localStorage.getItem('employeeData')) || employeeData;
    return data;
}

// Save employee data to local storage
function saveEmployeeData(data) {
    localStorage.setItem('employeeData', JSON.stringify(data));
}

// Calculate time-off statistics
function calculateTimeOffStatistics() {
    const data = getEmployeeData();
    const stats = {
        totalEmployees: data.employees.length,
        employeesOnLeave: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        totalByType: {
            vacation: { total: 0, used: 0, remaining: 0 },
            personal: { total: 0, used: 0, remaining: 0 },
            sick: { total: 0, used: 0, remaining: 0 }
        }
    };
    
    // Calculate statistics
    data.employees.forEach(employee => {
        // Count employees on leave
        if (employee.status === 'on-leave') {
            stats.employeesOnLeave++;
        }
        
        // Count requests by status
        if (employee.requests) {
            employee.requests.forEach(request => {
                if (request.status === 'pending') {
                    stats.pendingRequests++;
                } else if (request.status === 'approved' || request.status === 'active') {
                    stats.approvedRequests++;
                }
            });
        }
        
        // Sum time-off totals
        for (const type in employee.timeOff) {
            stats.totalByType[type].total += employee.timeOff[type].total;
            stats.totalByType[type].used += employee.timeOff[type].used;
            stats.totalByType[type].remaining += employee.timeOff[type].remaining;
        }
    });
    
    return stats;
}

// Get time-off history for reporting
function getTimeOffHistory() {
    const data = getEmployeeData();
    const history = { ...data.timeOffHistory };
    
    // Calculate current month usage
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Initialize current month if not exists
    if (!history[currentMonth]) {
        history[currentMonth] = { vacation: 0, personal: 0, sick: 0 };
    }
    
    // Calculate usage from active and completed requests in current month
    data.employees.forEach(employee => {
        if (employee.requests) {
            employee.requests.forEach(request => {
                if ((request.status === 'completed' || request.status === 'active') && 
                    request.startDate.startsWith(currentMonth.substring(0, 7))) {
                    history[currentMonth][request.type] += request.days;
                }
            });
        }
    });
    
    return history;
}

// Calculate time-off balance for an employee
function calculateTimeOffBalance(employee) {
    // Deep copy the employee's time-off data
    const timeOff = JSON.parse(JSON.stringify(employee.timeOff));
    
    // Get pending requests that will affect balances when approved
    const pendingRequests = employee.requests ? 
        employee.requests.filter(req => req.status === 'pending') : [];
    
    // Calculate potential impact of pending requests
    const pendingImpact = {
        vacation: 0,
        personal: 0,
        sick: 0
    };
    
    pendingRequests.forEach(request => {
        pendingImpact[request.type] += request.days;
    });
    
    // Add pending impact information
    for (const type in timeOff) {
        timeOff[type].pending = pendingImpact[type];
        timeOff[type].availableIfApproved = timeOff[type].remaining - pendingImpact[type];
    }
    
    return timeOff;
}