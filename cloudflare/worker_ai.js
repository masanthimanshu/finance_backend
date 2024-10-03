import { postRequest } from "../network/requests.js";

const llm = process.env.LLM_MODEL;
const cloudflareId = process.env.CLOUDFLARE_ACCOUNT_ID;
const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;

export const workerAi = async (input) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareId}/ai/run/${llm}`;

  const body = {
    messages: [
      {
        role: "system",
        content: `You are a friendly assistant. We will provide you with chat data. 
        The data will have an Indian context and might include the names of some
        Indian companies. Categorize the conversation into Income, Expense, Savings,
        and Investment categories and sub-categories using the following categories
        and sub-categories. Income - Salary, Interest, Dividends, Rental Income,
        Reimbursement, Business Income, Freelance/Gig Work, Bonuses/Commissions.
        Expense - Fuel, Rent, Hobbies, Clothing, Groceries, Medical Bill, Books/Courses,
        EMI/Credit Card, Movies/Concerts, Public Transport, Travel/Vacations,
        Insurance Premium, Water/Electricity, Maintenance/Repairs, Eating Out/Ordering In.
        Savings - Emergency Fund, General Savings, Short-term Goals. Investment - Bonds,
        Real Estate, Stocks/ETFs, Mutual Funds, Cryptocurrency. Do not make categories
        your own. Keep responses consistent and according to the provided data. Do not
        provide complete sentences. Reply as category -> sub-category -> amount.`,
      },
      { role: "user", content: input },
    ],
  };

  const llmResponse = await postRequest(url, body, {
    Authorization: `Bearer ${cloudflareToken}`,
  });

  return llmResponse.result.response;
};
