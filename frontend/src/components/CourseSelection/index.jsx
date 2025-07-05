import React, { useState, useEffect } from "react";
import {
	Card,
	Input,
	Button,
	Form,
	Typography,
	Space,
	message,
	Tag,
	Row,
	Col,
	Divider,
	Alert,
	Skeleton,
	List,
	Empty,
} from "antd";
import {
	SearchOutlined,
	UserOutlined,
	BookOutlined,
	ReloadOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import { courseService } from "./courseService";

const { Title, Text } = Typography;

const CourseSelection = () => {
	const [form] = Form.useForm();
	const [selectedCourses, setSelectedCourses] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [availableCourses, setAvailableCourses] = useState([]);
	const [coursesLoading, setCoursesLoading] = useState(true);
	const [coursesError, setCoursesError] = useState(null);

	// Fetch courses on component mount
	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		setCoursesLoading(true);
		setCoursesError(null);
		try {
			const courses = await courseService.getAvailableCourses();
			setAvailableCourses(courses);
		} catch (error) {
			setCoursesError(error.message);
			message.error(error.message);
		} finally {
			setCoursesLoading(false);
		}
	};

	const handleCourseSelect = (course) => {
		if (!selectedCourses.find((c) => c.code === course.code)) {
			setSelectedCourses([...selectedCourses, course]);
			message.success(`${course.code} added to selection`);
		}
	};

	const handleCourseRemove = (courseCode) => {
		setSelectedCourses(selectedCourses.filter((c) => c.code !== courseCode));
		message.info(`Course removed from selection`);
	};

	const handleSubmit = async (values) => {
		if (selectedCourses.length === 0) {
			message.warning("Please select at least one course");
			return;
		}

		setLoading(true);
		try {
			const result = await courseService.submitCourseSelection(
				values.studentNumber,
				selectedCourses
			);

			console.log("Student Number:", values.studentNumber);
			console.log("Selected Courses:", selectedCourses);
			console.log("Registration ID:", result.registrationId);

			message.success(result.message);

			// Reset form after successful submission
			form.resetFields();
			setSelectedCourses([]);
		} catch (error) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleRetryFetch = () => {
		fetchCourses();
	};

	const filteredCourses = availableCourses.filter(
		(course) =>
			course.code.toLowerCase().includes(searchValue.toLowerCase()) ||
			course.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			course.department.toLowerCase().includes(searchValue.toLowerCase())
	);

	// Group courses by department for better organization
	const coursesByDepartment = filteredCourses.reduce((acc, course) => {
		const dept = course.department || "Other";
		if (!acc[dept]) acc[dept] = [];
		acc[dept].push(course);
		return acc;
	}, {});

	const isSelected = (courseCode) => {
		return selectedCourses.some((c) => c.code === courseCode);
	};

	return (
		<div
			className="course-selection"
			style={{ padding: "16px", maxWidth: "1000px", margin: "0 auto" }}>
			<Card>
				<Title
					level={2}
					style={{
						textAlign: "center",
						marginBottom: "16px",
						fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
					}}>
					<BookOutlined /> Summer School Course Selection
				</Title>
				<Text
					type="secondary"
					style={{
						display: "block",
						textAlign: "center",
						marginBottom: "24px",
						fontSize: "clamp(0.875rem, 3vw, 1rem)",
					}}>
					Choose from a variety of courses to enhance your learning experience
					this summer.
				</Text>

				{coursesError && (
					<Alert
						message="Error Loading Courses"
						description={coursesError}
						type="error"
						action={
							<Button
								size="small"
								onClick={handleRetryFetch}>
								<ReloadOutlined /> Retry
							</Button>
						}
						style={{ marginBottom: "24px" }}
						showIcon
					/>
				)}

				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					requiredMark={false}>
					{/* Student Number Input */}
					<Form.Item
						label="Student Number"
						name="studentNumber"
						rules={[
							{ required: true, message: "Please enter your student number" },
							{
								pattern: /^\d+$/,
								message: "Student number must contain only numbers",
							},
						]}>
						<Input
							prefix={<UserOutlined />}
							placeholder="Enter your student number"
							size="large"
						/>
					</Form.Item>

					<Divider style={{ margin: "16px 0" }} />

					{/* Course Search and Selection */}
					<Row gutter={[16, 16]}>
						<Col
							xs={24}
							lg={14}>
							<Space
								direction="vertical"
								style={{ width: "100%" }}
								size="middle">
								<Text
									strong
									style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
									Available Courses:
								</Text>
								<Input
									prefix={<SearchOutlined />}
									placeholder="Search by course code, name, or department"
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									size="large"
									disabled={coursesLoading}
									allowClear
								/>

								{coursesLoading ? (
									<Skeleton
										active
										paragraph={{ rows: 4 }}
									/>
								) : coursesError ? (
									<Empty
										description="Failed to load courses"
										image={Empty.PRESENTED_IMAGE_SIMPLE}
									/>
								) : (
									<div
										style={{
											border: "1px solid #d9d9d9",
											borderRadius: "6px",
											maxHeight: "400px",
											overflow: "auto", // Changed from "hidden" to "auto"
										}}>
										{Object.keys(coursesByDepartment).length === 0 ? (
											<Empty
												description="No courses found"
												image={Empty.PRESENTED_IMAGE_SIMPLE}
												style={{ padding: "40px 20px" }}
											/>
										) : (
											Object.entries(coursesByDepartment).map(
												([department, courses]) => (
													<div key={department}>
														<div
															style={{
																background: "#f5f5f5",
																padding: "8px 16px",
																borderBottom: "1px solid #d9d9d9",
																fontWeight: "bold",
																fontSize: "0.9rem",
																color: "#595959",
																position: "sticky", // Make department headers sticky
																top: 0,
																zIndex: 1,
															}}>
															{department} ({courses.length})
														</div>
														<List
															dataSource={courses}
															renderItem={(course) => (
																<List.Item
																	style={{
																		padding: "12px 16px",
																		cursor: isSelected(course.code)
																			? "default"
																			: "pointer",
																		backgroundColor: isSelected(course.code)
																			? "#f6ffed"
																			: "transparent",
																		borderBottom: "1px solid #f0f0f0",
																		opacity: isSelected(course.code) ? 0.7 : 1,
																	}}
																	onClick={() =>
																		!isSelected(course.code) &&
																		handleCourseSelect(course)
																	}
																	actions={[
																		<Button
																			key="add"
																			type={
																				isSelected(course.code)
																					? "default"
																					: "primary"
																			}
																			size="small"
																			icon={<PlusOutlined />}
																			disabled={isSelected(course.code)}
																			onClick={(e) => {
																				e.stopPropagation();
																				handleCourseSelect(course);
																			}}>
																			{isSelected(course.code)
																				? "Added"
																				: "Add"}
																		</Button>,
																	]}>
																	<List.Item.Meta
																		title={
																			<div
																				style={{
																					display: "flex",
																					alignItems: "center",
																					gap: "8px",
																					flexWrap: "wrap",
																				}}>
																				<Tag color="blue">{course.code}</Tag>
																				<Tag
																					color="green"
																					size="small">
																					{course.department}
																				</Tag>
																			</div>
																		}
																		description={
																			<Text
																				style={{
																					fontSize: "0.875rem",
																					color: "#595959",
																				}}>
																				{course.name}{" "}(choosed {course.student_count} time(s))
																			</Text>
																		}
																	/>
																</List.Item>
															)}
														/>
													</div>
												)
											)
										)}
									</div>
								)}

								{!coursesLoading && availableCourses.length > 0 && (
									<Text
										type="secondary"
										style={{ fontSize: "0.8rem" }}>
										{filteredCourses.length} of {availableCourses.length}{" "}
										courses shown
									</Text>
								)}
							</Space>
						</Col>

						<Col
							xs={24}
							lg={10}>
							<Space
								direction="vertical"
								style={{ width: "100%" }}
								size="middle">
								<Text
									strong
									style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
									Selected Courses ({selectedCourses.length}):
								</Text>
								<div
									style={{
										minHeight: "200px",
										maxHeight: "400px",
										border: "1px dashed #d9d9d9",
										borderRadius: "6px",
										padding: "12px",
										backgroundColor: "#fafafa",
										overflow: "auto",
									}}>
									{selectedCourses.length === 0 ? (
										<Empty
											description="No courses selected yet"
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											style={{ padding: "40px 20px" }}
										/>
									) : (
										<Space
											direction="vertical"
											style={{ width: "100%" }}
											size="small">
											{selectedCourses.map((course) => (
												<Tag
													key={course.code}
													closable
													onClose={() => handleCourseRemove(course.code)}
													style={{
														width: "100%",
														padding: "8px 12px",
														height: "auto",
														display: "flex",
														alignItems: "flex-start",
														justifyContent: "space-between",
														wordBreak: "break-word",
														whiteSpace: "normal",
														backgroundColor: "white",
														border: "1px solid #d9d9d9",
													}}>
													<div style={{ flex: 1, minWidth: 0 }}>
														<div style={{ marginBottom: "2px" }}>
															<Text
																strong
																style={{ fontSize: "0.875rem" }}>
																{course.code}
															</Text>
															<Tag
																color="green"
																size="small"
																style={{
																	marginLeft: "4px",
																	fontSize: "0.7rem",
																}}>
																{course.department}
															</Tag>
														</div>
														<div>
															<Text
																style={{
																	fontSize: "0.8rem",
																	wordBreak: "break-word",
																}}>
																{course.name}
															</Text>
														</div>
													</div>
												</Tag>
											))}
										</Space>
									)}
								</div>
							</Space>
						</Col>
					</Row>

					<Divider style={{ margin: "16px 0" }} />

					{/* Submit Button */}
					<Form.Item
						style={{ textAlign: "center", marginTop: "16px", marginBottom: 0 }}>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							loading={loading}
							disabled={selectedCourses.length === 0 || coursesError}
							style={{
								width: "100%",
								maxWidth: "300px",
								height: "48px",
								fontSize: "clamp(0.875rem, 3vw, 1rem)",
							}}>
							Submit Course Selection ({selectedCourses.length} courses)
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default CourseSelection;
