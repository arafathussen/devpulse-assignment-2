import type { Request, Response } from "express";

import { sendResponse } from "../../utils/sendResponse.js";
import { issueService } from "./issue.service.js";

const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (title && title.length > 150) {
      sendResponse(res, { message: "Validation Error", errors: "Title cannot exceed 150 characters" }, 400);
      return;
    }
    if (description && description.length < 20) {
      sendResponse(res, { message: "Validation Error", errors: "Description must be at least 20 characters long" }, 400);
      return;
    }

    const reporter_id = req.user!.id;

    const issue = await issueService.createIssue({ title, description, type }, reporter_id);

    sendResponse(res, { message: "Issue created successfully", data: issue }, 201);
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query as {
      sort?: string;
      type?: string;
      status?: string;
    };

    const issues = await issueService.getAllIssues(sort, type, status);

    sendResponse(res, { data: issues });
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

const getIssueById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const issue = await issueService.getIssueById(id);

    if (!issue) {
      sendResponse(res, { message: "Issue not found", errors: "Not Found" }, 404);
      return;
    }

    sendResponse(res, { data: issue });
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, type, status } = req.body;

    if (title !== undefined && title.length > 150) {
      sendResponse(res, { message: "Validation Error", errors: "Title cannot exceed 150 characters" }, 400);
      return;
    }
    if (description !== undefined && description.length < 20) {
      sendResponse(res, { message: "Validation Error", errors: "Description must be at least 20 characters long" }, 400);
      return;
    }

    const currentUser = req.user!;

    const existingIssue = await issueService.getIssueById(id);

    if (!existingIssue) {
      sendResponse(res, { message: "Issue not found", errors: "Not Found" }, 404);
      return;
    }

    // Permission check for contributor
    if (currentUser.role === "contributor") {
      if (existingIssue.reporter.id !== currentUser.id) {
        sendResponse(res, { message: "You can only update your own issues", errors: "Forbidden" }, 403);
        return;
      }

      if (existingIssue.status !== "open") {
        sendResponse(res, { message: "You can only update issues with open status", errors: "Conflict" }, 409);
        return;
      }
    }

    // Only maintainer can update status
    const updatePayload = currentUser.role === "maintainer"
      ? { title, description, type, status }
      : { title, description, type };

    const updated = await issueService.updateIssue(id, updatePayload);

    sendResponse(res, { message: "Issue updated successfully", data: updated });
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user!;

    if (currentUser.role !== "maintainer") {
      sendResponse(res, { message: "Only maintainers can delete issues", errors: "Forbidden" }, 403);
      return;
    }

    const id = parseInt(req.params.id as string);
    const deleted = await issueService.deleteIssue(id);

    if (!deleted) {
      sendResponse(res, { message: "Issue not found", errors: "Not Found" }, 404);
      return;
    }

    sendResponse(res, { message: "Issue deleted successfully" });
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
