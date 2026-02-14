"use strict";
// Team domain types
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRole = exports.InvitationStatus = exports.TeamStatus = void 0;
var TeamStatus;
(function (TeamStatus) {
    TeamStatus["FORMING"] = "forming";
    TeamStatus["COMPLETE"] = "complete";
    TeamStatus["DISBANDED"] = "disbanded";
})(TeamStatus || (exports.TeamStatus = TeamStatus = {}));
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "pending";
    InvitationStatus["ACCEPTED"] = "accepted";
    InvitationStatus["REJECTED"] = "rejected";
    InvitationStatus["EXPIRED"] = "expired";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
var MemberRole;
(function (MemberRole) {
    MemberRole["CAPTAIN"] = "captain";
    MemberRole["MEMBER"] = "member";
})(MemberRole || (exports.MemberRole = MemberRole = {}));
