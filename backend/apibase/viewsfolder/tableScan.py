import cv2
import pytesseract
import re
import numpy as np

def scanTable(image_path):
    # Load the image
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply adaptive thresholding for better table detection
    binary = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)

    # Apply edge detection (Canny)
    edges = cv2.Canny(binary, 50, 150)

    # Dilate edges to make lines thicker
    kernel = np.ones((3, 3), np.uint8)
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
    table_crop = gray[y:y + h, x:x + w]

    # Enhance the cropped image for better OCR accuracy
    enhanced_crop = cv2.GaussianBlur(table_crop, (3, 3), 0)
    _, enhanced_crop = cv2.threshold(enhanced_crop, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Extract text using OCR with custom configuration
    custom_config = r'--oem 1 --psm 11 -c '
    extracted_text = pytesseract.image_to_string(table_crop, )

    # If multiple tables exist, extract text after "SPRING"
    if "Academic Year / Period: 2024-2025 / SPRING" in extracted_text:
        extracted_text = extracted_text.split("Academic Year / Period: 2024-2025 / SPRING")[-1]

    # Preprocess the extracted text
    lines = extracted_text.splitlines()
    cleaned_lines = [line.strip() for line in lines if line.strip() and not line.strip().lower() in ["code", "course name", "gpa", "standing", "copa"]]
    print(cleaned_lines)
    # Separate course codes and names
    course_codes = []
    course_names = []
    for line in cleaned_lines:
        if re.match(r"[A-Z]{4}[\w]{3}", line):  # Match course codes (e.g., MATH141 or MATHISI)
            course_codes.append(line)
        elif "(" in line and "G" in line:  # Match course names with G numbers
            course_names.append(line)

    # Pair course codes with names
    courses = list(zip(course_codes, course_names))

    # Process each course
    course_list = []
    for code, name in courses:
        # Extract G number using regex
        g_match = re.search(r"\(G(\d|i|I)\)", name)
        if g_match:
            g_number = g_match.group(1).lower()  # Normalize to lowercase
            if g_number == "i":
                g_number = 1  # Assume 'i' or 'I' represents 1
            g_number = int(g_number)

            # Validate G number (must be between 1 and 5)
            if 1 <= g_number <= 5:
                probability = 0.9 if g_number == 1 else 0.1  # Adjust probabilities as needed
                course_list.append({
                    "code": code,
                    "name": name.split("(")[0].strip(),  # Remove G number from name
                    "G_number": g_number,
                    "probability": probability
                })

    # Print the result
    for course in course_list:
        print(course)

    return course_list