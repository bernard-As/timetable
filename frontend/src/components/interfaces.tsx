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