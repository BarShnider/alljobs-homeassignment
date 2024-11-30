// OrderTotal.tsx

interface OrderTotalProps {
  total: number;
}

export default function OrderTotal({ total }: OrderTotalProps) {
  return (
    <div className="total-wrapper">
      <span className="total-label">Total: {total.toFixed(2)}$</span>
    </div>
  );
}
