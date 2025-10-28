import { Request, Response } from "express";

// Temporary hardcoded responses for now

export const getAllLoans = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Fetched all high-risk loan applications successfully.",
    data: [
      { id: 1, applicant: "John Doe", amount: 25000, riskLevel: "High" },
      { id: 2, applicant: "Jane Smith", amount: 40000, riskLevel: "Medium" }
    ]
  });
};

export const getLoanById = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    message: `Fetched loan application with ID: ${id}`,
    data: { id, applicant: "Test User", amount: 50000, riskLevel: "High" }
  });
};

export const createLoan = (req: Request, res: Response) => {
  res.status(201).json({
    message: "Loan application created successfully.",
    data: req.body
  });
};

export const updateLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    message: `Loan application with ID ${id} updated successfully.`,
    data: req.body
  });
};

export const deleteLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    message: `Loan application with ID ${id} deleted successfully.`
  });
};




