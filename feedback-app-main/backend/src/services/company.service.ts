import { Company } from "../models/company.model.ts";
import { Feedback } from "../models/feedback.model.ts";

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
                    "upvotes",
                    "createdAt",
                ],
            },
        ],
    });
}
