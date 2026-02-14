"use strict";
// Hackathon domain types
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantStatus = exports.HackathonStatus = void 0;
var HackathonStatus;
(function (HackathonStatus) {
    HackathonStatus["DRAFT"] = "draft";
    HackathonStatus["REGISTRATION_OPEN"] = "registration_open";
    HackathonStatus["REGISTRATION_CLOSED"] = "registration_closed";
    HackathonStatus["IN_PROGRESS"] = "in_progress";
    HackathonStatus["COMPLETED"] = "completed";
    HackathonStatus["CANCELLED"] = "cancelled";
})(HackathonStatus || (exports.HackathonStatus = HackathonStatus = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["REGISTERED"] = "registered";
    ParticipantStatus["IN_TEAM"] = "in_team";
    ParticipantStatus["WITHDRAWN"] = "withdrawn";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
