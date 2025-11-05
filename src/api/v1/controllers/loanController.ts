import { Request, Response } from "express";
import { db } from "../../../config/firebaseConfig";
import { getAllLoansFromDB } from "../services/loanService"
import { HTTP_STATUS } from "../../../constants/httpConstants";

const loansCollection = db.collection("loans");

let loans = [
  { id: "1", applicantName: "John Doe", amount: 25000, riskLevel: "High" },
  { id: "2", applicantName: "Jane Smith", amount: 40000, riskLevel: "Medium" },
];

// Get all loans
export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const allLoans = await getAllLoansFromDB(); // fetch loans

    // Send response with `data` key to match tests
    res.status(HTTP_STATUS.OK).json({
      message: "Fetched all loan applications successfully.",
      data: allLoans,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch loans",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get loan by ID
export const getLoanById = (req: Request, res: Response) => {
  const { id } = req.params;
  const loan = loans.find((l) => l.id === id);
  if (!loan) {
    return res.status(404).json({ message: "Loan not found" });
  }
  res.status(200).json({
    message: `Fetched loan application with ID: ${id}`,
    data: loan,
  });
};

// Create a new loan
export const createLoan = (req: Request, res: Response) => {
  const newLoan = { id: (loans.length + 1).toString(), ...req.body };
  loans.push(newLoan);
  res.status(201).json({
    message: "Loan application created successfully.",
    data: newLoan,
  });
};

// Update a loan by ID
export const updateLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Loan not found" });
  }
  loans[index] = { ...loans[index], ...req.body };
  res.status(200).json({
    message: `Loan application with ID ${id} updated successfully.`,
    data: loans[index],
  });
};

// Delete a loan by ID
export const deleteLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Loan not found" });
  }
  loans.splice(index, 1);
  res.status(200).json({
    message: `Loan application with ID ${id} deleted successfully.`,
  });
};