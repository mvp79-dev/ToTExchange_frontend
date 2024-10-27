import { useState, useEffect } from "react";
import ListOrders from "./ListOrders";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import OrderDetail from "./OrderDetail";

export default function AllOrder() {
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [queries] = useSearchParams();
  const navigate = useNavigate();

  const handleViewDetailOrder = (id: number) => {
    setSelectedOrder(id);
    navigate({
      pathname: ERoutePath.MY_ORDER,
      search: `orderId=${id}`,
    });
  };

  const handleBack = () => {
    setSelectedOrder(0);
    navigate({
      pathname: ERoutePath.MY_ORDER,
    });
  };

  useEffect(() => {
    const orderid = queries.get("orderId");
    const selectedOrder = Number(orderid);

    if (selectedOrder) {
      setSelectedOrder(selectedOrder);
    }
  }, [queries]);

  if (selectedOrder) {
    return (
      <OrderDetail handleBack={handleBack} selectedOrderId={selectedOrder} />
    );
  }
  return <ListOrders handleViewDetailOrder={handleViewDetailOrder} />;
}
