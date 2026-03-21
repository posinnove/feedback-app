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
