export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { amountXOF, phoneNumber, description } = req.body;

  if (!amountXOF || amountXOF < 100) {
    return res.status(400).json({ error: "Montant minimum : 100 FCFA" });
  }

  try {
    const response = await fetch("https://app.paydunya.com/api/v1/disburse/get-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
        "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY,
        "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN,
      },
      body: JSON.stringify({
        account_alias: phoneNumber,
        amount: amountXOF,
        withdraw_mode: "orange-money-burkina",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payout-callback`,
        description: description || "Versement des revenus MIKE TOK",
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
          }
