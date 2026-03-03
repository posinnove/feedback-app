// backend/models/index.ts
import { sequelize } from "../config/db";
import { Users } from "./users.model";
import { Feedback } from "./feedback.model";

export { sequelize, Users, Feedback };