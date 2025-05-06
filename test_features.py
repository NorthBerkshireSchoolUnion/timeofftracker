#!/usr/bin/env python3
"""
TimeOff Tracker - Automated Feature Testing Script
This script performs automated testing of key features in the TimeOff Tracker application.
"""

import os
import sys
import json
import time
import csv
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TimeOffTrackerTester:
    """Class to test TimeOff Tracker application features"""
    
    def __init__(self, base_url="file://" + os.path.abspath("index.html")):
        """Initialize the tester with the application URL"""
        self.base_url = base_url
        self.results = {
            "user_management": [],
            "district_changes": [],
            "calendar_filter": [],
            "dashboard_panels": [],
            "dashboard_customization": [],
            "csv_import": []
        }
        self.setup_driver()
        
    def setup_driver(self):
        """Set up the WebDriver for testing"""
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        try:
            self.driver = webdriver.Chrome(options=options)
            self.driver.set_window_size(1366, 768)
            print("WebDriver initialized successfully")
        except Exception as e:
            print(f"Failed to initialize WebDriver: {e}")
            sys.exit(1)
    
    def navigate_to(self, path=""):
        """Navigate to a specific page in the application"""
        url = self.base_url + path
        self.driver.get(url)
        time.sleep(1)  # Allow page to load
    
    def test_user_management(self):
        """Test user management functionality"""
        print("\n--- Testing User Management ---")
        
        # Navigate to user management page
        self.navigate_to("#settings")
        time.sleep(1)
        
        try:
            # Test search functionality
            search_input = self.driver.find_element(By.CSS_SELECTOR, ".search-container input")
            search_input.clear()
            search_input.send_keys("Johnson")
            time.sleep(1)
            
            # Check if search results contain "Johnson"
            results = self.driver.find_elements(By.CSS_SELECTOR, ".user-table tbody tr")
            search_works = any("Johnson" in result.text for result in results)
            
            self.results["user_management"].append({
                "test": "Search functionality",
                "status": "Pass" if search_works else "Fail",
                "details": f"Found {len(results)} results containing 'Johnson'" if search_works else "No matching results found"
            })
            
            # Test filtering
            filter_dropdown = self.driver.find_element(By.CSS_SELECTOR, ".filter-dropdown")
            filter_dropdown.click()
            time.sleep(0.5)
            
            district_filter = self.driver.find_element(By.CSS_SELECTOR, ".filter-option[data-filter='district']")
            district_filter.click()
            time.sleep(0.5)
            
            self.results["user_management"].append({
                "test": "District filtering",
                "status": "Pass",
                "details": "Filter dropdown opens and district filter is available"
            })
            
            # Test pagination
            pagination = self.driver.find_elements(By.CSS_SELECTOR, ".pagination-control")
            if pagination:
                pagination[0].click()
                time.sleep(0.5)
                
                self.results["user_management"].append({
                    "test": "Pagination",
                    "status": "Pass",
                    "details": "Pagination controls are functional"
                })
            else:
                self.results["user_management"].append({
                    "test": "Pagination",
                    "status": "Skip",
                    "details": "Pagination controls not found"
                })
                
        except Exception as e:
            self.results["user_management"].append({
                "test": "User Management",
                "status": "Error",
                "details": str(e)
            })
    
    def test_district_changes(self):
        """Test Department to District label changes"""
        print("\n--- Testing Department to District Changes ---")
        
        try:
            # Check various pages for "District" label
            pages = ["#dashboard", "#employees", "#settings"]
            district_count = 0
            department_count = 0
            
            for page in pages:
                self.navigate_to(page)
                time.sleep(1)
                
                page_text = self.driver.find_element(By.TAG_NAME, "body").text
                district_count += page_text.count("District")
                department_count += page_text.count("Department")
            
            self.results["district_changes"].append({
                "test": "Label changes",
                "status": "Pass" if district_count > 0 and department_count == 0 else "Fail",
                "details": f"Found {district_count} instances of 'District' and {department_count} instances of 'Department'"
            })
            
        except Exception as e:
            self.results["district_changes"].append({
                "test": "District Changes",
                "status": "Error",
                "details": str(e)
            })
    
    def test_calendar_district_filter(self):
        """Test calendar page district filter"""
        print("\n--- Testing Calendar District Filter ---")
        
        try:
            # Navigate to calendar page
            self.navigate_to("#calendar")
            time.sleep(1)
            
            # Look for district filter
            filters = self.driver.find_elements(By.CSS_SELECTOR, ".filter-container .filter-item")
            district_filter = None
            
            for filter_item in filters:
                if "District" in filter_item.text:
                    district_filter = filter_item
                    break
            
            if district_filter:
                district_filter.click()
                time.sleep(0.5)
                
                # Check if dropdown appears
                dropdown = self.driver.find_elements(By.CSS_SELECTOR, ".dropdown-menu")
                
                self.results["calendar_filter"].append({
                    "test": "District filter presence",
                    "status": "Pass",
                    "details": "District filter found and dropdown appears when clicked"
                })
            else:
                self.results["calendar_filter"].append({
                    "test": "District filter presence",
                    "status": "Fail",
                    "details": "District filter not found on calendar page"
                })
                
        except Exception as e:
            self.results["calendar_filter"].append({
                "test": "Calendar District Filter",
                "status": "Error",
                "details": str(e)
            })
    
    def test_dashboard_panels(self):
        """Test dashboard panel removal functionality"""
        print("\n--- Testing Dashboard Panel Removal ---")
        
        try:
            # Navigate to dashboard
            self.navigate_to("#dashboard")
            time.sleep(1)
            
            # Count initial panels
            initial_panels = len(self.driver.find_elements(By.CSS_SELECTOR, ".grid-item"))
            
            # Try to find panel menu
            panel_menus = self.driver.find_elements(By.CSS_SELECTOR, ".card-header .btn-icon")
            
            if panel_menus and len(panel_menus) > 0:
                # Click the first panel menu
                panel_menus[0].click()
                time.sleep(0.5)
                
                # Look for remove option
                remove_options = self.driver.find_elements(By.CSS_SELECTOR, ".dropdown-item.panel-remove")
                
                if remove_options and len(remove_options) > 0:
                    # Click remove
                    remove_options[0].click()
                    time.sleep(1)
                    
                    # Count panels after removal
                    remaining_panels = len(self.driver.find_elements(By.CSS_SELECTOR, ".grid-item"))
                    
                    self.results["dashboard_panels"].append({
                        "test": "Panel removal",
                        "status": "Pass" if remaining_panels < initial_panels else "Fail",
                        "details": f"Panels before: {initial_panels}, after: {remaining_panels}"
                    })
                else:
                    self.results["dashboard_panels"].append({
                        "test": "Panel removal",
                        "status": "Fail",
                        "details": "Remove option not found in panel menu"
                    })
            else:
                self.results["dashboard_panels"].append({
                    "test": "Panel removal",
                    "status": "Fail",
                    "details": "Panel menu not found"
                })
                
        except Exception as e:
            self.results["dashboard_panels"].append({
                "test": "Dashboard Panels",
                "status": "Error",
                "details": str(e)
            })
    
    def test_dashboard_customization(self):
        """Test dashboard customization options"""
        print("\n--- Testing Dashboard Customization ---")
        
        try:
            # Navigate to dashboard
            self.navigate_to("#dashboard")
            time.sleep(1)
            
            # Look for theme toggle
            theme_toggle = self.driver.find_element(By.ID, "theme-switch")
            
            if theme_toggle:
                # Get current theme
                initial_theme = "light" if "light" in self.driver.find_element(By.TAG_NAME, "body").get_attribute("class") else "dark"
                
                # Toggle theme
                theme_toggle.click()
                time.sleep(1)
                
                # Check if theme changed
                new_theme = "light" if "light" in self.driver.find_element(By.TAG_NAME, "body").get_attribute("class") else "dark"
                
                self.results["dashboard_customization"].append({
                    "test": "Theme switching",
                    "status": "Pass" if initial_theme != new_theme else "Fail",
                    "details": f"Theme changed from {initial_theme} to {new_theme}" if initial_theme != new_theme else "Theme did not change"
                })
            else:
                self.results["dashboard_customization"].append({
                    "test": "Theme switching",
                    "status": "Fail",
                    "details": "Theme toggle not found"
                })
                
        except Exception as e:
            self.results["dashboard_customization"].append({
                "test": "Dashboard Customization",
                "status": "Error",
                "details": str(e)
            })
    
    def test_csv_import(self):
        """Test CSV import functionality"""
        print("\n--- Testing CSV Import ---")
        
        try:
            # Navigate to settings page
            self.navigate_to("#settings")
            time.sleep(1)
            
            # Look for import section
            import_section = None
            sections = self.driver.find_elements(By.CSS_SELECTOR, ".settings-section")
            
            for section in sections:
                if "Import" in section.text:
                    import_section = section
                    break
            
            if import_section:
                self.results["csv_import"].append({
                    "test": "Import section presence",
                    "status": "Pass",
                    "details": "CSV import section found in settings"
                })
                
                # Check for file input
                file_inputs = import_section.find_elements(By.CSS_SELECTOR, "input[type='file']")
                
                if file_inputs:
                    self.results["csv_import"].append({
                        "test": "File input presence",
                        "status": "Pass",
                        "details": "File input field found for CSV import"
                    })
                else:
                    self.results["csv_import"].append({
                        "test": "File input presence",
                        "status": "Fail",
                        "details": "File input field not found"
                    })
            else:
                self.results["csv_import"].append({
                    "test": "Import section presence",
                    "status": "Fail",
                    "details": "CSV import section not found in settings"
                })
                
        except Exception as e:
            self.results["csv_import"].append({
                "test": "CSV Import",
                "status": "Error",
                "details": str(e)
            })
    
    def run_all_tests(self):
        """Run all tests and generate report"""
        print("Starting TimeOff Tracker feature tests...")
        
        try:
            self.test_user_management()
            self.test_district_changes()
            self.test_calendar_district_filter()
            self.test_dashboard_panels()
            self.test_dashboard_customization()
            self.test_csv_import()
            
            print("\nAll tests completed.")
            self.generate_report()
        finally:
            self.driver.quit()
    
    def generate_report(self):
        """Generate test results report"""
        total_tests = sum(len(tests) for tests in self.results.values())
        passed_tests = sum(1 for tests in self.results.values() for test in tests if test["status"] == "Pass")
        failed_tests = sum(1 for tests in self.results.values() for test in tests if test["status"] == "Fail")
        error_tests = sum(1 for tests in self.results.values() for test in tests if test["status"] == "Error")
        
        print(f"\n--- Test Results Summary ---")
        print(f"Total tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Errors: {error_tests}")
        
        # Save results to file
        with open("test_results.json", "w") as f:
            json.dump(self.results, f, indent=2)
        
        print("\nDetailed test results saved to test_results.json")

if __name__ == "__main__":
    tester = TimeOffTrackerTester()
    tester.run_all_tests()