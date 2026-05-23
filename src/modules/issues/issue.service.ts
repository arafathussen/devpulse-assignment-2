import { pool } from "../../db/index.js";
import type { CreateIssuePayload, UpdateIssuePayload } from "./issue.interface.js";

const createIssue = async (payload: CreateIssuePayload, reporter_id: number) => {
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.title, payload.description, payload.type, reporter_id],
  );

  return result.rows[0];
};

const getAllIssues = async (sort?: string, type?: string, status?: string) => {
  let query = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  const orderDirection = sort === "oldest" ? "ASC" : "DESC";
  query += ` ORDER BY created_at ${orderDirection}`;

  const issueResult = await pool.query(query, values);
  const issues = issueResult.rows;

  if (issues.length === 0) return [];

  // Get unique reporter ids
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  // Fetch reporter data WITHOUT SQL JOIN
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const reporterMap: Record<number, { id: number; name: string; role: string }> = {};

  for (const reporter of reporterResult.rows) {
    reporterMap[reporter.id] = reporter;
  }

  // Map reporter into each issue in JavaScript
  return issues.map((issue) => {
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterMap[issue.reporter_id] || null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
};

const getIssueById = async (id: number) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) return null;

  // Fetch reporter data WITHOUT SQL JOIN
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0] || null;

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssue = async (id: number, payload: UpdateIssuePayload) => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (payload.title !== undefined) {
    values.push(payload.title);
    fields.push(`title = $${values.length}`);
  }

  if (payload.description !== undefined) {
    values.push(payload.description);
    fields.push(`description = $${values.length}`);
  }

  if (payload.type !== undefined) {
    values.push(payload.type);
    fields.push(`type = $${values.length}`);
  }

  if (payload.status !== undefined) {
    values.push(payload.status);
    fields.push(`status = $${values.length}`);
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE issues SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );

  return result.rows[0] || null;
};

const deleteIssue = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0] || null;
};

export const issueService = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
