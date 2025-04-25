import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import Modal from "../components/Modal";
import "./Pay.css";

// Django 서버와의 통신을 위한 API 함수
const api = {
  getCartItems: async () => {
    const response = await fetch("http://localhost:8000/api/cart/", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch cart items");
    return response.json();
  },
  clearCart: async () => {
    const response = await fetch("http://localhost:8000/api/cart/clear/", {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to clear cart");
  },
};

const Pay = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  // 장바구니 목록 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const data = await api.getCartItems();
        setProducts(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      setShowLoadingModal(true);

      // 여기에 실제 결제 처리 로직이 들어갈 수 있습니다
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 결제 처리 시뮬레이션

      // 결제 성공 후 장바구니 비우기
      await api.clearCart();
      setShowLoadingModal(false);
      setShowModal(true);
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setPaymentProcessing(false);
      setShowLoadingModal(false);
    }
  };

  const handleConfirm = () => {
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>장바구니가 비어있습니다.</div>;

  return (
    <main className="pay-container">
      <div className="receipt-wrapper">
        <h1 className="receipt-title">결제 내역</h1>
        <div className="receipt-items">
          {products.map((product) => (
            <div key={product.id} className="receipt-item">
              <div className="item-info">
                <span className="item-name">{product.name}</span>
                <span className="item-details">
                  {product.category === "snack"
                    ? `수량: ${product.quantity}개`
                    : `무게: ${product.weight}kg`}
                </span>
              </div>
              <span className="item-price">
                {product.price.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
        <div className="receipt-total">
          <span>총 결제금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <PrimaryButton
          onClick={handlePayment}
          className="w-full"
          disabled={paymentProcessing}
        >
          {paymentProcessing ? "결제 처리 중..." : "결제하기"}
        </PrimaryButton>
      </div>

      {/* 결제 완료 모달 */}
      <Modal
        isOpen={showModal}
        onClose={handleConfirm}
        title="결제가 완료되었습니다"
      >
        <p>결제가 성공적으로 처리되었습니다.</p>
      </Modal>

      {/* 결제 처리 중 로딩 모달 */}
      <Modal
        isOpen={showLoadingModal}
        onClose={() => {}} // 로딩 중에는 닫기 불가능
        title="결제 처리 중"
      >
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>
            결제를 처리하고 있습니다.
            <br />
            잠시만 기다려주세요...
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default Pay;
