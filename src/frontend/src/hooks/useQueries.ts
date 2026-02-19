import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  Class,
  Session,
  StudyMaterial,
  Assignment,
  Grade,
  AttendanceRecord,
  Attachment,
  AttendanceStatus,
  ApprovalStatus,
  UserApprovalInfo,
  ClassId,
  AssignmentId,
  SessionId,
} from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      console.log('[useQueries] Fetched user profile:', profile?.userType);
      return profile;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useQueries] Saving user profile:', profile.userType);
      await actor.saveCallerUserProfile(profile);
      console.log('[useQueries] Profile saved successfully');
    },
    onSuccess: async () => {
      console.log('[useQueries] Invalidating currentUserProfile query');
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await queryClient.refetchQueries({ queryKey: ['currentUserProfile'] });
      console.log('[useQueries] Profile query invalidated and refetched');
    },
    onError: (error) => {
      console.error('[useQueries] Error saving profile:', error);
    },
  });
}

export function useGetClasses() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClasses();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, enrollmentCode }: { name: string; enrollmentCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClass(name, enrollmentCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

export function useEnrollInClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentCode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enrollInClass(enrollmentCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

export function useGetClassById(classId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Class>({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClassById(BigInt(classId));
    },
    enabled: !!actor && !actorFetching && !!classId,
  });
}

export function useGetSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      title,
      dateTime,
      duration,
      videoLink,
      instant,
    }: {
      classId: ClassId;
      title: string;
      dateTime: bigint;
      duration: bigint;
      videoLink: string | null;
      instant: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(classId, title, dateTime, duration, videoLink, instant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useGetStudyMaterials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StudyMaterial[]>({
    queryKey: ['studyMaterials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudyMaterials();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadStudyMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      name,
      material,
    }: {
      classId: ClassId;
      name: string;
      material: Attachment;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadStudyMaterial(classId, name, material);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyMaterials'] });
    },
  });
}

export function useGetAssignments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Assignment[]>({
    queryKey: ['assignments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssignments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      title,
      description,
      dueDate,
      maxPoints,
    }: {
      classId: ClassId;
      title: string;
      description: string;
      dueDate: bigint;
      maxPoints: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAssignment(classId, title, description, dueDate, maxPoints);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useSubmitAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      submissionFile,
    }: {
      assignmentId: AssignmentId;
      submissionFile: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAssignment(assignmentId, submissionFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useGetGrades() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Grade[]>({
    queryKey: ['grades'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrades();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGradeAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      studentId,
      score,
      comments,
    }: {
      assignmentId: AssignmentId;
      studentId: string;
      score: bigint;
      comments: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.gradeAssignment(assignmentId, studentId, score, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}

export function useGetAttendanceRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      sessionId,
      studentId,
      status,
    }: {
      classId: ClassId;
      sessionId: SessionId;
      studentId: string;
      status: AttendanceStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markAttendance(classId, sessionId, studentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useLinkChild() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.linkChild(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteUser(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}
