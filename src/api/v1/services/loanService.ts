// src/api/v1/services/loanService.ts

export interface Loan {
  id: string;
  applicantName: string;
  amount: number;
  riskLevel: "High" | "Medium" | "Low";
}

// Mock function to fetch loans
export const getAllLoansFromDB = async (): Promise<Loan[]> => {
  return [
    { id: "1", applicantName: "John Doe", amount: 25000, riskLevel: "High" },
    { id: "2", applicantName: "Jane Smith", amount: 40000, riskLevel: "Medium" },
  ];
};
