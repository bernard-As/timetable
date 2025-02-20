import cv2
import pytesseract
import re
import numpy as np
def scanTable(image_path):
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding for better table detection
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    
    # Apply edge detection (Canny)
    edges = cv2.Canny(binary, 50, 150)
    
    # Dilate edges to make lines thicker
    kernel = np.ones((3,3), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=2)
    
    # Detect table contours using OpenCV
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find bounding boxes of potential tables
    table_areas = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 300 and h > 50:  # Ensure it's a valid table
            table_areas.append((x, y, w, h))
    
    # Sort tables by vertical position (Y-axis)
    table_areas = sorted(table_areas, key=lambda b: b[1])
    
    # Determine which table to process
    if len(table_areas) >= 2:
        x, y, w, h = table_areas[1]  # Second table
    elif len(table_areas) == 1:
        x, y, w, h = table_areas[0]  # Only one table available
    else:
        print("No tables detected. Try adjusting threshold values.")
        exit()
    
    # Crop the selected table
    table_crop = gray[y:y+h, x:x+w]
    
    # Extract text using OCR
    extracted_text = pytesseract.image_to_string(table_crop)
    
    # If multiple tables exist, extract text after "SPRING"
    if "Academic Year / Period: 2024-2025 / SPRING" in extracted_text:
        extracted_text = extracted_text.split("Academic Year / Period: 2024-2025 / SPRING")[-1]
    
    # Extract only course codes (e.g., MATH141, SOFE105)
    course_codes = re.findall(r"\b[A-Z]{4}\d{3}\b", extracted_text)
    
    print("Extracted Course Codes:", course_codes)