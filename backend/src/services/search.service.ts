import { Op } from 'sequelize';
import { Company } from '../models/company.model.ts';
import { Feedback } from '../models/feedback.model.ts';
import { FeedbackReply } from '../models/feedback.reply.model.ts';
import { Users } from '../models/users.model.ts';

type ReplyWithRelations = FeedbackReply & {
  feedback: Feedback & {
    company: Company;
  };
};

const MAX_QUERY_LENGTH = 120;
const MAX_RESULTS_PER_SECTION = 8;

export interface SearchResults {
  query: string;
  companies: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
  }>;
  feedbacks: Array<{
    id: number;
    title: string;
    description: string | null;
    status: string;
    createdAt: Date;
    company: {
      id: number;
      name: string;
      slug: string;
      logoUrl: string | null;
    };
    requester: {
      id: number;
      name: string;
    } | null;
    visibility: 'public' | 'anonymous';
  }>;
  replies: Array<{
    id: number;
    content: string;
    createdAt: Date;
    feedbackId: number;
    feedbackTitle: string;
    company: {
      id: number;
      name: string;
      slug: string;
      logoUrl: string | null;
    };
    author: {
      id: number;
      type: 'user' | 'company';
      name: string;
    } | null;
    visibility: 'public' | 'anonymous';
  }>;
}

function normalizeQuery(query: string): string {
  return query.trim().slice(0, MAX_QUERY_LENGTH);
}

function buildLikePattern(query: string): string {
  return `%${query}%`;
}

export async function advancedSearch(rawQuery: string): Promise<SearchResults> {
  const query = normalizeQuery(rawQuery);

  if (!query) {
    return {
      query: '',
      companies: [],
      feedbacks: [],
      replies: [],
    };
  }

  const pattern = buildLikePattern(query);

  const [companies, feedbacks, replies] = await Promise.all([
    Company.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: pattern } },
          { slug: { [Op.iLike]: pattern } },
          { description: { [Op.iLike]: pattern } },
        ],
      },
      attributes: ['id', 'name', 'slug', 'description', 'logoUrl'],
      order: [['name', 'ASC']],
      limit: MAX_RESULTS_PER_SECTION,
    }),
    Feedback.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: pattern } },
          { description: { [Op.iLike]: pattern } },
        ],
      },
      attributes: [
        'id',
        'title',
        'description',
        'status',
        'createdAt',
        'isAnonymous',
      ],
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'slug', 'logoUrl'],
          required: true,
        },
        {
          model: Users,
          as: 'requester',
          attributes: ['id', 'firstName', 'lastName'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: MAX_RESULTS_PER_SECTION,
    }),
    FeedbackReply.findAll({
      where: {
        content: { [Op.iLike]: pattern },
      },
      attributes: [
        'id',
        'content',
        'createdAt',
        'authorId',
        'authorType',
        'isAnonymous',
      ],
      include: [
        {
          model: Feedback,
          as: 'feedback',
          attributes: ['id', 'title'],
          include: [
            {
              model: Company,
              as: 'company',
              attributes: ['id', 'name', 'slug', 'logoUrl'],
              required: true,
            },
          ],
          required: true,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: MAX_RESULTS_PER_SECTION,
    }),
  ]);

  const userAuthorIds = Array.from(
    new Set(
      replies
        .filter((reply) => reply.authorType === 'user')
        .map((reply) => reply.authorId),
    ),
  );
  const companyAuthorIds = Array.from(
    new Set(
      replies
        .filter((reply) => reply.authorType === 'company')
        .map((reply) => reply.authorId),
    ),
  );

  const [userAuthors, companyAuthors] = await Promise.all([
    userAuthorIds.length
      ? Users.findAll({
          where: { id: userAuthorIds },
          attributes: ['id', 'firstName', 'lastName'],
        })
      : Promise.resolve([]),
    companyAuthorIds.length
      ? Company.findAll({
          where: { id: companyAuthorIds },
          attributes: ['id', 'name'],
        })
      : Promise.resolve([]),
  ]);

  const userAuthorMap = new Map(
    userAuthors.map((user) => [
      user.id,
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User',
    ]),
  );
  const companyAuthorMap = new Map(
    companyAuthors.map((company) => [company.id, company.name]),
  );

  return {
    query,
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      description: company.description,
      logoUrl: company.logoUrl,
    })),
    feedbacks: feedbacks.map((feedback) => ({
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      status: feedback.status,
      createdAt: feedback.createdAt,
      company: {
        id: feedback.company!.id,
        name: feedback.company!.name,
        slug: feedback.company!.slug,
        logoUrl: feedback.company!.logoUrl,
      },
      requester: feedback.isAnonymous
        ? null
        : feedback.requester
          ? {
              id: feedback.requester.id,
              name:
                `${feedback.requester.firstName} ${feedback.requester.lastName}`.trim() ||
                'User',
            }
          : null,
      visibility: feedback.isAnonymous ? 'anonymous' : 'public',
    })),
    replies: replies.map((reply) => {
      const withRelations = reply as ReplyWithRelations;

      return {
        id: withRelations.id,
        content: withRelations.content,
        createdAt: withRelations.createdAt,
        feedbackId: withRelations.feedback.id,
        feedbackTitle: withRelations.feedback.title,
        company: {
          id: withRelations.feedback.company.id,
          name: withRelations.feedback.company.name,
          slug: withRelations.feedback.company.slug,
          logoUrl: withRelations.feedback.company.logoUrl,
        },
        author: withRelations.isAnonymous
          ? null
          : {
              id: withRelations.authorId,
              type: withRelations.authorType,
              name:
                withRelations.authorType === 'user'
                  ? (userAuthorMap.get(withRelations.authorId) ?? 'User')
                  : (companyAuthorMap.get(withRelations.authorId) ?? 'Company'),
            },
        visibility: withRelations.isAnonymous ? 'anonymous' : 'public',
      };
    }),
  };
}
