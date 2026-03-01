import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.model.ts";
import { Company } from "../models/company.model.ts";
import { sequelize } from "../config/db.ts";
import { generateUniqueSlug } from "../utils/slug.ts";
import type {
    RegisterInput,
    RegisterCompanyInput,
    LoginInput,
    AuthResponse,
    AuthPayload,
} from "../types/auth.types.ts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");
    return secret;
}

function signToken(payload: AuthPayload): string {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

// ─── Register User (lean) ─────────────────────────────────────────────────────

/**
 * Creates only the User record.
 * Company creation is intentionally separate to avoid ghost data.
 */
export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
    const { userName, email, password, accountType } = input;

    if (await Users.findOne({ where: { email } })) throw new Error("CONFLICT");
    if (await Users.findOne({ where: { userName } })) throw new Error("CONFLICT");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Users.create({ userName, email, password: hashedPassword, accountType });

    const payload: AuthPayload = {
        userId: user.id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
    };

    return {
        token: signToken(payload),
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            accountType: user.accountType,
            company: null,
        },
    };
}

// ─── Register Company (transactional) ────────────────────────────────────────

/**
 * Creates a Company record linked to an existing User, then updates the
 * User's accountType to 'company'. Runs inside a transaction so both
 * writes succeed or both roll back — no ghost data.
 *
 * Returns a fresh JWT reflecting the updated accountType.
 */
export async function registerCompany(
    userId: number,
    input: RegisterCompanyInput,
): Promise<AuthResponse> {
    const { companyName, companyEmail } = input;

    const user = await Users.findByPk(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    // Prevent duplicate company ownership (1-to-1 relationship)
    const existing = await Company.findOne({ where: { userId } });
    if (existing) throw new Error("COMPANY_ALREADY_EXISTS");

    // Check company email uniqueness
    if (await Company.findOne({ where: { email: companyEmail } })) {
        throw new Error("COMPANY_EMAIL_TAKEN");
    }

    const slug = await generateUniqueSlug(companyName);

    // Atomic: create Company + update User.accountType together
    const company = await sequelize.transaction(async (t) => {
        const newCompany = await Company.create(
            { userId, name: companyName, slug, email: companyEmail },
            { transaction: t },
        );
        await user.update({ accountType: "company" }, { transaction: t });
        return newCompany;
    });

    // Issue a fresh JWT with the updated accountType
    const payload: AuthPayload = {
        userId: user.id,
        userName: user.userName,
        email: user.email,
        accountType: "company",
    };

    return {
        token: signToken(payload),
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            accountType: "company",
            company: {
                id: company.id,
                name: company.name,
                slug: company.slug,
                email: company.email,
            },
        },
    };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await Users.findOne({
        where: { email },
        include: [{ model: Company, as: "company" }],
    });

    if (!user) throw new Error("INVALID_CREDENTIALS");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("INVALID_CREDENTIALS");

    const company = (user as Users & { company?: Company | null }).company ?? null;

    const payload: AuthPayload = {
        userId: user.id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
    };

    return {
        token: signToken(payload),
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            accountType: user.accountType,
            company: company
                ? { id: company.id, name: company.name, slug: company.slug, email: company.email }
                : null,
        },
    };
}
