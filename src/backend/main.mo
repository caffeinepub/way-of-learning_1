import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

actor {
  type ClassId = Nat;
  type SessionId = Nat;
  type MaterialId = Nat;
  type AssignmentId = Nat;
  type AttendanceId = Nat;
  type GradeId = Nat;

  module Attachment {
    public type ExternalBlob = Storage.ExternalBlob;
    public type VideoLink = Text;

    public func toText(a : Attachment) : Text {
      switch (a) {
        case (#file(_)) { "File(Blob)" };
        case (#videoLink(url)) { "VideoLink(" # url # ")" };
      };
    };
  };

  public type Attachment = {
    #file : Storage.ExternalBlob;
    #videoLink : Text;
  };

  public type UserType = {
    #teacher;
    #student;
    #parent;
  };

  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      p1.id.compare(p2.id);
    };

    public func compareByName(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      p1.name.compare(p2.name);
    };
  };

  public type UserProfile = {
    name : Text;
    userType : UserType;
    profilePhoto : ?Storage.ExternalBlob;
    classSection : ?Text;
    phoneNumber : Text;
    id : Text;
  };

  public type Class = {
    id : ClassId;
    name : Text;
    teacherId : Text;
    enrollmentCode : Text;
    students : [Text];
  };

  public type Session = {
    id : SessionId;
    classId : ClassId;
    title : Text;
    dateTime : Int;
    duration : Nat;
    videoLink : ?Text;
    instant : Bool;
  };

  public type StudyMaterial = {
    id : MaterialId;
    classId : ClassId;
    teacherId : Text;
    name : Text;
    material : Attachment;
  };

  public type Assignment = {
    id : AssignmentId;
    classId : ClassId;
    teacherId : Text;
    title : Text;
    description : Text;
    dueDate : Int;
    maxPoints : Nat;
  };

  public type AssignmentSubmission = {
    assignmentId : AssignmentId;
    studentId : Text;
    submissionFile : Storage.ExternalBlob;
    submissionDate : Int;
  };

  public type Grade = {
    assignmentId : AssignmentId;
    studentId : Text;
    score : Nat;
    comments : ?Text;
    gradedBy : Text;
  };

  public type AttendanceRecord = {
    attendanceId : AttendanceId;
    classId : ClassId;
    studentId : Text;
    sessionId : SessionId;
    status : AttendanceStatus;
    entryTime : Int;
  };

  public type AttendanceStatus = {
    #present;
    #absent;
    #late;
  };

  public type Quiz = {
    id : Nat;
    classId : ClassId;
    teacherId : Text;
    title : Text;
    questions : [QuizQuestion];
    timeLimit : Nat;
    passingScore : Nat;
  };

  public type QuizQuestion = {
    id : Nat;
    question : Text;
    options : [Text];
    correctAnswer : Nat;
    questionType : QuestionType;
  };

  public type QuestionType = {
    #mcq;
    #trueFalse;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    classId : ?ClassId;
    attachment : ?Storage.ExternalBlob;
  };

  let classIdCounter = Map.empty<ClassId, ()>();
  let sessionIdCounter = Map.empty<SessionId, ()>();
  let materialIdCounter = Map.empty<MaterialId, ()>();
  let assignmentIdCounter = Map.empty<AssignmentId, ()>();
  let attendanceIdCounter = Map.empty<AttendanceId, ()>();

  let classes = Map.empty<ClassId, Class>();
  let sessions = Map.empty<SessionId, Session>();
  let studyMaterials = Map.empty<MaterialId, StudyMaterial>();
  let assignments = Map.empty<AssignmentId, Assignment>();
  let assignmentSubmissions = Map.empty<AssignmentId, [AssignmentSubmission]>();
  let grades = Map.empty<GradeId, Grade>();
  let attendanceRecords = Map.empty<AttendanceId, AttendanceRecord>();
  let parentChildLinks = Map.empty<Text, [Text]>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();

  // Helper function to get user profile by ID
  func getUserProfileById(userId : Text) : ?UserProfile {
    for ((principal, profile) in userProfiles.entries()) {
      if (profile.id == userId) {
        return ?profile;
      };
    };
    null;
  };

  // Helper function to check if user is a teacher
  func isTeacher(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  // Helper function to check if user is a student
  func isStudent(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.userType) {
          case (#student) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  // Helper function to check if user is a parent
  func isParent(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.userType) {
          case (#parent) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  // Helper function to check if student is enrolled in class
  func isStudentInClass(studentId : Text, classId : ClassId) : Bool {
    switch (classes.get(classId)) {
      case (?class_) {
        class_.students.find<Text>(func(s) { s == studentId }) != null;
      };
      case (null) { false };
    };
  };

  // Helper function to check if parent has access to student
  func parentHasAccessToStudent(parentId : Text, studentId : Text) : Bool {
    switch (parentChildLinks.get(parentId)) {
      case (?children) {
        children.find<Text>(func(c) { c == studentId }) != null;
      };
      case (null) { false };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Class Management
  public query ({ caller }) func getClasses() : async [Class] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view classes");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            // Teachers see only their classes
            classes.values().toArray().filter(func(c) { c.teacherId == profile.id });
          };
          case (#student) {
            // Students see only enrolled classes
            classes.values().toArray().filter(func(c) {
              c.students.find<Text>(func(s) { s == profile.id }) != null;
            });
          };
          case (#parent) {
            // Parents see classes of their linked children
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            classes.values().toArray().filter(func(c) {
              c.students.find<Text>(func(s) {
                children.find<Text>(func(child) { child == s }) != null;
              }) != null;
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          classes.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func createClass(name : Text, enrollmentCode : Text) : async ClassId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create classes");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can create classes");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let newId = classIdCounter.size();
    let newClass : Class = {
      id = newId;
      name = name;
      teacherId = callerProfile.id;
      enrollmentCode = enrollmentCode;
      students = [];
    };
    classes.add(newId, newClass);
    classIdCounter.add(newId, ());
    newId;
  };

  public shared ({ caller }) func enrollInClass(enrollmentCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enroll in classes");
    };
    if (not isStudent(caller)) {
      Runtime.trap("Unauthorized: Only students can enroll in classes");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    var foundClass : ?Class = null;
    for ((id, class_) in classes.entries()) {
      if (class_.enrollmentCode == enrollmentCode) {
        foundClass := ?class_;
      };
    };

    switch (foundClass) {
      case (?class_) {
        let updatedStudents = class_.students.concat([callerProfile.id]);
        let updatedClass = {
          id = class_.id;
          name = class_.name;
          teacherId = class_.teacherId;
          enrollmentCode = class_.enrollmentCode;
          students = updatedStudents;
        };
        classes.add(class_.id, updatedClass);
      };
      case (null) {
        Runtime.trap("Invalid enrollment code");
      };
    };
  };

  public query ({ caller }) func getClassById(id : ClassId) : async Class {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view classes");
    };

    let class_ = switch (classes.get(id)) {
      case (null) { Runtime.trap("Class not found") };
      case (?c) { c };
    };

    let callerProfile = userProfiles.get(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            if (class_.teacherId != profile.id and not isAdmin) {
              Runtime.trap("Unauthorized: Can only view your own classes");
            };
          };
          case (#student) {
            if (not isStudentInClass(profile.id, id) and not isAdmin) {
              Runtime.trap("Unauthorized: Can only view enrolled classes");
            };
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            let hasAccess = class_.students.find<Text>(func(s) {
              children.find<Text>(func(child) { child == s }) != null;
            }) != null;
            if (not hasAccess and not isAdmin) {
              Runtime.trap("Unauthorized: Can only view classes of linked children");
            };
          };
        };
      };
      case (null) {
        if (not isAdmin) {
          Runtime.trap("Unauthorized: User profile not found");
        };
      };
    };

    class_;
  };

  // Session Management
  public query ({ caller }) func getSessions() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            sessions.values().toArray().filter(func(s) {
              switch (classes.get(s.classId)) {
                case (?c) { c.teacherId == profile.id };
                case (null) { false };
              };
            });
          };
          case (#student) {
            sessions.values().toArray().filter(func(s) {
              isStudentInClass(profile.id, s.classId);
            });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            sessions.values().toArray().filter(func(s) {
              switch (classes.get(s.classId)) {
                case (?class_) {
                  class_.students.find<Text>(func(student) {
                    children.find<Text>(func(child) { child == student }) != null;
                  }) != null;
                };
                case (null) { false };
              };
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          sessions.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func createSession(
    classId : ClassId,
    title : Text,
    dateTime : Int,
    duration : Nat,
    videoLink : ?Text,
    instant : Bool,
  ) : async SessionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can create sessions");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let class_ = switch (classes.get(classId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Class not found") };
    };

    if (class_.teacherId != callerProfile.id) {
      Runtime.trap("Unauthorized: Can only create sessions for your own classes");
    };

    let newId = sessionIdCounter.size();
    let newSession : Session = {
      id = newId;
      classId = classId;
      title = title;
      dateTime = dateTime;
      duration = duration;
      videoLink = videoLink;
      instant = instant;
    };
    sessions.add(newId, newSession);
    sessionIdCounter.add(newId, ());
    newId;
  };

  // Study Materials Management
  public query ({ caller }) func getStudyMaterials() : async [StudyMaterial] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study materials");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            studyMaterials.values().toArray().filter(func(m) {
              m.teacherId == profile.id;
            });
          };
          case (#student) {
            studyMaterials.values().toArray().filter(func(m) {
              isStudentInClass(profile.id, m.classId);
            });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            studyMaterials.values().toArray().filter(func(m) {
              switch (classes.get(m.classId)) {
                case (?class_) {
                  class_.students.find<Text>(func(student) {
                    children.find<Text>(func(child) { child == student }) != null;
                  }) != null;
                };
                case (null) { false };
              };
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          studyMaterials.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func uploadStudyMaterial(
    classId : ClassId,
    name : Text,
    material : Attachment,
  ) : async MaterialId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload study materials");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can upload study materials");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let class_ = switch (classes.get(classId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Class not found") };
    };

    if (class_.teacherId != callerProfile.id) {
      Runtime.trap("Unauthorized: Can only upload materials to your own classes");
    };

    let newId = materialIdCounter.size();
    let newMaterial : StudyMaterial = {
      id = newId;
      classId = classId;
      teacherId = callerProfile.id;
      name = name;
      material = material;
    };
    studyMaterials.add(newId, newMaterial);
    materialIdCounter.add(newId, ());
    newId;
  };

  // Assignment Management
  public query ({ caller }) func getAssignments() : async [Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assignments");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            assignments.values().toArray().filter(func(a) {
              a.teacherId == profile.id;
            });
          };
          case (#student) {
            assignments.values().toArray().filter(func(a) {
              isStudentInClass(profile.id, a.classId);
            });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            assignments.values().toArray().filter(func(a) {
              switch (classes.get(a.classId)) {
                case (?class_) {
                  class_.students.find<Text>(func(student) {
                    children.find<Text>(func(child) { child == student }) != null;
                  }) != null;
                };
                case (null) { false };
              };
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          assignments.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func createAssignment(
    classId : ClassId,
    title : Text,
    description : Text,
    dueDate : Int,
    maxPoints : Nat,
  ) : async AssignmentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create assignments");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can create assignments");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let class_ = switch (classes.get(classId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Class not found") };
    };

    if (class_.teacherId != callerProfile.id) {
      Runtime.trap("Unauthorized: Can only create assignments for your own classes");
    };

    let newId = assignmentIdCounter.size();
    let newAssignment : Assignment = {
      id = newId;
      classId = classId;
      teacherId = callerProfile.id;
      title = title;
      description = description;
      dueDate = dueDate;
      maxPoints = maxPoints;
    };
    assignments.add(newId, newAssignment);
    assignmentIdCounter.add(newId, ());
    newId;
  };

  public shared ({ caller }) func submitAssignment(
    assignmentId : AssignmentId,
    submissionFile : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit assignments");
    };
    if (not isStudent(caller)) {
      Runtime.trap("Unauthorized: Only students can submit assignments");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let assignment = switch (assignments.get(assignmentId)) {
      case (?a) { a };
      case (null) { Runtime.trap("Assignment not found") };
    };

    if (not isStudentInClass(callerProfile.id, assignment.classId)) {
      Runtime.trap("Unauthorized: Can only submit assignments for enrolled classes");
    };

    let submission : AssignmentSubmission = {
      assignmentId = assignmentId;
      studentId = callerProfile.id;
      submissionFile = submissionFile;
      submissionDate = Time.now();
    };

    let existingSubmissions = switch (assignmentSubmissions.get(assignmentId)) {
      case (?array) { array };
      case (null) { [] };
    };

    assignmentSubmissions.add(assignmentId, existingSubmissions.concat([submission]));
  };

  // Grading System
  public query ({ caller }) func getGrades() : async [Grade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view grades");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            grades.values().toArray().filter(func(g) {
              g.gradedBy == profile.id;
            });
          };
          case (#student) {
            grades.values().toArray().filter(func(g) {
              g.studentId == profile.id;
            });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            grades.values().toArray().filter(func(g) {
              children.find<Text>(func(child) { child == g.studentId }) != null;
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          grades.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func gradeAssignment(
    assignmentId : AssignmentId,
    studentId : Text,
    score : Nat,
    comments : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can grade assignments");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can grade assignments");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let assignment = switch (assignments.get(assignmentId)) {
      case (?a) { a };
      case (null) { Runtime.trap("Assignment not found") };
    };

    if (assignment.teacherId != callerProfile.id) {
      Runtime.trap("Unauthorized: Can only grade assignments for your own classes");
    };

    switch (Nat.fromText(studentId)) {
      case (?studentNat) {
        let gradeKey = assignmentId * 1000000 + studentNat;
        let grade : Grade = {
          assignmentId = assignmentId;
          studentId = studentId;
          score = score;
          comments = comments;
          gradedBy = callerProfile.id;
        };
        grades.add(gradeKey, grade);
      };
      case (null) { Runtime.trap("Invalid student ID format") };
    };
  };

  // Attendance Management
  public query ({ caller }) func getAttendanceRecords() : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance records");
    };

    let callerProfile = userProfiles.get(caller);
    switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            attendanceRecords.values().toArray().filter(func(a) {
              switch (classes.get(a.classId)) {
                case (?c) { c.teacherId == profile.id };
                case (null) { false };
              };
            });
          };
          case (#student) {
            attendanceRecords.values().toArray().filter(func(a) {
              a.studentId == profile.id;
            });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            attendanceRecords.values().toArray().filter(func(a) {
              children.find<Text>(func(child) { child == a.studentId }) != null;
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          attendanceRecords.values().toArray();
        } else {
          [];
        };
      };
    };
  };

  public shared ({ caller }) func markAttendance(
    classId : ClassId,
    sessionId : SessionId,
    studentId : Text,
    status : AttendanceStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark attendance");
    };
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can mark attendance");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let class_ = switch (classes.get(classId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Class not found") };
    };

    if (class_.teacherId != callerProfile.id) {
      Runtime.trap("Unauthorized: Can only mark attendance for your own classes");
    };

    let newId = attendanceIdCounter.size();
    let record : AttendanceRecord = {
      attendanceId = newId;
      classId = classId;
      studentId = studentId;
      sessionId = sessionId;
      status = status;
      entryTime = Time.now();
    };
    attendanceRecords.add(newId, record);
    attendanceIdCounter.add(newId, ());
  };

  // Parent-Child Linking
  public shared ({ caller }) func linkChild(studentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can link children");
    };
    if (not isParent(caller)) {
      Runtime.trap("Unauthorized: Only parents can link children");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let existingChildren = switch (parentChildLinks.get(callerProfile.id)) {
      case (?c) { c };
      case (null) { [] };
    };

    let updatedChildren = existingChildren.concat([studentId]);
    parentChildLinks.add(callerProfile.id, updatedChildren);
  };

  // Admin Functions
  public shared ({ caller }) func deleteUser(userPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };
    userProfiles.remove(userPrincipal);
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  // Approval System
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // Utility function for frontend
  public query ({ caller }) func convertedGrades() : async [(AssignmentId, Text, Text, Nat, ?Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view grades");
    };

    let callerProfile = userProfiles.get(caller);
    let filteredGrades = switch (callerProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#teacher) {
            grades.values().toArray().filter(func(g) { g.gradedBy == profile.id });
          };
          case (#student) {
            grades.values().toArray().filter(func(g) { g.studentId == profile.id });
          };
          case (#parent) {
            let children = switch (parentChildLinks.get(profile.id)) {
              case (?c) { c };
              case (null) { [] };
            };
            grades.values().toArray().filter(func(g) {
              children.find<Text>(func(child) { child == g.studentId }) != null;
            });
          };
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          grades.values().toArray();
        } else {
          [];
        };
      };
    };

    filteredGrades.map(func(g) {
      (g.assignmentId, g.studentId, g.gradedBy, g.score, g.comments);
    });
  };
};
