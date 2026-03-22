import { Company } from "../models/company.model.ts";
import { Feedback } from "../models/feedback.model.ts";

export async function getAllCompanies() {
    return Company.findAll({
        attributes: ["id", "name", "slug"],
        order: [["name", "ASC"]],
    });
}

export async function findCompanyBySlug(slug: string) {
    return Company.findOne({
        where: { slug },
        include: [
            {
                model: Feedback,
                as: "feedbacks",
                attributes: [
                    "id",
                    "title",
                    "description",
                    "status",
                    "createdBy",
                    "upvotes",
                    "createdAt",
                ],
            },
        ],
    });
}

export async function getCompanyFeaturesStats(companyId: number) {
    const features = await Feedback.findAll({
        where: { companyId },
        order: [["createdAt", "DESC"]],
    });

    const totalVoteCount = features.reduce((sum, f) => sum + (f.upvotes || 0), 0);

    return {
        features,
        totalVoteCount,
    };
}
