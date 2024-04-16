export interface DepartmentInt {
    id: number,
    name: string,
    shortname: string,
    color: string,
    icon: any|null,
    faculty: number
    description: string
    status: boolean
}
export interface FacultyInt {
    id: number,
    name: string,
    shortname: string,
    color: string,
    icon: any|null,
    faculty: number
    description: string
    status: boolean
}
export interface ProgramInt {
    id: number,
    name: string,
    shortname: string,
    color: string,
    icon: any|null,
    department: number
    description: string
    status: boolean
}
export interface CourseSemesterInt {
    id: number,
    department: number
    program: number
    semester_num:number
    semester:number
    description: string
    status: boolean
}
export interface SemesterInt {
    id: number,
    year: number,
    season: string
    status: boolean
}
export interface LecturerInt {
    id: number,
    first_name: string
    last_name: string
    email: string
    username: string
    title:any
    lecturerid: string
    program:number[] | null
    faculty:number[] | null
    department:number[] | null
    is_active: boolean
    password:string|null
    group: any
    user_permissions: any
}

export interface StudentInt {
    id: number,
    first_name: string
    last_name: string
    email: string
    username: string
    studentId: string
    program:number[] | null
    faculty:number[] | null
    department:number[] | null
    status: boolean
    password:string|null
    group: any
    user_permissions: any
}

export interface OtherStaffInt {
    id: number,
    first_name: string
    last_name: string
    email: string
    username: string
    program:number[] | null
    faculty:number[] | null
    department:number[] | null
    status: boolean
    password:string|null
    group: any
    user_permissions: any
}

export interface CourseInt {
    id: number,
    code: string
    title: string
    description: string
    type: string[]
    capacity:number
    prerequisites:number[]|null
    lecturer:number[]
    assistant:number
    lecturer_assistant:number
    duration:string
    merged_with:number[]|null
    extra_session_of:number[]|null
    max_capacity:number
    program:number[] | null
    faculty:number[] | null
    department:number[] | null
    is_elective: boolean
    status: boolean
}

export type PreferenceInt = {
    id?: number
    general?: number
    building?: number
    floor?: number
    room?: number
    faculty?: number
    department?: number
    program?: number
    course_semester?: number
    semster?: number
    course?: number
    type?: number
    event_type?: number
    position?: number
    status?: boolean
}