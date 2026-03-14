export async function getTransactions() {
  const res = await fetch('/api/users/me/transactions');
  if (!res.ok) throw new Error('Error al cargar transacciones');
  return res.json();
}

export async function requestRecharge(amount, file) {
  const formData = new FormData();
  formData.append('amount', amount);
  formData.append('receipt', file);
  const res = await fetch('/api/users/me/wallet/recharge', {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al recargar');
  return json;
}
