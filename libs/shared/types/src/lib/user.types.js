"use strict";
// User domain types
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillCategory = exports.ProficiencyLevel = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["ORGANIZER"] = "organizer";
    UserRole["SPONSOR"] = "sponsor";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProficiencyLevel;
(function (ProficiencyLevel) {
    ProficiencyLevel["BEGINNER"] = "beginner";
    ProficiencyLevel["INTERMEDIATE"] = "intermediate";
    ProficiencyLevel["ADVANCED"] = "advanced";
    ProficiencyLevel["EXPERT"] = "expert";
})(ProficiencyLevel || (exports.ProficiencyLevel = ProficiencyLevel = {}));
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["FRONTEND"] = "frontend";
    SkillCategory["BACKEND"] = "backend";
    SkillCategory["DESIGN"] = "design";
    SkillCategory["DATA_SCIENCE"] = "data_science";
    SkillCategory["MOBILE"] = "mobile";
    SkillCategory["DEVOPS"] = "devops";
    SkillCategory["PM"] = "product_management";
    SkillCategory["OTHER"] = "other";
})(SkillCategory || (exports.SkillCategory = SkillCategory = {}));
