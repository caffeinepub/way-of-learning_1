import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Class {
    id: ClassId;
    students: Array<string>;
    name: string;
    teacherId: string;
    enrollmentCode: string;
}
export type SessionId = bigint;
export type AttendanceId = bigint;
export type MaterialId = bigint;
export interface Grade {
    studentId: string;
    gradedBy: string;
    score: bigint;
    assignmentId: AssignmentId;
    comments?: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Session {
    id: SessionId;
    title: string;
    duration: bigint;
    classId: ClassId;
    videoLink?: string;
    instant: boolean;
    dateTime: bigint;
}
export type Attachment = {
    __kind__: "file";
    file: ExternalBlob;
} | {
    __kind__: "videoLink";
    videoLink: string;
};
export interface StudyMaterial {
    id: MaterialId;
    name: string;
    classId: ClassId;
    teacherId: string;
    material: Attachment;
}
export type AssignmentId = bigint;
export interface Assignment {
    id: AssignmentId;
    title: string;
    maxPoints: bigint;
    dueDate: bigint;
    description: string;
    classId: ClassId;
    teacherId: string;
}
export type ClassId = bigint;
export interface AttendanceRecord {
    status: AttendanceStatus;
    studentId: string;
    entryTime: bigint;
    classId: ClassId;
    sessionId: SessionId;
    attendanceId: AttendanceId;
}
export interface UserProfile {
    id: string;
    userType: UserType;
    classSection?: string;
    name: string;
    profilePhoto?: ExternalBlob;
    phoneNumber: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum AttendanceStatus {
    present = "present",
    late = "late",
    absent = "absent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserType {
    teacher = "teacher",
    student = "student",
    parent = "parent"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    convertedGrades(): Promise<Array<[AssignmentId, string, string, bigint, string | null]>>;
    createAssignment(classId: ClassId, title: string, description: string, dueDate: bigint, maxPoints: bigint): Promise<AssignmentId>;
    createClass(name: string, enrollmentCode: string): Promise<ClassId>;
    createSession(classId: ClassId, title: string, dateTime: bigint, duration: bigint, videoLink: string | null, instant: boolean): Promise<SessionId>;
    deleteUser(userPrincipal: Principal): Promise<void>;
    enrollInClass(enrollmentCode: string): Promise<void>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAssignments(): Promise<Array<Assignment>>;
    getAttendanceRecords(): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClassById(id: ClassId): Promise<Class>;
    getClasses(): Promise<Array<Class>>;
    getGrades(): Promise<Array<Grade>>;
    getSessions(): Promise<Array<Session>>;
    getStudyMaterials(): Promise<Array<StudyMaterial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    gradeAssignment(assignmentId: AssignmentId, studentId: string, score: bigint, comments: string | null): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    linkChild(studentId: string): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    markAttendance(classId: ClassId, sessionId: SessionId, studentId: string, status: AttendanceStatus): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitAssignment(assignmentId: AssignmentId, submissionFile: ExternalBlob): Promise<void>;
    uploadStudyMaterial(classId: ClassId, name: string, material: Attachment): Promise<MaterialId>;
}
